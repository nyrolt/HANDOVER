import React, { useState } from "react";

interface HandoverLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function HandoverLogo({ size = "md", showText = false, className = "" }: HandoverLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  const roundedMap = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  };

  const iconSize = sizeMap[size];
  const roundedClass = roundedMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark */}
      <div
        className={`${iconSize} relative shrink-0 ${roundedClass} overflow-hidden shadow-md shadow-black/25 bg-black transition-transform group-hover:scale-105`}
        title="Handover"
      >
        {!imgError ? (
          <img
            src="/handover-logo.jpg"
            alt="Handover"
            className="w-full h-full object-cover select-none"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient
                id="sq-bg"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#121214" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
              <radialGradient id="blue-sphere" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="40%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </radialGradient>
              <linearGradient id="cross-shading" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="30%" stopColor="#FFFFFF" />
                <stop offset="85%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="24" fill="url(#sq-bg)" />
            <rect x="36" y="44" width="28" height="12" rx="4" fill="url(#cross-shading)" />
            <rect x="25" y="24" width="16" height="52" rx="8" fill="#FFFFFF" />
            <rect x="59" y="38" width="16" height="38" rx="8" fill="#FFFFFF" />
            <circle cx="67" cy="27" r="7.5" fill="url(#blue-sphere)" />
          </svg>
        )}
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
