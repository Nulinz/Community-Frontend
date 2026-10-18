import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";

/**
 * RefundPolicy Component
 *
 * Refund & Cancellation Policy for GradEnvy.
 * Synchronized with the global LandingPage navigation header and PrivacyPolicy dark hero section.
 */
const RefundPolicy = ({ showLayout = true }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Format today's date dynamically as 'M j, Y' (e.g., 'Sep 7, 2026') matching Laravel now()->format('M j, Y')
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const legalContent = (
    <div className="legal-page-wrapper w-full bg-[#f8fafc]">
      {/* ─────────────────────────────────────────────────────────────
          EXACT STYLES IMPORTED FROM refund-cancellation-policy
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
            Refund &amp; Cancellation Policy
          </h1>

          {/* Subtitle / Last Updated */}
          <p className="text-gray-400 text-sm sm:text-base font-normal">
            Last updated {formattedDate}
          </p>
        </div>
      </section>

      {/* Body Card Section */}
      <section className="legal-body">
        <div className="legal-card">
          <p>
            This Return and Refund Policy explains the conditions under which refunds may be requested for GradEnvy Pro subscriptions and other paid services offered through the GradEnvy platform.
          </p>
          <p>
            GradEnvy is jointly operated and managed by <strong>NexGen Nextopia Private Limited</strong> and <strong>Nulinz Technology Private Limited</strong>.
          </p>
          <p>
            <strong>Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.<br />
            <strong>Email:</strong> <a href="mailto:support@gradenvy.com">support@gradenvy.com</a> | <strong>Phone:</strong> <a href="tel:9080408749">9080408749</a>
          </p>
          <p>
            This policy applies alongside the Terms and Conditions, applicable service-specific terms, payment-provider requirements and Indian law.
          </p>

          <h2>
            <span className="feature-dot"></span> 2. GradEnvy Pro Subscription
          </h2>
          <p>
            GradEnvy Pro is a digital subscription providing access to designated premium platform features.
          </p>
          <ul>
            <li><strong>Subscription price:</strong> ₹499, inclusive of applicable taxes.</li>
            <li><strong>Subscription period:</strong> 90 days from activation.</li>
            <li><strong>Payment method:</strong> Razorpay payment gateway.</li>
            <li><strong>Renewal:</strong> No automatic renewal.</li>
          </ul>
          <p>
            The subscription provides access to the applicable Pro features during the stated period. Separately priced events, third-party services and other independently charged offerings are not included unless expressly stated.
          </p>

          <h2>
            <span className="feature-dot"></span> 3. Seven-Day Cancellation and Refund Review Period
          </h2>
          <p>
            Users may submit a cancellation or refund request within <strong>seven calendar days</strong> of the original subscription purchase.
          </p>
          <p>
            A request made within this period will be reviewed individually. Submitting a request does not automatically guarantee a refund.
          </p>
          <p>
            The review will consider the circumstances of the request, the status and availability of the service, the reason for the request, any applicable service-specific terms and the user's rights under applicable law.
          </p>
          <p>
            The seven-day period does not restrict any longer refund period or other remedy that may be mandatory under applicable law.
          </p>

          <h2>
            <span className="feature-dot"></span> 4. Circumstances in Which Refunds May Be Granted
          </h2>
          <p>Subject to verification and applicable law, refunds may be granted in the following circumstances:</p>

          <h3 className="font-bold text-slate-800 text-sm mt-4 mb-1">4.1. Failed or unsuccessful transactions</h3>
          <p>
            Where a payment has been debited but the subscription or service has not been activated, GradEnvy will investigate the transaction and arrange an appropriate refund or payment reversal where applicable.
          </p>

          <h3 className="font-bold text-slate-800 text-sm mt-4 mb-1">4.2. Duplicate or erroneous payments</h3>
          <p>
            Where a user has been charged more than once for the same purchase, or a verified payment error has occurred, the excess or erroneous amount will be refunded as appropriate.
          </p>

          <h3 className="font-bold text-slate-800 text-sm mt-4 mb-1">4.3. Discontinuation or closure of the platform</h3>
          <p>
            If GradEnvy permanently closes, ceases operations, or discontinues the relevant paid service before the promised subscription access has been provided, refunds for affected users will be assessed and provided as required by applicable law and the circumstances.
          </p>
          <p>
            Where a paid service becomes permanently unavailable, GradEnvy will consider the unused subscription period and other relevant factors when determining an appropriate remedy.
          </p>

          <h3 className="font-bold text-slate-800 text-sm mt-4 mb-1">4.4. Exceptional circumstances beyond reasonable control</h3>
          <p>
            If a natural disaster, government restriction, major infrastructure failure or another exceptional circumstance beyond reasonable control prevents GradEnvy from providing the relevant paid service, affected requests will be reviewed individually.
          </p>
          <p>
            Where the service cannot be provided for a material period or is permanently discontinued, GradEnvy will determine the appropriate refund or other remedy in accordance with applicable law and the circumstances.
          </p>

          <h3 className="font-bold text-slate-800 text-sm mt-4 mb-1">4.5. Refunds required by law</h3>
          <p>
            Refunds will be provided wherever required by applicable consumer-protection law, payment regulations, a binding order of a competent authority or another mandatory legal obligation. Nothing in this policy removes or limits a user's statutory rights.
          </p>

          <h2>
            <span className="feature-dot"></span> 5. Circumstances That Do Not Automatically Qualify for a Refund
          </h2>
          <p>A refund is not automatically guaranteed merely because:</p>
          <ul>
            <li>A user changes their mind after purchasing Pro.</li>
            <li>A user does not use the subscription or access the available features.</li>
            <li>A user does not receive a job, internship, freelance assignment, project, interview or selection.</li>
            <li>A user does not achieve a particular career outcome.</li>
            <li>A user is unable to access a third-party opportunity because of that provider's eligibility requirements.</li>
            <li>A user chooses not to participate in an event or activity.</li>
          </ul>
          <p>
            These circumstances will be assessed in light of the applicable purchase terms and law. This section does not exclude refunds or remedies required where a service is defective, deficient, materially different from what was promised, or otherwise subject to a legal refund obligation.
          </p>

          <h2>
            <span className="feature-dot"></span> 6. Separately Paid Events and Services
          </h2>
          <p>
            Events may be organised by GradEnvy, companies, colleges, institutions or third-party organisers. Event registrations, tickets, workshops and other paid services may carry separate charges.
          </p>
          <ul>
            <li>The applicable event listing or organiser's published cancellation and refund terms will be considered for event-related requests.</li>
            <li>Where an organiser cancels an event, materially changes its arrangements, or cannot provide the paid event service, refunds or alternative remedies will be handled in accordance with the applicable event terms and law.</li>
            <li>Where a third-party organiser collects payment directly, the user may need to contact that organiser for the relevant transaction. GradEnvy will provide reasonable assistance where appropriate, without excluding any responsibility imposed on GradEnvy by law.</li>
            <li>Purchasing GradEnvy Pro does not automatically entitle the subscriber to a refund of separately purchased event fees.</li>
          </ul>

          <h2>
            <span className="feature-dot"></span> 7. How to Request a Refund
          </h2>
          <p>
            Users should submit refund requests through the following contact channel:{" "}
            <a href="mailto:support@gradenvy.com">support@gradenvy.com</a>
          </p>
          <p>The request should include, where available:</p>
          <ul>
            <li>Registered name and email address or mobile number.</li>
            <li>Transaction ID or Razorpay payment reference.</li>
            <li>Date and amount of payment.</li>
            <li>Description of the issue and reason for the request.</li>
            <li>Relevant supporting information, such as a payment confirmation or error message.</li>
          </ul>
          <p className="italic text-xs text-slate-500">
            Users should not send passwords, payment PINs, one-time passwords or complete payment-card credentials.
          </p>
          <p>
            GradEnvy may request reasonable additional information to verify the transaction and assess the request.
          </p>

          <h2>
            <span className="feature-dot"></span> 8. Review and Processing Timeline
          </h2>
          <p>
            GradEnvy will review refund requests individually and may verify payment records, subscription activation, service availability and other relevant details.
          </p>
          <p>
            Where a refund is approved, GradEnvy will initiate or arrange the refund within <strong>seven business days</strong> of approval, subject to the applicable payment process and legal requirements.
          </p>
          <p>
            The time taken for the refunded amount to appear in the user's account may depend on Razorpay, the relevant bank, payment method and financial institution.
          </p>
          <p>
            If additional verification is required, GradEnvy will communicate with the user where reasonably practicable. Any mandatory legal refund deadline will prevail over this policy's general processing timeline.
          </p>

          <h2>
            <span className="feature-dot"></span> 9. Refund Method
          </h2>
          <p>
            Where practicable, approved refunds will be processed through the original payment method used for the transaction. If that method is unavailable or the payment provider requires an alternative procedure, the user may be asked to follow a secure alternative process.
          </p>
          <p>
            GradEnvy will not request a user's payment PIN or one-time password to process a refund.
          </p>

          <h2>
            <span className="feature-dot"></span> 10. Fraudulent or Unauthorised Transactions
          </h2>
          <p>
            Users should promptly report suspected unauthorised transactions or payment fraud to GradEnvy and their payment provider or bank. GradEnvy may investigate suspicious transactions and coordinate with relevant payment providers where appropriate.
          </p>
          <p>
            This section does not restrict any rights users have to raise disputes or seek remedies through their bank, payment provider, consumer commission or other competent authority.
          </p>

          <h2>
            <span className="feature-dot"></span> 11. Account Suspension or Termination
          </h2>
          <p>
            Where an account is suspended or terminated because of fraud, abuse, false listings or policy violations, refund eligibility will be assessed under the applicable terms and law.
          </p>
          <p>
            Suspension or termination does not automatically create a right to a refund, but it also does not eliminate any refund or other remedy required by applicable law.
          </p>

          <h2>
            <span className="feature-dot"></span> 12. Changes to This Policy
          </h2>
          <p>
            GradEnvy may update this policy to reflect changes in its services, payment procedures or applicable legal requirements. The latest version will be published on the relevant platform with an updated date. Material changes will be notified where required by law.
          </p>
          <p>
            The policy applicable to a purchase will be interpreted consistently with any mandatory consumer rights and legal protections applicable to that transaction.
          </p>

          <h2>
            <span className="feature-dot"></span> 13. Contact and Grievances
          </h2>
          <p>For refund requests, payment disputes or questions about this policy, contact:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:support@gradenvy.com">support@gradenvy.com</a><br />
            <strong>Phone:</strong> <a href="tel:9080408749">9080408749</a><br />
            <strong>Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.
          </p>
          <p>
            Complaints will be handled in accordance with applicable law and any legally required grievance procedures.
          </p>

          <h2>
            <span className="feature-dot"></span> 14. Governing Law
          </h2>
          <p>
            This policy is governed by the laws of India, including applicable consumer-protection and payment-related laws. Nothing in this policy prevents a user from exercising a statutory right or approaching a competent consumer commission, court or other authorised forum.
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
          2. REFUND POLICY CONTENT (Exact Match from refund-cancellation-policy.blade.php)
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-grow">{legalContent}</main>

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

export { RefundPolicy as RefundCancellationPolicy };
export default RefundPolicy;
