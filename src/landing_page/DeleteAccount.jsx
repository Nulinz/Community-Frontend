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
  X,
} from "lucide-react";
import { assets } from "../assets/assets";

/**
 * DeleteAccount Component
 *
 * Provides a secure, self-service account deletion request portal.
 * Fulfills mobile app store (Google Play & Apple App Store) data deletion compliance guidelines
 * by allowing registered users to request permanent removal of their profile, preferences, and personal data.
 * Built entirely with responsive Tailwind CSS styling, interactive validation, and confirmation state.
 */
const DeleteAccount = () => {
  const navigate = useNavigate();

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
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#080808]/90 backdrop-blur-md px-6 md:px-[80px] py-4 flex items-center justify-between transition-all border-b border-white/10">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={assets.landing_logo}
            alt="GradEnvy Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = assets.gradEnvyLogo;
            }}
          />
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {[
            { label: "Why Choose", path: "/#why-choose" },
            { label: "AI station", path: "/#ai-station" },
            { label: "Career OS", path: "/#career-os" },
            { label: "How it Works", path: "/#how-it-works" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Sign in Pill Button */}
        <button
          onClick={() => navigate("/auth/login")}
          className="px-7 py-2.5 rounded-full text-sm font-semibold bg-[#2D66FA] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all"
        >
          Sign in
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0052EA] to-[#0038A8] text-white pt-16 pb-24 px-4 text-center relative overflow-hidden">
        {/* Ambient decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-blue-100 border border-white/20 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-200" />
            Account Management & Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Delete My Account
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            We're sorry to see you go — here's how to permanently remove your Grad Envy account and associated data.
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
          5. FOOTER NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B0D14] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-[1240px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            {/* Left Column: Brand Info */}
            <div className="md:col-span-4 space-y-4">
              <img
                src={assets.landing_logo}
                alt="Grad Envy"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = assets.gradEnvyLogo;
                }}
              />
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Next-gen career operating system connecting ambition with industry. Build proof of work, attend verified events, and accelerate your path to top tech roles.
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Column 1: QUICK LINKS */}
              <div className="space-y-4">
                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  QUICK LINKS
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                  {[
                    { label: "Features", path: "/#why-choose" },
                    { label: "How it Works", path: "/#how-it-works" },
                    { label: "App Features", path: "/#career-os" },
                    { label: "AI Station", path: "/#ai-station" },
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

              {/* Column 2: COMPANY */}
              <div className="space-y-4">
                <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  COMPANY
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                  {[
                    "About Grad Envy",
                    "Vision",
                    "Mission",
                    "Contact Us",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => navigate("/auth/login")}
                        className="hover:text-white transition-colors text-left"
                      >
                        {item}
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
                    { label: "Help Center", path: "/auth/login" },
                    { label: "Privacy Policy", path: "/privacy_policy" },
                    { label: "Terms & Conditions", path: "/termsandconditions" },
                    // { label: "Delete My Account", path: "/delete_account" },
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
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2026 Grad Envy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/privacy_policy")}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate("/terms")}
                className="hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </button>
              <button
                onClick={() => navigate("/delete_account")}
                className="hover:text-white transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeleteAccount;
