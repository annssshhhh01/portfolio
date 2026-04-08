import { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { TrafficLights } from "../shared/TrafficLights";

gsap.registerPlugin(Draggable);

export function Window({
  id,
  title,
  children,
  isMinimized,
  isMaximized,
  zIndex,
  position,
  size,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}) {
  const windowRef = useRef(null);
  const dragTriggerRef = useRef(null);
  const resizeRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(() => {
    if (!windowRef.current || isMinimized) return;
    gsap.fromTo(
      windowRef.current,
      { scale: 0.92, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.42,
        ease: "power2.out",
        overwrite: "auto",
      }
    );
  }, [id]);

  useGSAP(() => {
    if (isMobile || isMaximized || !windowRef.current || !dragTriggerRef.current) return;
    const bounds = document.querySelector(".desktop");
    if (!bounds) return;
    const el = windowRef.current;
    const trigger = dragTriggerRef.current;
    const pos = position || { top: 80, left: 100 };
    gsap.set(el, { left: pos.left, top: pos.top, x: 0, y: 0 });
    Draggable.create(el, {
      type: "x,y",
      trigger,
      x: pos.left,
      y: pos.top,
      bounds: bounds,
      edgeResistance: 0.65,
      onDragEnd: function () {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dRect = bounds.getBoundingClientRect();
        const top = rect.top - dRect.top;
        const left = rect.left - dRect.left;
        onPositionChange(id, { top, left });
        gsap.set(el, { left, top, x: 0, y: 0 });
      },
    });
    return () => Draggable.get(el)?.kill();
  }, [id, isMaximized, isMobile, position?.top, position?.left, onPositionChange]);

  useEffect(() => {
    const resizeEl = resizeRef.current;
    if (!resizeEl) return;
    let startX, startY, startW, startH;

    const onPointerDown = (e) => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      startW = windowRef.current?.offsetWidth ?? size?.width ?? 700;
      startH = windowRef.current?.offsetHeight ?? size?.height ?? 520;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
      const dw = e.clientX - startX;
      const dh = e.clientY - startY;
      const newW = Math.max(360, startW + dw);
      const newH = Math.max(320, startH + dh);
      onSizeChange(id, { width: newW, height: newH });
    };

    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    resizeEl.addEventListener("pointerdown", onPointerDown);
    return () => resizeEl.removeEventListener("pointerdown", onPointerDown);
  }, [id, onSizeChange]);

  const handleClose = useCallback(() => {
    const el = windowRef.current;
    if (!el) {
      onClose(id);
      return;
    }
    gsap.to(el, {
      scale: 0.3,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onClose(id),
    });
  }, [id, onClose]);

  const handleMinimize = useCallback(() => {
    const el = windowRef.current;
    if (!el) {
      onMinimize(id);
      return;
    }
    gsap.to(el, {
      scale: 0.3,
      opacity: 0,
      y: "+=50",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onMinimize(id),
    });
  }, [id, onMinimize]);

  const handleMaximize = useCallback(() => onMaximize(id), [id, onMaximize]);

  const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

  if (isMinimized) return null;

  const pos = position || { top: 80, left: 100 };
  const fullScreen = isMobile || isMaximized;
  const style = {
    zIndex,
    ...(fullScreen
      ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        boxSizing: "border-box",
      }
      : {
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: size?.width ?? 700,
        height: size?.height ?? 520,
      }),
  };

  return (
    <div
      ref={windowRef}
      style={style}
      className="rounded-xl shadow-2xl shadow-black/60 overflow-hidden border border-white/[0.08] bg-black/50 backdrop-blur-2xl min-w-[300px] sm:min-w-[420px] min-h-[320px] flex flex-col transition-[top,left,width,height] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
      onClick={handleFocus}
      role="dialog"
      aria-label={title}
    >
      <div
        ref={dragTriggerRef}
        className="flex items-center justify-between px-3 py-2.5 min-h-[36px] bg-white/[0.05] border-b border-white/[0.07] cursor-grab active:cursor-grabbing select-none"
      >
        {/* On desktop show traffic lights, on mobile show a back button */}
        {!isMobile && (
          <TrafficLights
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
          />
        )}
        {isMobile && (
          <button
            onClick={handleClose}
            className="flex items-center justify-center pl-1 pr-2 py-1 rounded-md text-blue-400 active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-[17px] font-medium leading-none">Back</span>
          </button>
        )}

        <h2 className={`absolute left-1/2 -translate-x-1/2 font-medium text-white/80 pointer-events-none max-w-[45%] truncate ${isMobile ? 'text-base font-semibold' : 'text-sm'}`}>
          {title}
        </h2>
        
        {/* Spacer to balance the header when maxed */}
        <div className="w-16" />
      </div>

      <div
        className="flex-1 overflow-auto bg-transparent"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      {!isMaximized && !isMobile && (
        <div
          ref={resizeRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent"
          aria-label="Resize"
        />
      )}
    </div>
  );
}
