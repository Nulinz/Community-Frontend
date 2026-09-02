import React from "react";
import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";

/**
 * AdminLayout Component
 * 
 * Responsibility:
 * - Serves as the primary layout wrapper for all Admin portal routes (/admin/*).
 * - Defines the comprehensive admin navigation hierarchy (including expandable sub-menus like Jobs).
 * - Connects the layout with global auth context (user profile, logout handler, password management).
 *
 * Responsiveness:
 * - Delegates layout rendering to <AppLayout />, ensuring seamless responsive behavior across
 *   mobile, tablet, and desktop viewport sizes (collapsible drawer on mobile, sticky sidebar on desktop).
 */
const AdminLayout = () => {
  const { user, logout, changePassword } = useMain();

  // Navigation schema for the Admin panel
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: assets.dash_i },
    { name: "Company", path: "/admin/company", icon: assets.comp_i },
    { name: "College", path: "/admin/college", icon: assets.book_i },
    { name: "Competition / Hackathon", path: "/admin/competition", icon: assets.competition_i },
    { name: "Conference", path: "/admin/conference", icon: assets.conf_i },
    { name: "Events", path: "/admin/events", icon: assets.event_i },
    { name: "Seminar / Workshop", path: "/admin/seminar", icon: assets.sem_i },
    { name: "Influencers", path: "/admin/influencer", icon: assets.user },
    {
      name: "Jobs",
      icon: assets.jobs_i,
      subItems: [
        { name: "Jobs / Hiring", path: "/admin/jobs/job" },
        { name: "Internship", path: "/admin/jobs/internship" },
        { name: "Envy (Freelancing)", path: "/admin/jobs/freelance" },
      ],
    },
    { name: "Users", path: "/admin/users", icon: assets.user },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: assets.subscription },
  ];

  return (
    <AppLayout
      menuItems={menuItems}
      logo={assets.gradEnvyLogo}
      user={user}
      onLogout={logout}
      onChangePassword={changePassword}
    />
  );
};

export default AdminLayout;


