import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { assets } from "../../assets/assets";
import AddCompanyPostModal from "../../components/AddCompanyPostModal";

const Sidebar = () => {
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

  return (
    <>
      <aside className="w-[260px] h-screen sticky top-0 bg-white border-r-2 border-[#E5E7EB] flex flex-col py-6 overflow-y-auto">
        <div className="px-6 mb-6 flex justify-center">
          <img
            src={assets.gradEnvyLogo}
            alt="Nulinz Community"
            className="h-11 w-auto object-contain"
          />
        </div>

        

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 ${isActive
                  ? "bg-blue-50 text-primary"
                  : "text-primary hover:bg-gray-50 hover:text-primary"
                }`
              }
            >
              <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 mb-4">
          <button
            type="button"
            onClick={() => setIsAddPostModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-[#171717] text-[15px] font-bold shadow-md hover:bg-[#262626] transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Post</span>
          </button>
        </div>
      </aside>

      <AddCompanyPostModal
        isOpen={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
