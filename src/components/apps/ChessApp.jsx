import { useState, useCallback, useEffect, useRef } from "react";

// ─── CHESS PIECES UNICODE ─────────────────────────────────
const PIECES = {
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

const INITIAL_BOARD = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"],
];

// ─── HELPERS ──────────────────────────────────────────────
function cloneBoard(b) { return b.map(r => [...r]); }
function isWhite(p) { return p && p === p.toUpperCase(); }
function isBlack(p) { return p && p === p.toLowerCase(); }
function isOwn(p, turn) { return turn === "w" ? isWhite(p) : isBlack(p); }
function isEnemy(p, turn) { return turn === "w" ? isBlack(p) : isWhite(p); }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getPseudoMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  const moves = [];
  const color = isWhite(piece) ? "w" : "b";
  const type = piece.toLowerCase();
  const dirs = {
    rook: [[1,0],[-1,0],[0,1],[0,-1]],
    bishop: [[1,1],[1,-1],[-1,1],[-1,-1]],
    queen: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
    king: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
    knight: [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]],
  };

  if (type === "p") {
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    if (inBounds(row+dir, col) && !board[row+dir][col]) {
      moves.push([row+dir, col]);
      if (row === startRow && !board[row+dir*2][col]) moves.push([row+dir*2, col]);
    }
    for (const dc of [-1, 1]) {
      if (inBounds(row+dir, col+dc) && isEnemy(board[row+dir][col+dc], color))
        moves.push([row+dir, col+dc]);
    }
  } else if (type === "n") {
    for (const [dr, dc] of dirs.knight) {
      const nr = row+dr, nc = col+dc;
      if (inBounds(nr, nc) && !isOwn(board[nr][nc], color)) moves.push([nr, nc]);
    }
  } else if (type === "k") {
    for (const [dr, dc] of dirs.king) {
      const nr = row+dr, nc = col+dc;
      if (inBounds(nr, nc) && !isOwn(board[nr][nc], color)) moves.push([nr, nc]);
    }
  } else {
    const slideSet = type === "r" ? dirs.rook : type === "b" ? dirs.bishop : dirs.queen;
    for (const [dr, dc] of slideSet) {
      let nr = row+dr, nc = col+dc;
      while (inBounds(nr, nc)) {
        if (isOwn(board[nr][nc], color)) break;
        moves.push([nr, nc]);
        if (isEnemy(board[nr][nc], color)) break;
        nr += dr; nc += dc;
      }
    }
  }
  return moves;
}

function findKing(board, color) {
  const king = color === "w" ? "K" : "k";
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === king) return [r, c];
  return null;
}

function isInCheck(board, color) {
  const kp = findKing(board, color);
  if (!kp) return false;
  const enemy = color === "w" ? "b" : "w";
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (isOwn(board[r][c], enemy)) {
        const moves = getPseudoMoves(board, r, c);
        if (moves.some(([mr, mc]) => mr === kp[0] && mc === kp[1])) return true;
      }
  return false;
}

function getLegalMoves(board, row, col, turn) {
  const piece = board[row][col];
  if (!piece || !isOwn(piece, turn)) return [];
  return getPseudoMoves(board, row, col).filter(([nr, nc]) => {
    const nb = cloneBoard(board);
    nb[nr][nc] = nb[row][col];
    nb[row][col] = null;
    return !isInCheck(nb, turn);
  });
}

function hasAnyLegalMove(board, turn) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (isOwn(board[r][c], turn) && getLegalMoves(board, r, c, turn).length > 0)
        return true;
  return false;
}

function makeMove(board, fr, fc, tr, tc) {
  const nb = cloneBoard(board);
  const piece = nb[fr][fc];
  nb[tr][tc] = piece;
  nb[fr][fc] = null;
  if (piece === "P" && tr === 0) nb[tr][tc] = "Q";
  if (piece === "p" && tr === 7) nb[tr][tc] = "q";
  return nb;
}

// ─── AI (Minimax with Alpha-Beta, depth 3) ────────────────
function evaluateBoard(board) {
  let score = 0;
  // Piece-square tables for positional play (simplified)
  const centerBonus = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,1,2,2,1,0,0],
    [0,0,2,3,3,2,0,0],
    [0,0,2,3,3,2,0,0],
    [0,0,1,2,2,1,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const val = PIECE_VALUES[p.toLowerCase()] || 0;
      const pos = centerBonus[r][c] * 0.1;
      if (isWhite(p)) {
        score += val + pos;
      } else {
        score -= val + pos;
      }
    }
  }
  return score;
}

function getAllMoves(board, turn) {
  const moves = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (isOwn(board[r][c], turn)) {
        const legal = getLegalMoves(board, r, c, turn);
        for (const [tr, tc] of legal) moves.push({ fr: r, fc: c, tr, tc });
      }
  return moves;
}

function minimax(board, depth, alpha, beta, maximizing) {
  if (depth === 0) return evaluateBoard(board);

  const turn = maximizing ? "w" : "b";
  const moves = getAllMoves(board, turn);

  if (moves.length === 0) {
    if (isInCheck(board, turn)) return maximizing ? -9999 : 9999;
    return 0; // stalemate
  }

  if (maximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const nb = makeMove(board, m.fr, m.fc, m.tr, m.tc);
      const ev = minimax(nb, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const nb = makeMove(board, m.fr, m.fc, m.tr, m.tc);
      const ev = minimax(nb, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestMove(board) {
  const moves = getAllMoves(board, "b");
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestEval = Infinity;

  for (const m of moves) {
    const nb = makeMove(board, m.fr, m.fc, m.tr, m.tc);
    const ev = minimax(nb, 2, -Infinity, Infinity, true); // depth 2 from here = 3 total
    if (ev < bestEval) {
      bestEval = ev;
      bestMove = m;
    }
  }
  return bestMove;
}

// ─── COMPONENT ────────────────────────────────────────────
export function ChessApp() {
  const [board, setBoard] = useState(cloneBoard(INITIAL_BOARD));
  const [turn, setTurn] = useState("w");
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [status, setStatus] = useState("");
  const [lastMove, setLastMove] = useState(null);
  const [thinking, setThinking] = useState(false);
  const boardRef = useRef(null);
  const containerRef = useRef(null);
  const [boardSize, setBoardSize] = useState(360);

  // Responsive board sizing
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Leave room for header (60px) and button (50px)
      const availH = rect.height - 130;
      const availW = rect.width - 40;
      const size = Math.max(200, Math.min(availW, availH, 560));
      setBoardSize(size);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const resetGame = useCallback(() => {
    setBoard(cloneBoard(INITIAL_BOARD));
    setTurn("w");
    setSelected(null);
    setLegalMoves([]);
    setCaptured({ w: [], b: [] });
    setStatus("");
    setLastMove(null);
    setThinking(false);
  }, []);

  // AI move
  useEffect(() => {
    if (turn !== "b" || status) return;

    setThinking(true);
    const timer = setTimeout(() => {
      const move = getBestMove(board);
      if (!move) {
        setStatus(isInCheck(board, "b") ? "You win!" : "Stalemate!");
        setThinking(false);
        return;
      }

      const captured_piece = board[move.tr][move.tc];
      const nb = makeMove(board, move.fr, move.fc, move.tr, move.tc);

      if (captured_piece) {
        setCaptured(prev => ({ ...prev, b: [...prev.b, captured_piece] }));
      }

      setBoard(nb);
      setLastMove({ from: [move.fr, move.fc], to: [move.tr, move.tc] });

      const inCheck = isInCheck(nb, "w");
      const hasMove = hasAnyLegalMove(nb, "w");

      if (!hasMove) {
        setStatus(inCheck ? "Checkmate! You lose." : "Stalemate!");
      } else if (inCheck) {
        setStatus("Check!");
        setTimeout(() => setStatus(""), 1800);
      }

      setTurn("w");
      setThinking(false);
    }, 400); // Small delay so the "thinking" state renders

    return () => clearTimeout(timer);
  }, [turn, board, status]);

  const handleSquareClick = useCallback((row, col) => {
    if (status && !status.includes("Check!")) return;
    if (turn !== "w" || thinking) return; // only let human play white

    const piece = board[row][col];

    if (selected) {
      const [sr, sc] = selected;
      if (sr === row && sc === col) {
        setSelected(null); setLegalMoves([]); return;
      }
      if (isOwn(piece, "w")) {
        setSelected([row, col]);
        setLegalMoves(getLegalMoves(board, row, col, "w"));
        return;
      }
      const isLegal = legalMoves.some(([mr, mc]) => mr === row && mc === col);
      if (isLegal) {
        const captured_piece = board[row][col];
        const nb = makeMove(board, sr, sc, row, col);

        if (captured_piece) {
          setCaptured(prev => ({ ...prev, w: [...prev.w, captured_piece] }));
        }

        setBoard(nb);
        setLastMove({ from: [sr, sc], to: [row, col] });
        setSelected(null);
        setLegalMoves([]);

        const inCheck = isInCheck(nb, "b");
        const hasMove = hasAnyLegalMove(nb, "b");

        if (!hasMove) {
          setStatus(inCheck ? "Checkmate! You win!" : "Stalemate!");
        } else if (inCheck) {
          setStatus("Check!");
          setTimeout(() => setStatus(""), 1800);
        }

        setTurn("b");
      } else {
        setSelected(null); setLegalMoves([]);
      }
    } else {
      if (piece && isOwn(piece, "w")) {
        setSelected([row, col]);
        setLegalMoves(getLegalMoves(board, row, col, "w"));
      }
    }
  }, [board, turn, selected, legalMoves, status, thinking]);

  const isLegalTarget = (r, c) => legalMoves.some(([mr, mc]) => mr === r && mc === c);
  const isSelected = (r, c) => selected && selected[0] === r && selected[1] === c;
  const isLastMoveSquare = (r, c) =>
    lastMove &&
    ((lastMove.from[0] === r && lastMove.from[1] === c) ||
      (lastMove.to[0] === r && lastMove.to[1] === c));

  const gameOver = status && !status.includes("Check!");
  const sqSize = boardSize / 8;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(30, 30, 32, 0.55)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        padding: "16px",
        gap: "12px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Top Info Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", maxWidth: boardSize + "px", justifyContent: "space-between" }}>
        {/* Captured by White */}
        <div style={{ display: "flex", gap: "1px", flexWrap: "wrap", flex: 1, minHeight: "22px" }}>
          {captured.w.map((p, i) => (
            <span key={i} style={{ fontSize: "14px", opacity: 0.6 }}>{PIECES[p]}</span>
          ))}
        </div>

        {/* Status */}
        <div
          style={{
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: gameOver
              ? (status.includes("win") ? "#34D399" : "#FB923C")
              : thinking ? "#A78BFA" : "rgba(255,255,255,0.7)",
            background: gameOver
              ? (status.includes("win") ? "rgba(52,211,153,0.12)" : "rgba(251,146,60,0.12)")
              : thinking ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${gameOver ? (status.includes("win") ? "rgba(52,211,153,0.3)" : "rgba(251,146,60,0.3)") : "rgba(255,255,255,0.08)"}`,
            whiteSpace: "nowrap",
          }}
        >
          {gameOver ? status : thinking ? "Thinking..." : status === "Check!" ? "Check!" : "Your move"}
        </div>

        {/* Captured by Black */}
        <div style={{ display: "flex", gap: "1px", flexWrap: "wrap", flex: 1, justifyContent: "flex-end", minHeight: "22px" }}>
          {captured.b.map((p, i) => (
            <span key={i} style={{ fontSize: "14px", opacity: 0.6 }}>{PIECES[p]}</span>
          ))}
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          width: boardSize + "px",
          height: boardSize + "px",
          touchAction: "manipulation",
          flexShrink: 0,
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((piece, c) => {
            const isDark = (r + c) % 2 === 1;
            const sel = isSelected(r, c);
            const legal = isLegalTarget(r, c);
            const lastMv = isLastMoveSquare(r, c);

            let bg = isDark ? "#779556" : "#EBECD0";
            if (lastMv) bg = isDark ? "#BBCA2B" : "#F6F669";
            if (sel) bg = "#7FC8F8";
            if (legal && piece) bg = isDark ? "#E8706E" : "#F5ABAB";

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                onTouchEnd={(e) => { e.preventDefault(); handleSquareClick(r, c); }}
                style={{
                  width: sqSize + "px",
                  height: sqSize + "px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: bg,
                  cursor: turn === "w" && !thinking && !gameOver ? "pointer" : "default",
                  position: "relative",
                  transition: "background 0.12s",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Legal move dot */}
                {legal && !piece && (
                  <div style={{
                    width: "26%", height: "26%", borderRadius: "50%",
                    background: "rgba(0,0,0,0.2)",
                  }} />
                )}
                {/* Piece */}
                {piece && (
                  <span style={{
                    fontSize: Math.max(16, sqSize * 0.7) + "px",
                    lineHeight: 1,
                    filter: isWhite(piece)
                      ? "drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                      : "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
                    cursor: isOwn(piece, "w") && turn === "w" && !thinking && !gameOver ? "grab" : "default",
                    opacity: thinking && isBlack(piece) ? 0.85 : 1,
                  }}>
                    {PIECES[piece]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Game */}
      <button
        type="button"
        onClick={resetGame}
        style={{
          padding: "7px 22px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.65)",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.03em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.color = "rgba(255,255,255,0.95)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "rgba(255,255,255,0.65)";
        }}
      >
        New Game
      </button>
    </div>
  );
}
