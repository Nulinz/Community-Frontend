import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollHandler = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // For pages that use browser window scrolling
        window.scrollTo(0, 0);

        // For layouts that scroll inside custom containers
        const scrollTargets = document.querySelectorAll(".scroll-reset-target");
        scrollTargets.forEach((target) => {
            target.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
    }, [pathname, search]);

    return <Outlet />;
};



export default ScrollHandler
