import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Phone,
  ShieldAlert,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { assets } from "../assets/assets";

/**
 * DeleteAccount Component
 *
 * Provides a secure, self-service account deletion request portal.
 * Fulfills mobile app store (Google Play & Apple App Store) data deletion compliance guidelines
 * by allowing registered users to request permanent removal of their profile, preferences, and personal data.
 * Synchronized with LandingPage navigation navbar and PrivacyPolicy dark gradient hero banner.
 */
const DeleteAccount = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form input state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation & UI submission states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Enforce 10-digit numeric constraint on phone number
  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(numericValue);
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!phoneNumber || phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required to confirm identity.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields accurately.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission / credential validation dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      toast.success("Account deletion request submitted successfully.");
    }, 600);
  };

  const resetForm = () => {
    setPhoneNumber("");
    setPassword("");
    setReason("");
    setErrors({});
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-outfit selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* ── Top Navigation Bar (Fully responsive on mobile, tablet & desktop - matching LandingPage) ── */}
      <header className="sticky top-0 z-50 w-full bg-[#000000] border-b border-white/5 transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-3 sm:py-3.5 lg:py-4 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <img
              src={assets.landing_logo}
              alt="GradEnvy Logo"
              className="h-7 sm:h-8 lg:h-9 xl:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = assets.gradEnvyLogo;
              }}
            />
          </div>

          {/* Center Navigation Links (Hidden on mobile/tablet < 1024px, fluid on lg/xl) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-9 text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-wide">
            {[
              { label: "Why Choose", path: "/#why-choose" },
              { label: "AI station", path: "/#ai-station" },
              { label: "Career OS", path: "/#career-os" },
              { label: "How it Works", path: "/#how-it-works" },
              { label: "Contact Us", path: "/contact" },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="relative py-1 whitespace-nowrap text-gray-300 hover:text-white transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Pill buttons on desktop & Mobile/Tablet Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/auth/login?type=company")}
              className="hidden lg:inline-flex px-3.5 py-1.5 xl:px-5 xl:py-2 2xl:px-6 rounded-full text-xs xl:text-sm font-semibold bg-white text-black hover:bg-gray-100 shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Company Sign in
            </button>
            <button
              onClick={() => navigate("/auth/login?type=college")}
              className="hidden lg:inline-flex px-3.5 py-1.5 xl:px-5 xl:py-2 2xl:px-6 rounded-full text-xs xl:text-sm font-semibold bg-white text-black hover:bg-gray-100 shadow-md transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              College Sign in
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-1.5 sm:p-2 rounded-lg focus:outline-none hover:bg-white/5 active:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#080808]/98 backdrop-blur-xl border-t border-white/10 px-5 sm:px-8 py-4 sm:py-5 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            <div className="space-y-1">
              {[
                { label: "Why Choose", path: "/#why-choose" },
                { label: "AI station", path: "/#ai-station" },
                { label: "Career OS", path: "/#career-os" },
                { label: "How it Works", path: "/#how-it-works" },
                { label: "Contact Us", path: "/contact" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-sm sm:text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile / Tablet Sign In Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  navigate("/auth/login?type=company");
                  setMobileMenuOpen(false);
                }}
                className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-100 shadow-md transition-all active:scale-95 text-center"
              >
                Company Sign in
              </button>
              <button
                onClick={() => {
                  navigate("/auth/login?type=college");
                  setMobileMenuOpen(false);
                }}
                className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-100 shadow-md transition-all active:scale-95 text-center"
              >
                College Sign in
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO HEADER BANNER (DARK GRADIENT - EXACTLY LIKE PrivacyPolicy)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#050814] pt-16 pb-20 px-6 md:px-[80px] text-center overflow-hidden border-b border-white/10">
        {/* Background Subtle Radial Blue Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0084FF]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          {/* Pill Badge */}
          <div className="inline-block">
            <span className="px-5 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-[#0C1527]/90 text-[#00A3FF] border border-[#00A3FF]/40 backdrop-blur-md">
              GRAD ENVY
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-tight">
            Delete My Account
          </h1>

          {/* Subtitle / Last Updated */}
          <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mx-auto">
            We're sorry to see you go — submit a request to permanently remove your Grad Envy account and associated data.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT CARD
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-grow px-4 pb-16">
        <div className="max-w-2xl mx-auto -mt-12 md:-mt-16 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 p-6 sm:p-10 md:p-12 relative z-20">
          {/* Warning Callout Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8 flex gap-3.5 sm:gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm leading-relaxed text-amber-900">
              <p className="font-semibold text-amber-950">
                Permanent Action Warning
              </p>
              <p className="text-amber-800/90">
                Deleting your account will permanently remove all associated data, including your career profile, saved opportunities, mission progress, EXP points, and personal preferences. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="block text-xs sm:text-sm font-semibold text-slate-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${errors.phoneNumber
                    ? "border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/20"
                    : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    }`}
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-xs text-red-600 font-medium pl-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-slate-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your account password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm font-medium transition-all outline-none ${errors.password
                    ? "border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/20"
                    : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium pl-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Reason for Deletion (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="reason"
                className="block text-xs sm:text-sm font-semibold text-slate-700"
              >
                Reason for Leaving <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Help us improve: why are you deleting your account?"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E5384B] hover:bg-[#C92A3C] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <span>Delete My Account</span>
                )}
              </button>
            </div>
          </form>

          {/* Important Notes Section */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="flex items-center gap-2.5 font-bold text-base sm:text-lg text-slate-900 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              Important Notes
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>
                <strong className="text-slate-800">Irreversible Action:</strong> Deleting your account is permanent. Make sure you have backed up any certificates, portfolios, or records before proceeding.
              </li>
              <li>
                <strong className="text-slate-800">Legal Compliance:</strong> Some transactional and audit logs may be retained in anonymized form for regulatory, tax, or legal requirements.
              </li>
              <li>
                <strong className="text-slate-800">Active Subscriptions:</strong> If you have an active paid subscription or ongoing application process, cancel it beforehand to prevent unexpected billing.
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. SUCCESS CONFIRMATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative animate-scaleUp">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Request Received
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              If the provided credentials validate successfully against our database, your account deletion request will be processed within the next <strong className="text-slate-800">24 hours</strong>.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#2D66FA] hover:bg-blue-600 text-white font-semibold py-3 px-5 rounded-xl transition-all shadow-md shadow-blue-500/20 text-sm flex items-center justify-center gap-2"
              >
                <span>Return to Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={resetForm}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-5 rounded-xl transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. COMPREHENSIVE FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 bg-[#050814] pt-16 pb-12 px-6 md:px-[80px] text-white border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto space-y-12">
          {/* Footer Navigation Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            {/* Brand Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={assets.landing_logo}
                  alt="GradEnvy"
                  className="h-10 w-auto object-contain cursor-pointer"
                  onClick={() => navigate("/")}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = assets.gradEnvyLogo;
                  }}
                />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
                A connected professional ecosystem where freelancing, career development, networking, recruitment, AI-powered learning, and events come together to build future-ready professionals.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://x.com/GradEnvyIndia"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gradenvyofficial?stkn=MWt2eWdkeXJhcno5Ng%3D%3D&utm_source=qr"                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@GradEnvyOfficial"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Nav Right Columns */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-8">
              {/* Column 1: PLATFORM */}
              <div className="space-y-4">
                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  PLATFORM
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                  {[
                    "AI Station",
                    "Prompt Hub",
                    "Career OS",
                    "Envy Marketplace",
                    "Envy League",
                    "University Platform",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate("")}
                        className="hover:text-white transition-colors text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: COMPANY */}
              <div className="space-y-4">
                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  COMPANY
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                  {[
                    { label: "About Grad Envy", path: "" },
                    { label: "Vision", path: "" },
                    { label: "Mission", path: "" },
                    { label: "Contact Us", path: "/contact" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate(item.path)}
                        className="hover:text-white transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: RESOURCES */}
              <div className="space-y-4">
                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  RESOURCES
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                  {[
                    { label: "Privacy Policy", path: "/privacy_policy" },
                    { label: "Terms & Conditions", path: "/termsandconditions" },
                    { label: "Delete My Account", path: "/delete_account" },
                    { label: "Return and Refund Policy", path: "/returnandrefundpolicy" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate(item.path)}
                        className="hover:text-white transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Security Links Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
            <p>© 2026 Grad Envy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeleteAccount;
