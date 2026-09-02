import React, { useEffect, useRef, useState, useCallback } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, KeyRound, LogOut, X, Menu, ChevronDown, EyeOff, Eye } from "lucide-react";
import { changePassword } from "../services/auth/authServices";
import { toast } from "react-toastify";
import { useTitle } from "../context/AdminTitle";
import PageLoader from "../common/PageLoader";

/**
 * ProfileMenu Component
 * Handles the user avatar dropdown menu (view profile details, change password, logout)
 * and corresponding modals. Fully responsive with safe viewport-bounded dropdown positioning.
 */
const ProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetPasswordForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFormError("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleLogoutConfirm = async () => {
    await onLogout?.();
    setIsLogoutModalOpen(false);
  };

  const handleChangePasswordSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New password and confirm password do not match");
      return;
    }
    try {
      setFormError("");
      setLoading(true);
      const res = await changePassword({ currentPassword: oldPassword, newPassword, confirmPassword });
      if (res?.status) {
        toast.success(res.message || "Password changed successfully");
        setIsChangePasswordModalOpen(false);
        resetPasswordForm();
      } else {
        toast.error(res?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    { label: "Old Password", value: oldPassword, setter: setOldPassword, show: showOld, toggle: () => setShowOld((p) => !p) },
    { label: "New Password", value: newPassword, setter: setNewPassword, show: showNew, toggle: () => setShowNew((p) => !p) },
    { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm((p) => !p) },
  ];

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="flex items-center gap-2.5 rounded-xl p-1 sm:px-2.5 sm:py-1.5 transition hover:bg-gray-100/80 active:bg-gray-200/60"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-100 flex items-center justify-center border border-gray-200 flex-shrink-0 shadow-xs">
            <span className="text-sm sm:text-base font-semibold text-orange-600">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight max-w-[120px] md:max-w-[160px] truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] md:text-[12px] text-blue-600 font-medium capitalize">
              {user?.role || "User"}
            </p>
          </div>
        </button>

        {/* Dropdown positioned cleanly inside right screen edge on all devices */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-[220px] sm:w-[240px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-blue-600 capitalize">{user?.role || "User"}</p>
            </div>
            <button
              type="button"
              onClick={() => { setIsOpen(false); resetPasswordForm(); setIsChangePasswordModalOpen(true); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-3 text-[14px] sm:text-[15px] text-gray-800">
                <KeyRound size={16} />
                Change Password
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-[#E5E7EB] hover:bg-gray-50 text-[14px] sm:text-[15px] text-red-600 font-medium rounded-b-2xl transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ── Logout Modal ── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-[460px] rounded-2xl bg-white shadow-2xl p-5 sm:p-7">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-center px-2 pb-2">
              <h3 className="text-lg sm:text-[20px] font-bold text-gray-900">Ready to head out?</h3>
              <p className="mt-2 text-sm sm:text-[15px] text-gray-500">You&apos;re about to log out. See you next time!</p>
              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm sm:text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 rounded-xl bg-[#171717] px-4 py-2.5 text-sm sm:text-[15px] font-semibold text-white hover:bg-black transition"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-5 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-[20px] font-bold text-gray-900">Change Password</h3>
              <button
                type="button"
                onClick={() => { setIsChangePasswordModalOpen(false); resetPasswordForm(); }}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {passwordFields.map(({ label, value, setter, show, toggle }) => (
                <div key={label}>
                  <label className="mb-1.5 block text-xs sm:text-sm font-semibold text-gray-800">{label}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base outline-none focus:border-[#171717] transition"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              ))}

              {formError && <p className="text-xs sm:text-sm text-red-500 font-medium">{formError}</p>}
              <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => { setIsChangePasswordModalOpen(false); resetPasswordForm(); }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePasswordSave}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#171717] px-4 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-black disabled:opacity-60 transition"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * AppLayout Component
 * Standard layout scaffold powering Admin, College, Company, and Influencer sections.
 *
 * Responsiveness Architecture:
 * - Desktop (>= 768px): Fixed sticky left sidebar, clear header with route title & user profile.
 * - Mobile / Tablet (< 768px): Slide-in drawer navigation with backdrop, touch-friendly hamburger button,
 *   brand logo, auto-truncating route title, and profile menu without horizontal layout breakages.
 */
const AppLayout = ({
  menuItems = [],
  logo,
  user,
  onLogout,
  onChangePassword,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const { title } = useTitle();
  
  // Auto-derive fallback title from last route segment if context title is not set
  const pageTitle = title || location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const mainRef = useRef(null);
  const [isOutletLoading, setIsOutletLoading] = useState(false);

  // Close sidebar, trigger content outlet loader, and reset scroll on navigation change
  useEffect(() => {
    setSidebarOpen(false);
    setIsOutletLoading(true);
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const timer = setTimeout(() => {
      setIsOutletLoading(false);
    }, 260);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  // Prevent background body scrolling when mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Handle ESC key press to close sidebar drawer
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Track expanded state for nested sub-menu items
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const initial = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        initial[item.name] = item.subItems.some((s) =>
          location.pathname.startsWith(s.path)
        );
      }
    });
    return initial;
  });

  const toggleMenu = (name) =>
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));

  const renderIcon = (icon, name) => {
    if (!icon) return null;
    return typeof icon === "string"
      ? <img src={icon} alt={name} className="w-5 h-5 object-contain flex-shrink-0" />
      : React.createElement(icon, { size: 20, className: "flex-shrink-0" });
  };

  const NavItems = ({ onLinkClick }) => (
    <nav className="space-y-1 px-3">
      {menuItems.map((item) => {
        const hasSubItems = !!item.subItems;
        const isExpanded = expandedMenus[item.name];
        const isCategoryActive =
          hasSubItems &&
          item.subItems.some((s) => location.pathname.startsWith(s.path));

        return (
          <div key={item.name}>
            {hasSubItems ? (
              /* ── Parent toggle button ── */
              <>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-[15px] font-medium transition-all duration-200 relative
                    ${isCategoryActive ? "bg-blue-50 text-[#171717]" : "text-gray-700 hover:bg-gray-50 hover:text-[#171717]"}`}
                >
                  <div className="flex items-center gap-3">
                    {renderIcon(item.icon, item.name)}
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                    {isCategoryActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-8 bg-[#171717] rounded-l-full" />
                    )}
                  </div>
                </button>

                {/* ── Sub-items with connector ── */}
                {isExpanded && (
                  <div className="ml-7 sm:ml-9 mt-1 space-y-1 border-l border-gray-200 relative">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-[14px] font-medium transition-colors relative
                          ${isActive ? "text-[#171717] font-semibold" : "text-gray-600 hover:text-[#171717]"}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className={`absolute -left-[1px] top-0 bottom-0 w-[1px] ${isActive ? "bg-[#171717]" : "bg-transparent"}`}>
                              <div className="absolute rounded top-1/2 left-0 w-2.5 sm:w-3 h-[1px] bg-gray-200" />
                            </div>
                            <span>{sub.name}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ── Standard NavLink ── */
              <NavLink
                to={item.path}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-[15px] font-medium transition-all duration-200
                  ${isActive ? "bg-blue-50 text-[#171717] font-semibold" : "text-gray-700 hover:bg-gray-50 hover:text-[#171717]"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {renderIcon(item.icon, item.name)}
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">

      {/* ════════════ DESKTOP SIDEBAR ════════════ */}
      <aside className="hidden md:flex w-[260px] h-screen sticky top-0 bg-white border-r border-[#E5E7EB] flex-col py-6 flex-shrink-0">
        <div className="px-6 mb-8 flex justify-center flex-shrink-0">
          {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />}
        </div>
        <div className="flex-1 overflow-y-auto pb-8">
          <NavItems />
        </div>
      </aside>

      {/* ════════════ MOBILE DRAWER OVERLAY ════════════ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ════════════ MOBILE DRAWER ════════════ */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[270px] max-w-[85vw] bg-white border-r border-[#E5E7EB] flex flex-col py-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Sidebar"
      >
        {/* Drawer header */}
        <div className="px-5 mb-6 flex items-center justify-between flex-shrink-0">
          {logo && <img src={logo} alt="Logo" className="h-9 w-auto object-contain" />}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable menu items */}
        <div className="flex-1 overflow-y-auto pb-10">
          <NavItems onLinkClick={() => setSidebarOpen(false)} />
        </div>
      </aside>

      {/* ════════════ MAIN CONTENT AREA ════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 bg-white border-b border-[#E5E7EB] flex-shrink-0 relative z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger button — mobile/tablet only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition flex-shrink-0"
            >
              <Menu size={22} />
            </button>

            {/* Mobile Logo */}
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="h-7 sm:h-8 w-auto object-contain md:hidden flex-shrink-0"
              />
            )}

            {/* Title with truncation protection to prevent header overflow */}
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 capitalize truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[320px] md:max-w-none">
              {pageTitle}
            </h1>
          </div>

          {/* Profile Menu (Avatar + Dropdown) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ProfileMenu
              user={user}
              onLogout={onLogout}
              onChangePassword={onChangePassword}
            />
          </div>
        </header>

        {/* ── Page Content ── */}
        <main ref={mainRef} className="scroll-reset-target flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 bg-[#F9FAFB] flex flex-col">
          {isOutletLoading ? (
            <PageLoader fullScreen={false} />
          ) : (
            <Outlet />
          )}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;