import React, { useState } from "react";
import { Plus } from "lucide-react";
import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";
import AddCompanyPostModal from "../../components/AddCompanyPostModal";

/**
 * CompanyLayout Component
 *
 * Primary layout wrapper for company portal routes (/company/*).
 * Features a dedicated "Add Post" action button directly in the navigation sidebar,
 * allowing companies to upload posters from anywhere across the portal.
 */
const CompanyLayout = () => {
  const { user, logout, changePassword } = useMain();
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/company/dashboard", icon: assets.dash_i },
    { name: 'Jobs / Hiring', path: '/company/jobs/job', icon: assets.jobs_i },
    { name: 'Internship', path: '/company/jobs/internship', icon: assets.internship },
    { name: 'Projects', path: '/company/jobs/freelance', icon: assets.project },
    { name: 'Events', path: '/company/events', icon: assets.event_i },
    { name: 'Competition / Hackathon', path: '/company/competition', icon: assets.competition_i },
    { name: 'Partners', path: '/company/partners', icon: assets.partners },
    { name: 'Profile', path: '/company/company', icon: assets.comp_i },
  ];

  const sidebarAction = (
    <button
      type="button"
      onClick={() => setIsAddPostModalOpen(true)}
      className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white text-[#171717] text-[15px] font-bold border border-dashed border-gray-300 transition-all active:scale-95 cursor-pointer"
    >
      <Plus size={18} />
      <span>Add Post</span>
    </button>
  );

  return (
    <>
      <AppLayout
        menuItems={menuItems}
        logo={assets.gradEnvyLogo}
        user={user}
        onLogout={logout}
        onChangePassword={changePassword}
        sidebarAction={sidebarAction}
      />
      <AddCompanyPostModal
        isOpen={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
      />
    </>
  );
};

export default CompanyLayout;
