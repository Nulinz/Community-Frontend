import React from 'react';

/**
 * AuthBase - Shared layout wrapper for all authentication screens.
 *
 * Props:
 *   backgroundImage  {string}  - Unsplash (or any) URL for the full-bleed background.
 *   maxWidth         {string}  - Tailwind max-w class for the card  (default "max-w-md")
 *   children         {node}   - Form content rendered inside the glass card.
 */
export default function AuthBase({
  // backgroundImage = "/login_bg.png",
  maxWidth = "max-w-md",
  children,
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative !bg-cover !bg-center bg-no-repeat"
      // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Glass card */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#222222]/50 backdrop-blur-md p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10`}
      >
        {children}
      </div>
    </div>
  );
}