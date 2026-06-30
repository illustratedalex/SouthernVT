"use client";

interface MockMapPinProps {
  label: string;
  x: number;
  y: number;
  active: boolean;
  onClick: () => void;
}

export function MockMapPin({ label, x, y, active, onClick }: MockMapPinProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] shadow-md transition ${
        active
          ? "z-20 scale-110 border-[#f8f2e4] bg-[#1f3b2f] text-[#f8f2e4]"
          : "z-10 border-[#1f3b2f] bg-[#f8f2e4] text-[#1f3b2f] hover:bg-white"
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      •
    </button>
  );
}
