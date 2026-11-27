import React from "react";

interface HandoverLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function HandoverLogo({ size = "md", showText = false, className = "" }: HandoverLogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  const iconSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark */}
      <div
        className={`${iconSize} relative shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-900`}
        title="Handover"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Dark Background */}
          <rect width="40" height="40" rx="8" fill="#0f172a" />

          {/* Left Upright Pillar */}
          <rect x="9.5" y="10" width="4.5" height="20" rx="2.25" fill="#f8fafc" />

          {/* Right Upright Pillar */}
          <rect x="26" y="10" width="4.5" height="20" rx="2.25" fill="#f8fafc" />

          {/* Transfer Bridge (Handover bar) */}
          <path d="M12 20H28" stroke="#f8fafc" strokeWidth="4.2" strokeLinecap="round" />

          {/* Handover Directional Chevron */}
          <path
            d="M17.5 16L21.5 20L17.5 24"
            stroke="#10b981"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Verified Transfer Node Dot */}
          <circle cx="28.25" cy="11.5" r="2.25" fill="#10b981" stroke="#0f172a" strokeWidth="1" />
        </svg>
      </div>

      {/* Brand Text (Optional) */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="tracking-tight text-lg font-bold text-slate-900 leading-none">
            Handover
          </span>
          <span className="text-[10px] font-mono font-medium text-slate-500 tracking-wider">
            ACADEMIC OS
          </span>
        </div>
      )}
    </div>
  );
}
