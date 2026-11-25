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
        className={`${iconSize} relative shrink-0 rounded-xl overflow-hidden shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105`}
        title="Handover"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="handover-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="handover-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Squircle Background */}
          <rect width="40" height="40" rx="10" fill="url(#handover-bg)" />

          {/* Left Upright Pillar */}
          <rect x="9.5" y="10" width="4.5" height="20" rx="2.25" fill="white" />

          {/* Right Upright Pillar */}
          <rect x="26" y="10" width="4.5" height="20" rx="2.25" fill="white" />

          {/* Transfer Bridge (Handover bar) */}
          <path d="M12 20H28" stroke="white" strokeWidth="4.2" strokeLinecap="round" />

          {/* Handover Directional Chevron */}
          <path
            d="M17.5 16L21.5 20L17.5 24"
            stroke="url(#handover-flow)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Verified Transfer Node Dot */}
          <circle cx="28.25" cy="11.5" r="2.25" fill="#10B981" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Brand Text (Optional) */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="tracking-tight text-lg font-extrabold bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-800 bg-clip-text text-transparent leading-none">
            Handover
          </span>
          <span className="text-[10px] font-mono font-bold text-indigo-600 tracking-wider">
            ACADEMIC OS
          </span>
        </div>
      )}
    </div>
  );
}
