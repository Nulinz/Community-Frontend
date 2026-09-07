import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

/**
 * Terms Component
 *
 * Exact React conversion of terms.blade.php adhering strictly to the original
 * visual styles, typography, gradients, pills, feature dots, and responsive breakpoints.
 *
 * Responsibilities:
 * - Displays the legal Terms & Conditions for Tender Note (Infinity Enterprises).
 * - Implements the identical blue-gradient header (#0052ea to #0038a8) with the updated date pill.
 * - Renders the floating elevated card (-48px desktop / -32px mobile) with exact shadows, borders, and margins.
 * - Supports full landing layout integration (navigation header & footer) with optional standalone mode.
 */
const Terms = ({ showLayout = true }) => {
  const navigate = useNavigate();

  // Set document title matching blade @section('page_name')
  useEffect(() => {
    document.title = "Terms & Conditions - Grad Envy";
  }, []);

  // Format today's date dynamically as 'M j, Y' (e.g., 'Sep 7, 2026') matching Laravel now()->format('M j, Y')
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const legalContent = (
    <div className="legal-page-wrapper w-full bg-[#f8fafc]">
      {/* ─────────────────────────────────────────────────────────────
          EXACT STYLES IMPORTED FROM terms.blade.php
      ───────────────────────────────────────────────────────────── */}
      <style>{`
        .legal-header {
          background: linear-gradient(135deg, #0052ea 0%, #0038a8 100%);
          padding: 64px 16px 84px;
          text-align: center;
        }

        .legal-header h1 {
          color: #fff;
          font-weight: 700;
          font-size: clamp(26px, 4vw, 38px);
          margin-bottom: 14px;
        }

        .legal-updated-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, .15);
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 30px;
        }

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
          margin: 32px 0 12px;
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
            padding: 32px 24px;
            margin-top: -32px;
          }
        }
      `}</style>

      {/* Header Section */}
      <section className="legal-header">
        <h1>Terms &amp; Conditions</h1>
        <span className="legal-updated-pill">
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Last updated {formattedDate}
        </span>
      </section>

      {/* Body Card Section */}
      <section className="legal-body">
        <div className="legal-card">
          <p>
            These Terms &amp; Conditions ("Terms") govern your use of GradEnvy, a
            service of Infinity Enterprises ("we", "us", "our"), including this
            website and mobile application (the "Service"). By creating an account
            or using the Service, you agree to these Terms.
          </p>

          <h2>
            <span className="feature-dot"></span> Eligibility &amp; Account Registration
          </h2>
          <p>
            The Service is intended for contractors and businesses tracking and bidding
            on tenders. You are responsible for keeping your enrolment number and
            password confidential, and for all activity that occurs under your account.
            Notify us immediately at{" "}
            <a href="mailto:info@nulinz.com">info@nulinz.com</a> if you suspect
            unauthorised use of your account.
          </p>

          <h2>
            <span className="feature-dot"></span> Subscription &amp; Payments
          </h2>
          <ul>
            <li>
              Access to the Service beyond any free/trial period requires an active
              annual subscription, priced as displayed at checkout at the time of
              purchase.
            </li>
            <li>
              Subscriptions are billed annually and renew access for a further 12
              months from the date of successful payment.
            </li>
            <li>
              Payments are processed securely through our payment partner, Cashfree.
              We do not store your card or bank details ourselves.
            </li>
            <li>
              Refunds, if any, are handled in line with our{" "}
              <a
                href="/returnandrefundpolicy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/returnandrefundpolicy");
                }}
              >
                Refund &amp; Cancellation Policy
              </a>
              .
            </li>
          </ul>

          <h2>
            <span className="feature-dot"></span> Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul>
            <li>Share your account credentials or subscription access with anyone else.</li>
            <li>
              Use the Service for any unlawful purpose, or to disrupt or misuse the
              platform.
            </li>
            <li>
              Attempt to copy, reverse-engineer, or resell any part of the Service
              without our written permission.
            </li>
          </ul>

          <h2>
            <span className="feature-dot"></span> Intellectual Property
          </h2>
          <p>
            All software, design, and content that make up the Service are owned by
            Infinity Enterprises. or its licensors and are protected by applicable
            intellectual property laws. You may use the Service only for your own
            business purposes, not for resale or redistribution.
          </p>

          <h2>
            <span className="feature-dot"></span> Termination
          </h2>
          <p>
            We may suspend or terminate access to the Service for any account found to
            be in violation of these Terms. You may stop using the Service, or request
            deletion of your account, at any time — see our{" "}
            <a
              href="/delete_account"
              onClick={(e) => {
                e.preventDefault();
                navigate("/delete_account");
              }}
            >
              Delete Account
            </a>{" "}
            page.
          </p>

          <h2>
            <span className="feature-dot"></span> Disclaimer &amp; Limitation of Liability
          </h2>
          <p>
            The Service is provided "as is" and is intended to help track publicly
            available tender information; we do not guarantee the accuracy,
            completeness, or timeliness of any tender data sourced from third-party
            portals. Infinity Enterprises is not liable for any indirect, incidental,
            or consequential loss arising from reliance on the Service, to the extent
            permitted by law.
          </p>

          <h2>
            <span className="feature-dot"></span> Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service
            after changes take effect constitutes acceptance of the revised Terms.
            Material changes will be reflected by updating the "Last updated" date above.
          </p>

          <h2>
            <span className="feature-dot"></span> Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of India, and any disputes shall be
            subject to the exclusive jurisdiction of the courts at Salem, Tamil Nadu.
          </p>

          <h2>
            <span className="feature-dot"></span> Contact Us
          </h2>
          <p>
            Questions about these Terms can be sent to{" "}
            <a href="mailto:info@nulinz.com">info@nulinz.com</a> or call{" "}
            <a href="tel:+919003300571">+91 9003300571</a>. See our{" "}
            <a
              href="mailto:info@nulinz.com?subject=Contact%20Us"
              onClick={(e) => {
                // If contact route exists, route appropriately
              }}
            >
              Contact Us
            </a>{" "}
            page for more ways to reach us.
          </p>
        </div>
      </section>
    </div>
  );

  if (!showLayout) {
    return legalContent;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-outfit selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER NAVIGATION (Matching GradEnvy Landing Layout)
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
          2. TERMS CONTENT (Exact Match from terms.blade.php)
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-grow">{legalContent}</main>

      {/* ─────────────────────────────────────────────────────────────
          3. FOOTER (Matching GradEnvy Landing Layout)
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#080808] text-white py-16 px-6 md:px-[80px] border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand Information */}
            <div className="md:col-span-4 space-y-4">
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
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Next-gen career operating system connecting ambition with industry. Build
                proof of work, attend verified events, and accelerate your path to top
                tech roles.
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
                    { label: "Privacy Policy", path: "/privacy_policy" },
                    // { label: "Terms & Conditions", path: "/termsandconditions" },
                    { label: "Refund Policy", path: "/returnandrefundpolicy" },
                    { label: "Delete My Account", path: "/delete_account" },
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
                onClick={() => navigate("/termsandconditions")}
                className="hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </button>
              <button
                onClick={() => navigate("/returnandrefundpolicy")}
                className="hover:text-white transition-colors"
              >
                Refund Policy
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

export { Terms as TermsAndConditions };
export default Terms;
