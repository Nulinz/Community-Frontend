import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Phone,
  Mail,
  MessageCircle,
  Copy,
  Check,
  Clock,
  Send,
  HelpCircle,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { assets } from "../assets/assets";

/**
 * ContactUs Component
 *
 * Official Contact & Support page for GradEnvy.
 * Strictly adheres to the visual styling, typography, elevations, and responsive breakpoints
 * established in LandingPage.jsx and PrivacyPolicy.jsx.
 *
 * Architectural & UX Responsibilities:
 * - Displays primary company communication touchpoints for GradEnvy (Mobile & Official Gmail).
 * - Implements quick-action utilities: direct calling, WhatsApp direct routing, and one-click copy-to-clipboard.
 * - Provides categorized departmental contact paths for students, universities, and enterprise recruiters.
 * - Synchronized with LandingPage navigation header and PrivacyPolicy dark gradient hero banner.
 */
const ContactUs = ({ showLayout = true }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Form input state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "Student & Learning Support",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Copy state for interactive buttons
  const [copiedType, setCopiedType] = useState(null);

  /**
   * Copies text to user clipboard with temporary visual acknowledgment
   */
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedType(null), 2500);
    }).catch(() => {
      toast.error("Could not copy to clipboard. Please copy manually.");
    });
  };

  const contactContent = (
    <div className="legal-page-wrapper w-full bg-[#f8fafc]">
      {/* ─────────────────────────────────────────────────────────────
          EXACT STYLES REUSED FROM Terms.jsx & RefundPolicy.jsx
      ───────────────────────────────────────────────────────────── */}
      <style>{`
        .legal-body {
          padding: 0 16px 64px;
        }

        .legal-card {
          max-width: 820px;
          margin: -48px auto 0;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #d7dee7;
          box-shadow: 0 10px 30px rgba(20, 30, 60, .08);
          padding: 40px 44px;
          position: relative;
          z-index: 20;
        }

        .legal-card p,
        .legal-card li {
          color: #4b5565;
          font-size: 15px;
          line-height: 1.75;
        }

        .legal-card p {
          margin-bottom: 16px;
        }

        .legal-card p:last-child {
          margin-bottom: 0;
        }

        .legal-card ul {
          padding-left: 20px;
          margin-bottom: 16px;
          list-style-type: disc;
        }

        .legal-card li {
          margin-bottom: 6px;
        }

        .legal-card h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 18px;
          color: #1e2532;
          margin: 36px 0 14px;
        }

        .legal-card h2:first-of-type {
          margin-top: 8px;
        }

        .legal-card h2 .feature-dot {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: #0052ea;
          display: inline-block;
        }

        .legal-card a {
          color: #0052ea;
          font-weight: 600;
          text-decoration: none;
        }

        .legal-card a:hover {
          text-decoration: underline;
        }

        @media (max-width: 767.98px) {
          .legal-card {
            padding: 30px 20px;
            margin-top: -32px;
          }
        }
      `}</style>

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
            Contact Us
          </h1>

          {/* Subtitle / Description */}
          <p className="text-gray-400 text-sm sm:text-base font-normal max-w-xl mx-auto">
            We're here to help • Grad Envy Support &amp; Inquiries
          </p>
        </div>
      </section>

      {/* Body Card Section */}
      <section className="legal-body">
        <div className="legal-card">
          <p>
            Have a question about Grad Envy, need assistance with your account, or looking to partner
            with us? Reach out directly through phone or email, or submit an inquiry using the direct
            message form below. Our team responds promptly during regular operating hours.
          </p>

          {/* ─────────────────────────────────────────────────────────────
              1. DIRECT COMMUNICATION CHANNELS (MOBILE & GMAIL)
          ───────────────────────────────────────────────────────────── */}
          <h2>
            <span className="feature-dot"></span> Direct Communication Channels
          </h2>
          <p>
            You can reach our team directly using our official phone line or Gmail address. Click to
            call, message on WhatsApp, or send an email directly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {/* Mobile Contact Box */}
            <div className="border border-[#d7dee7] hover:border-[#0052ea]/50 rounded-2xl p-5 bg-[#fbfdff] transition-all flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0052ea]">
                    <Phone className="w-4 h-4" /> Phone Support
                  </span>
                  {/* <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Mon – Sat
                  </span> */}
                </div>
                <div className="pt-1">
                  <div className="text-xl sm:text-2xl font-bold text-[#1e2532] tracking-tight">
                    +91 90804 08749
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Call directly or connect instantly on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="pt-5 flex flex-wrap gap-2">
                <a
                  href="tel:+919080408749"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0052ea] !text-white hover:bg-[#0038a8] transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
                <a
                  href="https://wa.me/919080408749?text=Hello%20GradEnvy%20Team%2C%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#25D366] !text-white hover:bg-[#1EBE5D] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("+919080408749", "Phone Number")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedType === "Phone Number" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Gmail Contact Box */}
            <div className="border border-[#d7dee7] hover:border-[#0052ea]/50 rounded-2xl p-5 bg-[#fbfdff] transition-all flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0052ea]">
                    <Mail className="w-4 h-4" /> Official Email
                  </span>
                  {/* <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052ea] border border-blue-200">
                    24/7 Inbox
                  </span> */}
                </div>
                <div className="pt-1">
                  <div className="text-base sm:text-lg font-bold text-[#1e2532] break-all tracking-tight">
                    nulinz.official@gmail.com
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Typical response within 2–4 business hours.
                  </p>
                </div>
              </div>

              <div className="pt-5 flex flex-wrap gap-2">
                <a
                  href="mailto:nulinz.official@gmail.com?subject=GradEnvy%20Inquiry"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0052ea] !text-white hover:bg-[#0038a8] transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Email
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("nulinz.official@gmail.com", "Email Address")}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Copy Email"
                >
                  {copiedType === "Email Address" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. DEPARTMENTAL CONTACT DIRECTORY
          ───────────────────────────────────────────────────────────── */}
          <h2>
            <span className="feature-dot"></span> Departmental Guidance
          </h2>
          <p>
            To ensure your query reaches the right team immediately, please review the categories
            below:
          </p>

          <div className="space-y-3 my-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#0052ea] flex items-center justify-center flex-shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e2532]">
                  Students &amp; Job Seekers
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Queries regarding profile building, proof of work, event registrations, AI Station
                  credits, or technical account access.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e2532]">
                  Colleges &amp; Universities
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Institutional onboarding, student cohort management, campus recruitment drives, and
                  joint academic events.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e2532]">
                  Employers &amp; Corporate Recruiters
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Hiring verified talent, posting jobs and internships, competition hosting, and
                  enterprise recruitment solutions.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1e2532]">
                  Privacy &amp; Account Requests
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Account verification, data deletion requests, or questions regarding our{" "}
                  <a
                    href="/privacy_policy"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/privacy_policy");
                    }}
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/termsandconditions"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/termsandconditions");
                    }}
                  >
                    Terms &amp; Conditions
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>


          {/* ─────────────────────────────────────────────────────────────
              4. OPERATING HOURS & COMMITMENT
          ───────────────────────────────────────────────────────────── */}
          <h2>
            <span className="feature-dot"></span> Operating Hours &amp; Response Time
          </h2>
          <p>
            Our customer and support teams operate during the following hours:
          </p>
          <ul>
            <li>
              <strong>Monday to Saturday:</strong> 9:00 AM – 6:30 PM (IST)
            </li>
            <li>
              <strong>Sunday &amp; Public Holidays:</strong> Urgent email support only
            </li>
          </ul>
          <p>
            Inquiries received outside regular operating hours will be addressed first thing on the
            following business day. For immediate account-related assistance, you may also explore
            our{" "}
            <a
              href="/privacy_policy"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy_policy");
              }}
            >
              Privacy Policy
            </a>{" "}
            or{" "}
            <a
              href="/termsandconditions"
              onClick={(e) => {
                e.preventDefault();
                navigate("/termsandconditions");
              }}
            >
              Terms &amp; Conditions
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );

  if (!showLayout) {
    return contactContent;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-outfit selection:bg-blue-600 selection:text-white flex flex-col justify-between">
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
          2. CONTACT US CONTENT
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-grow">{contactContent}</main>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPREHENSIVE FOOTER
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
                  href="https://www.instagram.com/gradenvyofficial?stkn=MWt2eWdkeXJhcno5Ng%3D%3D&utm_source=qr"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
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
                        onClick={() => navigate("/auth/login")}
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
                    { label: "About Grad Envy", path: "/auth/login" },
                    { label: "Vision", path: "/auth/login" },
                    { label: "Mission", path: "/auth/login" },
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

export default ContactUs;
