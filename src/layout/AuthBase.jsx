import React from 'react';
import loginBg from '../assets/images/loginBg.png';

/**
 * AuthBase - Shared layout wrapper for all authentication screens.
 *
 * Props:
 *   backgroundImage  {string}  - Full-bleed background image URL or imported asset.
 *   maxWidth         {string}  - Tailwind max-w class for the card (default "max-w-md")
 *   cardClassName    {string}  - Optional supplementary styling for height, flexbox, or padding overrides.
 *   children         {node}    - Form content rendered inside the glass card.
 */
export default function AuthBase({
  backgroundImage = loginBg,
  maxWidth = "max-w-md",
  cardClassName = "",
  children,
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative !bg-cover !bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Glass card */}
      <div
        className={`relative z-10 isolate w-full ${maxWidth} bg-[#222222]/50 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10 ${cardClassName}`}
      >
        {children}
      </div>
    </div>
  );
}