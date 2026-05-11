import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileEventRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const eventId = params.get("event_id");
    const web = params.get("web");

    // Play Store deep link with event_id
    const playStoreUrl =
      `https://play.google.com/store/apps/details?id=com.dacdiag.app&referrer=${encodeURIComponent(
        `event_id=${eventId}${web ? `&web=${web}` : ""}`
      )}`;

    window.location.replace(playStoreUrl);
  }, [location]);

  return <div>Redirecting to app...</div>;
};

export default MobileEventRedirect;