// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import {
//     LayoutGrid,
//     Building2,
//     CalendarDays,
//     Briefcase,
//     UserRound
// } from 'lucide-react';
// import { assets } from '../../assets/assets';

// const Sidebar = () => {
//     const menuItems = [
//         { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutGrid },
//         { name: 'Company', path: '/admin/company', icon: Building2 },
//         { name: 'Events', path: '/admin/events', icon: CalendarDays },
//         { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
//         { name: 'Users', path: '/admin/users', icon: UserRound },
//     ];

//     return (
//         <aside className="w-[260px] min-h-screen bg-white border-r border-gray-100 flex flex-col py-6">
//             {/* Logo Section */}
//             <div className="px-6 mb-10">
//                 <img
//                     src={assets.logo}
//                     alt="Nulinz Community"
//                     className="h-12 w-auto object-contain"
//                 />
//             </div>

//             {/* Navigation Links */}
//             <nav className="flex-1 space-y-1 px-3">
//                 {menuItems.map((item) => (
//                     <NavLink
//                         key={item.name}
//                         to={item.path}
//                         className={({ isActive }) => `
//         flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
//         ${isActive
//                                 ? 'bg-blue-50 text-[#171717]'
//                                 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
//       `}
//                     >

//                         {({ isActive }) => (
//                             <>
//                                 <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
//                                 <span>{item.name}</span>
//                             </>
//                         )}
//                     </NavLink>
//                 ))}
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;






















import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { assets } from '../../assets/assets';
import { useMain } from '../../context/MainContext';
import { getCategoryBadges } from '../../utils/applicantTracker';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { user } = useMain();
    const [categoryBadges, setCategoryBadges] = useState(getCategoryBadges);

    useEffect(() => {
        const handleSync = () => setCategoryBadges(getCategoryBadges());
        window.addEventListener("nulinz_seen_updated", handleSync);
        return () => window.removeEventListener("nulinz_seen_updated", handleSync);
    }, []);

    const getBadgeForPath = (path) => {
        if (!path) return false;
        if (path.includes("/jobs/job")) return Boolean(categoryBadges.jobs);
        if (path.includes("/jobs/internship")) return Boolean(categoryBadges.internships);
        if (path.includes("/jobs/freelance")) return user?.role === "admin" && Boolean(categoryBadges.freelance);
        if (path.includes("/competition")) return Boolean(categoryBadges.competition);
        if (path.includes("/conference")) return Boolean(categoryBadges.conference);
        if (path.includes("/events")) return Boolean(categoryBadges.events);
        if (path.includes("/seminar")) return Boolean(categoryBadges.seminar);
        return false;
    };

    const hasSubItemBadge = (item) => {
        if (!item.subItems) return false;
        return item.subItems.some((sub) => getBadgeForPath(sub.path));
    };

    // State to track expanded menus (Events/Jobs)
    const [expandedMenus, setExpandedMenus] = useState({
        Events: pathname.includes('/admin/events'),
        Jobs: pathname.includes('/admin/jobs')
    });

    const toggleMenu = (name) => {
        setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: assets.dash_i },
        { name: 'Company', path: '/admin/company', icon: assets.comp_i },
        { name: 'College', path: '/admin/college', icon: assets.book_i },
        { name: 'Competition / Hackathon', path: '/admin/competition', icon: assets.competition_i },
        { name: 'Conference', path: '/admin/conference', icon: assets.conf_i },
        { name: 'Events', path: '/admin/events', icon: assets.event_i },
        { name: 'Seminar / Workshop', path: '/admin/seminar', icon: assets.sem_i },
        {
            name: 'Jobs',
            icon: assets.jobs_i,
            subItems: [
                { name: "Jobs / Hiring", path: "/admin/jobs/job" },
                { name: "Internship", path: "/admin/jobs/internship" },
                { name: "Projects", path: "/admin/jobs/freelance" },
            ]
        },
        { name: 'Users', path: '/admin/users', icon: assets.book_i },
        { name: 'Subscriptions', path: '/admin/subscriptions', icon: assets.comp_i },
    ];

    return (
        <aside className="w-[260px] h-screen sticky top-0 bg-white border-r-2 border-[#E5E7EB] flex flex-col py-6 overflow-y-auto">
            {/* Logo Section */}
            <div className="px-6 mb-10 flex justify-center">
                <img
                    src={assets.gradEnvyLogo}
                    alt="Nulinz Community"
                    className="h-11 w-auto object-contain"
                />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1 px-3">
                {menuItems.map((item) => {
                    const hasSubItems = !!item.subItems;
                    const isExpanded = expandedMenus[item.name];
                    const isCategoryActive = hasSubItems && pathname.includes(item.name.toLowerCase());

                    return (
                        <div key={item.name} className="relative">
                            {hasSubItems ? (
                                /* Parent Item Toggle */
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 relative group
                                    ${isCategoryActive ? 'text-primary' : 'text-primary hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                                        <span>{item.name}</span>
                                        {hasSubItemBadge(item) && (
                                            <span className="relative flex h-2 w-2 flex-shrink-0" title="New updates arrived">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                        {isCategoryActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-8 bg-[#171717] rounded-l-full" />
                                        )}
                                    </div>
                                </button>
                            ) : (
                                /* Standard NavLink for items without sub-menus */
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
                                        ${isActive ? 'bg-blue-50 text-primary' : 'text-primary hover:bg-gray-50 hover:text-primary'}
                                    `}
                                >
                                    {({ isActive }) => {
                                        const showItemDot = getBadgeForPath(item.path);
                                        return (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                                                    <span>{item.name}</span>
                                                </div>
                                                {showItemDot && (
                                                    <span className="relative flex h-2 w-2 flex-shrink-0" title="New updates arrived">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                                    </span>
                                                )}
                                            </>
                                        );
                                    }}
                                </NavLink>
                            )}

                            {/* Sub-menu rendering with curved connector line logic */}
                            {hasSubItems && isExpanded && (
                                <div className="ml-9 mt-1 space-y-1 border-l border-gray-200 relative">
                                    {item.subItems.map((sub) => {
                                        const showSubDot = getBadgeForPath(sub.path);
                                        return (
                                            <NavLink
                                                key={sub.name}
                                                to={sub.path}
                                                className={({ isActive }) => `
                                                    flex items-center justify-between px-6 py-2.5 text-[14px] font-medium transition-colors relative
                                                    ${isActive ? 'text-primary' : 'text-primary hover:text-primary'}
                                                `}
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <div className={`absolute -left-[1px] top-0 bottom-0 w-[1px] ${isActive ? 'bg-[#171717]' : 'bg-transparent'}`}>
                                                            <div className="absolute top-1/2 -left-[12px] w-3 h-[1px] bg-gray-200" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>{sub.name}</span>
                                                            {showSubDot && (
                                                                <span className="relative flex h-2 w-2 flex-shrink-0" title="New applicants arrived">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
