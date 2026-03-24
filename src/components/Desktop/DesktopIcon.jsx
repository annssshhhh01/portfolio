export function DesktopIcon({ icon, iconImage, label, onDoubleClick, onOpen }) {
  const handleClick = () => {
    if (onOpen) onOpen();
    else if (onDoubleClick) onDoubleClick();
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className="desktop-icon flex flex-col items-center justify-start w-[80px] gap-2 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-default select-none group focus:outline-none"
    >
      <div className="w-[58px] h-[58px] flex items-center justify-center rounded-[20px] bg-[#1a1b26]/60 backdrop-blur-xl border border-white/10 group-hover:bg-[#1a1b26]/80 group-hover:border-white/20 shadow-lg transition-all overflow-hidden flex-shrink-0 relative">
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {iconImage ? (
          <img src={iconImage} alt="" className="w-8 h-8 object-contain drop-shadow-md relative z-10" />
        ) : icon ? (
          <div className="text-white drop-shadow-md relative z-10 scale=110">{icon}</div>
        ) : null}
      </div>
      <span className="text-[13px] text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-medium leading-tight px-1">
        {label}
      </span>
    </button>
  );
}
