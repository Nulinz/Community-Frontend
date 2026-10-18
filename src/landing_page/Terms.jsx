import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";

/**
 * Terms Component
 *
 * Terms & Conditions for GradEnvy.
 * Synchronized with the global LandingPage navigation header and PrivacyPolicy dark hero section.
 */
const Terms = ({ showLayout = true }) => {
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
          EXACT STYLES IMPORTED FROM terms.blade.php
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
            Terms &amp; Conditions
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
            Welcome to GradEnvy.
          </p>
          <p>
            GradEnvy is a digital platform operated and managed jointly by <strong>NexGen Nextopia Private Limited</strong> and <strong>Nulinz Technology Private Limited</strong> (collectively referred to as "GradEnvy", "we", "us" or "our").
          </p>
          <p>
            <strong>Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.<br />
            <strong>Contact:</strong> <a href="mailto:support@gradenvy.com">support@gradenvy.com</a> | <a href="tel:9080408749">9080408749</a>
          </p>
          <p>
            These Terms and Conditions govern access to and use of the GradEnvy website, Android application, iOS application, and related services.
          </p>
          <p>
            By registering for an account, accessing the platform, or purchasing a subscription, you agree to these Terms and Conditions and the applicable Privacy Policy and Return and Refund Policy. If you do not agree, you must not use the relevant services.
          </p>

          <h2>
            <span className="feature-dot"></span> 2. Eligibility and Age Requirements
          </h2>
          <p>
            2.1. GradEnvy is available to individuals aged 16 years and above, as well as eligible companies, colleges, institutions and their authorised representatives.
          </p>
          <p>
            2.2. Users aged 16 or 17 may use the platform only through the applicable verified parental or lawful guardian consent process. Such users must not misrepresent their age or bypass consent requirements.
          </p>
          <p>
            2.3. Users must provide accurate information during registration and promptly update information that becomes inaccurate.
          </p>
          <p>
            2.4. Companies, colleges and institutional representatives must be legally authorised to act on behalf of their respective organisations.
          </p>
          <p>
            2.5. We may request reasonable information to verify age, identity, institutional affiliation, authority or consent, where necessary and lawful.
          </p>
          <p>
            2.6. Accounts may be restricted or suspended where eligibility, consent or identity requirements are not satisfied.
          </p>

          <h2>
            <span className="feature-dot"></span> 3. Nature and Scope of the Platform
          </h2>
          <p>
            GradEnvy provides a digital environment intended to connect students, working professionals, employers, colleges, institutions and other participants with career-related resources and opportunities.
          </p>
          <p>Features may include:</p>
          <ul>
            <li>Jobs, hiring opportunities and internships.</li>
            <li>Freelancing opportunities and project listings.</li>
            <li>Events, workshops, competitions and related activities.</li>
            <li>Career Wallet and career-related resources.</li>
            <li>AI Stations providing links or access pathways to external artificial intelligence services.</li>
            <li>Resume builder and related career tools.</li>
            <li>Professional networking, institutional collaborations and other platform features.</li>
          </ul>
          <p>
            Features may vary by account type, subscription status, device, location, availability and applicable eligibility requirements.
          </p>
          <p>
            GradEnvy is primarily a platform for discovery, access and connection. Unless expressly agreed in a separate written agreement, GradEnvy does not guarantee employment, internship selection, project awards, freelance earnings, admissions, event outcomes or any particular career result.
          </p>

          <h2>
            <span className="feature-dot"></span> 4. Free Access and GradEnvy Pro
          </h2>
          <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">4.1. Free version</h3>
          <p>
            Users may access selected basic features without purchasing a subscription. These may include exploring events, Career Wallet, AI Stations, resume-building functionality and other basic platform features. Free access may be subject to reasonable usage limits, feature availability and changes notified in accordance with applicable law.
          </p>
          <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">4.2. GradEnvy Pro subscription</h3>
          <p>GradEnvy Pro is the paid platform subscription:</p>
          <ul>
            <li><strong>Price:</strong> ₹499, inclusive of applicable taxes.</li>
            <li><strong>Validity:</strong> 90 days from activation.</li>
            <li><strong>Payment:</strong> One-time payment through the designated payment gateway.</li>
            <li><strong>Renewal:</strong> No automatic renewal. Users must make a fresh purchase to obtain another subscription period.</li>
          </ul>
          <p>
            Pro may provide access to additional jobs, internships, exclusive GradEnvy events or event-related access features, freelancing opportunities, and other premium features made available from time to time. The precise features, eligibility conditions and limitations displayed at the time of purchase form part of the applicable subscription offer.
          </p>
          <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">4.3. Subscription limitations</h3>
          <p>
            A Pro subscription provides access to the stated platform features for the specified period. It does not guarantee that a particular number of jobs, internships, projects, events, clients or earnings will be available.
          </p>
          <p>
            A subscription does not automatically include event tickets, event registration fees, freelance project payments, third-party services or other separately priced items unless expressly stated.
          </p>
          <h3 className="font-bold text-slate-800 text-sm mt-3 mb-1">4.4. Activation and expiry</h3>
          <p>
            The subscription generally becomes active after successful payment confirmation. If payment is debited but the subscription is not activated, the user should contact support with the relevant transaction details. Access to Pro features ordinarily expires after 90 days. Any renewal requires a new purchase and fresh payment.
          </p>

          <h2>
            <span className="feature-dot"></span> 5. Payments and Third-Party Payment Services
          </h2>
          <p>
            5.1. GradEnvy uses Razorpay as a payment gateway for applicable transactions.
          </p>
          <p>
            5.2. Users must provide accurate payment information and complete the applicable payment authorisation process.
          </p>
          <p>
            5.3. The ₹499 Pro price is inclusive of applicable taxes. No additional subscription tax charge is intended to be added to this displayed price, although separately purchased services may have their own disclosed prices and applicable charges.
          </p>
          <p>
            5.4. Payment processing may be subject to Razorpay's applicable terms, security procedures and payment methods.
          </p>
          <p>
            5.5. GradEnvy does not require users to disclose payment passwords, PINs or one-time passwords to customer support.
          </p>
          <p>
            5.6. Payment disputes, failed transactions, duplicate charges and refunds will be handled in accordance with the Return and Refund Policy and applicable law.
          </p>

          <h2>
            <span className="feature-dot"></span> 6. Events and Separately Paid Services
          </h2>
          <p>
            6.1. Events may be organised or listed by GradEnvy, companies, colleges, institutions or other third-party organisers.
          </p>
          <p>
            6.2. Event participation, tickets, registration fees, workshops and other paid event services may be charged separately from GradEnvy Pro.
          </p>
          <p>
            6.3. The relevant event listing or organiser must disclose the applicable price, eligibility requirements, schedule, cancellation terms and other material conditions before purchase, as applicable.
          </p>
          <p>
            6.4. Event-related refunds will be assessed under the applicable event-specific terms, the Return and Refund Policy where relevant, and applicable law.
          </p>
          <p>
            6.5. Where a third-party organiser is responsible for an event, the organiser is responsible for the representations, arrangements and performance within its control. This does not exclude any liability that applicable law places on GradEnvy.
          </p>

          <h2>
            <span className="feature-dot"></span> 7. User Accounts and Security
          </h2>
          <p>
            7.1. Users are responsible for maintaining the confidentiality of their account credentials and for activities carried out through their accounts, subject to applicable law.
          </p>
          <p>
            7.2. Users must notify GradEnvy promptly if they suspect unauthorised access, account misuse or a security incident.
          </p>
          <p>
            7.3. Users must not create misleading accounts, impersonate another person, falsify qualifications, misrepresent organisational authority or provide fraudulent information.
          </p>
          <p>
            7.4. GradEnvy may introduce reasonable verification, authentication and account-security procedures.
          </p>
          <p>
            7.5. Users must not share accounts in a manner that bypasses subscription, security or access restrictions.
          </p>

          <h2>
            <span className="feature-dot"></span> 8. User-Generated Content and Listings
          </h2>
          <p>
            Users and authorised organisations may submit job listings, internship opportunities, project descriptions, event details, resumes, professional information and other permitted content.
          </p>
          <p>By submitting content, you represent that:</p>
          <ul>
            <li>You have the right and authority to submit it.</li>
            <li>It is accurate to the best of your knowledge and does not intentionally mislead others.</li>
            <li>It does not infringe another person's intellectual property, privacy or other legal rights.</li>
            <li>It does not contain unlawful, fraudulent, abusive, defamatory, discriminatory or otherwise prohibited material.</li>
            <li>You have obtained any necessary permission before submitting another person's personal information.</li>
          </ul>
          <p>
            You retain ownership of content that you lawfully own. You grant GradEnvy a limited, non-exclusive permission to host, store, reproduce, display and process that content as reasonably necessary to operate, secure and improve the platform and provide the services you request, subject to the Privacy Policy and applicable law.
          </p>
          <p>
            You must not upload confidential information or another person's personal data unless you have appropriate authority and a lawful basis to do so.
          </p>

          <h2>
            <span className="feature-dot"></span> 9. Company, College and Employer Responsibilities
          </h2>
          <p>
            Companies, colleges, recruiters and other opportunity providers are responsible for ensuring that their listings, requirements, representations and communications are lawful and accurate.
          </p>
          <p>They must not:</p>
          <ul>
            <li>Publish fake, fraudulent or misleading vacancies, internships, projects or events.</li>
            <li>Request unlawful fees or sensitive personal information from candidates.</li>
            <li>Discriminate unlawfully or misuse candidate information.</li>
            <li>Misrepresent compensation, eligibility, working conditions or selection criteria.</li>
            <li>Use the platform for scams, spam, harassment or unauthorised data collection.</li>
          </ul>
          <p>
            Opportunity providers must handle candidate information only for legitimate, disclosed purposes and in accordance with applicable data-protection law. GradEnvy may review, restrict or remove listings that appear suspicious, unlawful, misleading or inconsistent with these Terms.
          </p>

          <h2>
            <span className="feature-dot"></span> 10. Jobs, Internships and Freelancing
          </h2>
          <p>
            10.1. GradEnvy may facilitate discovery of opportunities and communication between candidates and opportunity providers.
          </p>
          <p>
            10.2. The relevant employer or provider generally determines eligibility, shortlisting, interviews, selection, remuneration, contractual terms and the final outcome.
          </p>
          <p>
            10.3. GradEnvy does not guarantee selection, employment, internship placement, freelance work, payment by a third party, or project completion.
          </p>
          <p>
            10.4. Users should independently verify an opportunity provider and carefully review any employment, internship, freelance or project agreement before accepting an offer.
          </p>
          <p>
            10.5. Unless expressly stated otherwise in a separate written agreement, GradEnvy is not the employer, recruitment agent, contracting principal or payment guarantor for transactions between users and third-party opportunity providers.
          </p>
          <p>
            10.6. Nothing in this section excludes any obligation or liability that GradEnvy may have under applicable law.
          </p>

          <h2>
            <span className="feature-dot"></span> 11. AI Stations and External Websites
          </h2>
          <p>
            11.1. AI Stations may display links or access pathways to third-party artificial intelligence tools and websites.
          </p>
          <p>
            11.2. Selecting an AI Station may redirect you away from GradEnvy to an external service. That service may have its own terms, privacy policy, account requirements, fees and data-processing practices.
          </p>
          <p>
            11.3. GradEnvy does not control all external AI services and does not guarantee their accuracy, availability, security or suitability.
          </p>
          <p>
            11.4. AI-generated content may be inaccurate, incomplete, outdated or inappropriate for a particular purpose. Users should independently verify important outputs and must not rely on AI outputs as professional, legal, financial, medical or other specialised advice without appropriate verification.
          </p>
          <p>
            11.5. Users should avoid submitting confidential, sensitive or unnecessary personal information to external AI tools. Any information submitted after redirection may be processed by the external provider under its applicable policies.
          </p>

          <h2>
            <span className="feature-dot"></span> 12. Intellectual Property
          </h2>
          <p>
            The GradEnvy name, branding, logos, interface, original software, design elements and platform materials are owned by or licensed to the relevant rights holders, subject to applicable law.
          </p>
          <p>
            Users may access and use the platform for its intended lawful purposes. They must not copy, modify, distribute, reverse-engineer, exploit or commercially reproduce protected platform materials except as permitted by law or with written authorisation. Third-party names, logos, content and trademarks remain the property of their respective owners.
          </p>

          <h2>
            <span className="feature-dot"></span> 13. Prohibited Conduct
          </h2>
          <p>Users must not:</p>
          <ul>
            <li>Use GradEnvy for unlawful, fraudulent or deceptive purposes.</li>
            <li>Upload malicious code or attempt unauthorised access to accounts, systems or data.</li>
            <li>Interfere with the platform's operation or security.</li>
            <li>Scrape, harvest or misuse personal information without lawful authority.</li>
            <li>Publish fake opportunities, impersonate others or manipulate listings.</li>
            <li>Harass, threaten, exploit or discriminate unlawfully against other users.</li>
            <li>Circumvent payment requirements or misuse subscriptions.</li>
            <li>Infringe intellectual property or violate applicable laws.</li>
            <li>Use the platform to facilitate scams, unlawful recruitment fees or other prohibited activities.</li>
          </ul>

          <h2>
            <span className="feature-dot"></span> 14. Moderation, Suspension and Termination
          </h2>
          <p>
            GradEnvy may investigate suspected violations and remove content, restrict features, suspend accounts or terminate access where reasonably necessary because of fraud, abuse, false listings, security risks, policy violations, legal requirements or other legitimate operational reasons.
          </p>
          <p>
            Where appropriate and practicable, GradEnvy may provide notice and an opportunity to respond. Immediate action may be taken when necessary to protect users, prevent harm, address suspected fraud or comply with law.
          </p>
          <p>
            Users may request account deletion through the available account controls or by contacting support — see our{" "}
            <a
              href="/delete_account"
              onClick={(e) => {
                e.preventDefault();
                navigate("/delete_account");
              }}
            >
              Delete Account
            </a>{" "}
            page. Deletion may be subject to lawful retention requirements, pending transactions, dispute resolution and technical processing. Suspension or termination does not remove rights to refunds or other remedies that applicable law requires.
          </p>

          <h2>
            <span className="feature-dot"></span> 15. Service Availability and Changes
          </h2>
          <p>
            GradEnvy aims to maintain reliable services but does not guarantee uninterrupted or error-free availability. Services may be temporarily unavailable because of maintenance, technical failures, cybersecurity incidents, network outages, third-party service failures, natural disasters, government restrictions or other circumstances beyond reasonable control.
          </p>
          <p>
            GradEnvy may modify or discontinue features for legitimate operational, security, legal or business reasons. Material changes affecting paid subscriptions will be handled consistently with applicable law and the Return and Refund Policy.
          </p>

          <h2>
            <span className="feature-dot"></span> 16. Disclaimers and Limitation of Liability
          </h2>
          <p>
            To the extent permitted by law, GradEnvy does not guarantee the accuracy of every third-party listing, the conduct of every user, the availability of every opportunity or the outcome of any recruitment, project, freelance engagement or event.
          </p>
          <p>
            Nothing in these Terms excludes liability for fraud, wilful misconduct, statutory consumer rights, or any liability that cannot lawfully be excluded or limited.
          </p>
          <p>
            Subject to the foregoing, GradEnvy will not be liable for indirect or consequential losses to the extent such exclusion is legally permitted. Any liability limitation will be interpreted consistently with applicable Indian law.
          </p>

          <h2>
            <span className="feature-dot"></span> 17. Privacy and Personal Data
          </h2>
          <p>
            The GradEnvy{" "}
            <a
              href="/privacy_policy"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy_policy");
              }}
            >
              Privacy Policy
            </a>{" "}
            explains how personal data is collected, used, shared, retained and protected.
          </p>
          <p>
            Users must review that policy before providing personal information. Personal data will be handled in accordance with applicable law, the disclosed purposes of processing and any required consent or other lawful basis.
          </p>

          <h2>
            <span className="feature-dot"></span> 18. Grievances and Customer Support
          </h2>
          <p>For questions, complaints, account issues, payment concerns or privacy requests, contact:</p>
          <p>
            <strong>Email:</strong> <a href="mailto:support@gradenvy.com">support@gradenvy.com</a><br />
            <strong>Phone:</strong> <a href="tel:9080408749">9080408749</a><br />
            <strong>Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.
          </p>
          <p>
            Complaints will be handled in accordance with applicable legal requirements. Any legally required grievance officer or designated contact details will be published when formally designated.
          </p>

          <h2>
            <span className="feature-dot"></span> 19. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of India.
          </p>
          <p>
            Subject to mandatory consumer-protection laws and the jurisdiction of any competent statutory authority or tribunal, courts of competent jurisdiction in Salem, Tamil Nadu, may hear disputes arising from these Terms where such jurisdiction is legally available.
          </p>
          <p>
            Nothing in these Terms prevents a consumer from exercising any statutory right to approach a competent consumer commission or other legally authorised forum.
          </p>

          <h2>
            <span className="feature-dot"></span> 20. Amendments
          </h2>
          <p>
            GradEnvy may update these Terms to reflect changes in its services, business operations or applicable law. Updated Terms will be published on the relevant platform with an updated date.
          </p>
          <p>
            Where required by law, material changes will be notified and additional consent will be obtained. Continued use after an update will constitute acceptance only to the extent legally valid.
          </p>

          <h2>
            <span className="feature-dot"></span> 21. Severability
          </h2>
          <p>
            If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law.
          </p>

          <h2>
            <span className="feature-dot"></span> 22. Contact
          </h2>
          <p>
            For questions concerning these Terms, contact <a href="mailto:support@gradenvy.com">support@gradenvy.com</a> or <a href="tel:9080408749">9080408749</a>. See our{" "}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
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
          2. TERMS CONTENT (Exact Match from terms.blade.php)
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

export { Terms as TermsAndConditions };
export default Terms;
