import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileJobRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const jobId = params.get("job_id");
    const web = params.get("web");

    // Play Store deep link with job_id
    const playStoreUrl =
      `https://play.google.com/store/apps/details?id=com.dacdiag.app&referrer=${encodeURIComponent(
        `job_id=${jobId}${web ? `&web=${web}` : ""}`
      )}`;

    window.location.replace(playStoreUrl);
  }, [location]);

  return <div>Redirecting to app...</div>;
};

export default MobileJobRedirect;