import React from "react";
import { assets } from "../assets/assets";

/**
 * Reusable GIF loader component.
 * Displays inside the layout content area (<Outlet />) or as a full-screen screen.
 */
const PageLoader = ({ fullScreen = false, text = "" }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#03040A]/80 backdrop-blur-xs">
        <div className="flex flex-col items-center gap-3 select-none">
          <img
            src={assets.loader}
            alt="Loading..."
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          {text && (
            <p className="font-outfit text-xs sm:text-sm font-medium text-gray-300 tracking-wider animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-[55vh] flex flex-col items-center justify-center py-12 select-none">
      <img
        src={assets.loader}
        alt="Loading..."
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
      />
      {text && (
        <p className="font-outfit text-xs sm:text-sm font-medium text-gray-500 mt-2 tracking-wider animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default PageLoader;
