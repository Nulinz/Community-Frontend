import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileJobRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const jobId = params.get("job_id");
    const web = params.get("web");

    const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    if (isIOS) {
      window.location.replace("https://apps.apple.com/us/app/gradenvy/id6820358213");
    } else {
      // Play Store deep link with job_id for Android
      const playStoreUrl =
        `https://play.google.com/store/apps/details?id=com.grad.envy&referrer=${encodeURIComponent(
          `job_id=${jobId}${web ? `&web=${web}` : ""}`
        )}`;

      window.location.replace(playStoreUrl);
    }
  }, [location]);

  return <div>Redirecting to app...</div>;
};

export default MobileJobRedirect;