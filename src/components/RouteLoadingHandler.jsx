import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "../common/PageLoader";

/**
 * Route transition listener that displays the GIF loader on every route navigation.
 * Keeps transitions smooth and provides consistent visual feedback between page changes.
 */
const RouteLoadingHandler = () => {
  const location = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    // Trigger loader on route navigation
    setIsRouteLoading(true);
    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 450); // Duration for smooth visual page transition

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  if (!isRouteLoading) return null;
  return <PageLoader fullScreen={true} />;
};

export default RouteLoadingHandler;
