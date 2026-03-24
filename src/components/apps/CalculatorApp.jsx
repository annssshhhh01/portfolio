import { useState, useCallback, useEffect, useMemo } from "react";

// macOS native button styles
const BTN_BASE = "flex items-center justify-center text-[26px] font-normal transition active:brightness-125 select-none rounded-full w-16 h-16 ";
const NUM = BTN_BASE + "bg-[#333333] text-white";
const OP = BTN_BASE + "bg-[#FF9F0A] text-white pb-1"; // pb-1 visually aligns the math symbols
const FN = BTN_BASE + "bg-[#A5A5A5] text-black";

function formatResult(n) {
  if (!Number.isFinite(n)) return "Error";
  const str = String(n);
  if (str.length > 9) return n.toExponential(4);
  if (str.includes(".") && str.split(".")[1]?.length > 6) return n.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  return str;
}

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);

  const clear = useCallback(() => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
  }, []);

  const handleNum = useCallback((n) => {
    setDisplay((d) => (d === "0" ? String(n) : d + n).slice(0, 9));
  }, []);

  const handleOp = useCallback((nextOp) => {
    const val = parseFloat(display) || 0;
    if (prev === null) {
      if (nextOp === "=") return;
      setPrev(val);
      setOp(nextOp);
      setDisplay("0");
    } else {
      let result = prev;
      if (op === "+") result = prev + val;
      else if (op === "−") result = prev - val;
      else if (op === "×") result = prev * val;
      else if (op === "÷") result = val === 0 ? 0 : prev / val;
      const formatted = formatResult(result);
      setPrev(nextOp === "=" ? null : parseFloat(formatted));
      setOp(nextOp === "=" ? null : nextOp);
      setDisplay(formatted);
      if (nextOp !== "=") setDisplay("0");
    }
  }, [display, prev, op]);

  const negate = useCallback(() => {
    setDisplay((d) => (d === "0" ? d : d.startsWith("-") ? d.slice(1) : "-" + d));
  }, []);

  const percent = useCallback(() => {
    setDisplay((d) => formatResult((parseFloat(d) || 0) / 100));
  }, []);

  const backspace = useCallback(() => {
    setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
  }, []);

  const decimal = useCallback(() => {
    setDisplay((d) => (d.includes(".") ? d : d + "."));
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key >= "0" && e.key <= "9") handleNum(Number(e.key));
      else if (e.key === ".") decimal();
      else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); handleOp("="); }
      else if (e.key === "Escape") clear();
      else if (e.key === "Backspace") { e.preventDefault(); backspace(); }
      else if (e.key === "+") handleOp("+");
      else if (e.key === "-") handleOp("−");
      else if (e.key === "*") handleOp("×");
      else if (e.key === "/") { e.preventDefault(); handleOp("÷"); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNum, decimal, handleOp, clear, backspace]);

  const basicGrid = useMemo(() => (
    <div className="grid grid-cols-4 gap-3 w-max mx-auto pb-8">
      <button type="button" className={FN + " text-[22px]"} onClick={clear}>{display === "0" && prev === null ? "AC" : "C"}</button>
      <button type="button" className={FN} onClick={negate}>±</button>
      <button type="button" className={FN} onClick={percent}>%</button>
      <button type="button" className={OP} onClick={() => handleOp("÷")}>÷</button>
      
      {[7, 8, 9].map((n) => (
        <button key={n} type="button" className={NUM} onClick={() => handleNum(n)}>{n}</button>
      ))}
      <button type="button" className={OP} onClick={() => handleOp("×")}>×</button>
      
      {[4, 5, 6].map((n) => (
        <button key={n} type="button" className={NUM} onClick={() => handleNum(n)}>{n}</button>
      ))}
      <button type="button" className={OP} onClick={() => handleOp("−")}>−</button>
      
      {[1, 2, 3].map((n) => (
        <button key={n} type="button" className={NUM} onClick={() => handleNum(n)}>{n}</button>
      ))}
      <button type="button" className={OP} onClick={() => handleOp("+")}>+</button>
      
      {/* Zero button spans 2 columns with pill shape */}
      <button 
        type="button" 
        className="col-span-2 w-[140px] h-16 rounded-full flex items-center justify-start pl-[28px] text-[26px] font-normal transition active:brightness-125 select-none bg-[#333333] text-white" 
        onClick={() => handleNum(0)}
      >
        0
      </button>
      <button type="button" className={NUM} onClick={decimal}>.</button>
      <button type="button" className={OP} onClick={() => handleOp("=")}>=</button>
    </div>
  ), [display, prev, handleNum, handleOp, clear, negate, percent, decimal]);

  return (
    <div
      className="h-full flex flex-col items-center justify-end px-4 bg-transparent overflow-hidden"
      role="application"
      aria-label="Calculator"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
      }}
    >
      <div
        className="w-[280px] mb-2 flex flex-col justify-end px-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <span 
          style={{ 
            fontSize: display.length > 7 ? '42px' : '56px', 
            lineHeight: 1.1,
            transition: 'font-size 0.2s',
            textAlign: 'right'
          }} 
          className="font-light text-white tracking-tight truncate w-full"
        >
          {display}
        </span>
      </div>

      {basicGrid}
    </div>
  );
}
