import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileEventRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const eventId = params.get("event_id");
    const web = params.get("web");

    const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    if (isIOS) {
      window.location.replace("https://apps.apple.com/us/app/gradenvy/id6820358213");
    } else {
      // Play Store deep link with event_id for Android
      const playStoreUrl =
        `https://play.google.com/store/apps/details?id=com.grad.envy&referrer=${encodeURIComponent(
          `event_id=${eventId}${web ? `&web=${web}` : ""}`
        )}`;

      window.location.replace(playStoreUrl);
    }
  }, [location]);

  return <div>Redirecting to app...</div>;
};

export default MobileEventRedirect;