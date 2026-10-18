import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";

const tocItems = [
    { id: "section-1", number: "1.", label: "Introduction" },
    { id: "section-2", number: "2.", label: "Scope" },
    { id: "section-3", number: "3.", label: "Personal Data We May Collect" },
    { id: "section-4", number: "4.", label: "How We Use Personal Data" },
    { id: "section-5", number: "5.", label: "Legal Basis and Consent" },
    { id: "section-6", number: "6.", label: "Personal Data of Users Aged 16 and 17" },
    { id: "section-7", number: "7.", label: "Sharing of Personal Data" },
    { id: "section-8", number: "8.", label: "External AI Tools and Third-Party Websites" },
    { id: "section-9", number: "9.", label: "Data Storage and International Processing" },
    { id: "section-10", number: "10.", label: "Data Security" },
    { id: "section-11", number: "11.", label: "Data Retention and Deletion" },
    { id: "section-12", number: "12.", label: "User Rights and Privacy Requests" },
    { id: "section-13", number: "13.", label: "Cookies and Similar Technologies" },
    { id: "section-14", number: "14.", label: "Communications and Marketing" },
    { id: "section-15", number: "15.", label: "Third-Party Links and Services" },
    { id: "section-16", number: "16.", label: "Changes to This Privacy Policy" },
    { id: "section-17", number: "17.", label: "Grievances and Contact" },
    { id: "section-18", number: "18.", label: "Applicable Law" },
];

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("section-1");

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 180;
            for (let i = tocItems.length - 1; i >= 0; i--) {
                const item = tocItems[i];
                const element = document.getElementById(item.id);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(item.id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-800 font-outfit selection:bg-blue-600 selection:text-white flex flex-col justify-between">
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

                    {/* Center Navigation Links */}
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

                    {/* Right Action Buttons */}
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
          2. HERO HEADER BANNER (DARK GRADIENT)
      ───────────────────────────────────────────────────────────── */}
            <section className="relative w-full bg-[#050814] pt-16 pb-20 px-6 md:px-[80px] text-center overflow-hidden border-b border-white/10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#0084FF]/15 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <div className="inline-block">
                        <span className="px-5 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-[#0C1527]/90 text-[#00A3FF] border border-[#00A3FF]/40 backdrop-blur-md">
                            GRAD ENVY
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-tight">
                        Privacy Policy
                    </h1>

                    <p className="text-gray-400 text-sm sm:text-base font-normal">
                        Last Updated: October 2026
                    </p>
                </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT SECTION (WHITE BACKGROUND)
      ───────────────────────────────────────────────────────────── */}
            <main className="w-full max-w-[1340px] mx-auto px-6 md:px-[80px] py-14 sm:py-20 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* ── LEFT SIDEBAR: TABLE OF CONTENTS ── */}
                    <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                        <h2 className="text-[#090D16] font-bold text-xs tracking-widest uppercase">
                            TABLE OF CONTENTS
                        </h2>

                        <nav className="flex flex-col space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                            {tocItems.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`text-left text-xs sm:text-[13px] leading-relaxed py-2 px-3 rounded-xl transition-all duration-200 flex items-start gap-1.5 ${isActive
                                            ? "bg-[#EBF5FF] text-[#0070F3] font-bold shadow-sm"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                            }`}
                                    >
                                        <span className="shrink-0">{item.number}</span>
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* ── RIGHT COLUMN: PRIVACY NOTICE CONTENT ── */}
                    <article className="lg:col-span-8 space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
                        {/* Summary Box */}
                        <div className="bg-[#F0F7FF] border border-[#D0E4FF] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
                            <h2 className="text-[#0070F3] font-bold text-xs sm:text-sm tracking-wider uppercase">
                                POLICY HIGHLIGHTS & OPERATOR DETAILS
                            </h2>
                            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                                <p>
                                    GradEnvy is jointly operated and managed by <strong className="text-slate-900">NexGen Nextopia Private Limited</strong> and <strong className="text-slate-900">Nulinz Technology Private Limited</strong> (collectively referred to as "GradEnvy", "we", "us", or "our").
                                </p>
                                <p>
                                    <strong className="text-slate-900">Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.
                                </p>
                                <p>
                                    <strong className="text-slate-900">Contact:</strong>{" "}
                                    <a href="mailto:support@gradenvy.com" className="text-[#0070F3] hover:underline">support@gradenvy.com</a> |{" "}
                                    <a href="tel:9080408749" className="text-[#0070F3] hover:underline">9080408749</a>
                                </p>
                            </div>
                        </div>

                        {/* ── DETAILED SECTIONS (1 TO 18) ── */}
                        <div className="space-y-12">
                            {/* Section 1 */}
                            <section id="section-1" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    1. INTRODUCTION
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    This Privacy Policy explains how GradEnvy collects, uses, stores, shares and protects personal information when individuals and organisations use the GradEnvy website, Android application, iOS application and related services.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    GradEnvy is jointly operated and managed by:
                                </p>
                                <ul className="space-y-1.5 pl-5 text-xs sm:text-sm text-slate-600 list-disc">
                                    <li>NexGen Nextopia Private Limited; and</li>
                                    <li>Nulinz Technology Private Limited.</li>
                                </ul>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    These companies are collectively referred to as "GradEnvy", "we", "us" or "our" in this policy.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    <strong className="text-slate-900">Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.<br />
                                    <strong className="text-slate-900">Contact:</strong> support@gradenvy.com | 9080408749.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    The companies' respective responsibilities for personal-data processing will be determined by their actual roles, arrangements and applicable law.
                                </p>
                            </section>

                            {/* Section 2 */}
                            <section id="section-2" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    2. SCOPE
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    This policy applies to personal data processed through GradEnvy accounts, profiles, platform features, communications, subscription transactions, recruitment and project-related interactions, and customer-support activities.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    It also explains the limits of GradEnvy's responsibility when a user leaves the platform to access an independent third-party service, including an external AI website.
                                </p>
                            </section>

                            {/* Section 3 */}
                            <section id="section-3" className="scroll-mt-28 space-y-5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    3. PERSONAL DATA WE MAY COLLECT
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    The information collected depends on the user's role, chosen features and interactions with GradEnvy.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.1. Account and contact information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1">We may collect:</p>
                                        <ul className="space-y-1 pl-5 text-xs sm:text-sm text-slate-600 list-disc mt-1">
                                            <li>Name.</li>
                                            <li>Email address.</li>
                                            <li>Mobile number.</li>
                                            <li>Age or date of birth, where needed for eligibility or age verification.</li>
                                            <li>Login and authentication information.</li>
                                            <li>Account preferences and communication settings.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.2. Student and professional information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1">Depending on the features used, we may collect:</p>
                                        <ul className="space-y-1 pl-5 text-xs sm:text-sm text-slate-600 list-disc mt-1">
                                            <li>Educational qualifications and institution details.</li>
                                            <li>Employment history, skills and professional interests.</li>
                                            <li>Resume and portfolio information.</li>
                                            <li>Career preferences and job application details.</li>
                                            <li>Project submissions and freelancing-related information.</li>
                                            <li>Information voluntarily provided in a profile or application.</li>
                                        </ul>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1.5 italic">
                                            Users should provide only information they are authorised to share.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.3. Company, college and representative information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1">For organisations and their representatives, we may collect:</p>
                                        <ul className="space-y-1 pl-5 text-xs sm:text-sm text-slate-600 list-disc mt-1">
                                            <li>Organisation name and business contact details.</li>
                                            <li>Official email address and phone number.</li>
                                            <li>Job, internship, project and event information.</li>
                                            <li>Representative names, designations and authorisation details.</li>
                                            <li>Information required to verify an organisation or listing.</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.4. Payment and transaction information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1">For GradEnvy Pro and other paid services, we may process:</p>
                                        <ul className="space-y-1 pl-5 text-xs sm:text-sm text-slate-600 list-disc mt-1">
                                            <li>Subscription type, amount and validity.</li>
                                            <li>Transaction references, payment status and timestamps.</li>
                                            <li>Refund requests and transaction correspondence.</li>
                                            <li>Relevant billing or invoice information.</li>
                                        </ul>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                                            Payments are processed through Razorpay or another expressly identified authorised payment channel, where applicable. Payment credentials and other payment information may be processed by the relevant payment provider under its own terms. GradEnvy does not intend to collect users' payment PINs or one-time passwords through customer support.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.5. Technical and usage information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1">Where enabled and lawfully collected, we may process:</p>
                                        <ul className="space-y-1 pl-5 text-xs sm:text-sm text-slate-600 list-disc mt-1">
                                            <li>Device type, operating system and application version.</li>
                                            <li>IP address and connection information.</li>
                                            <li>Log records, crash reports and diagnostic information.</li>
                                            <li>Feature usage, interaction events and session-related information.</li>
                                            <li>Security and fraud-prevention signals.</li>
                                        </ul>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
                                            The actual information collected will depend on the technical configuration of the platform and the services in use.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.6. Communications and user-submitted content</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                            We may process information contained in support messages, feedback, reports, resumes, profiles, job listings, projects, event listings and other material users submit to the platform. Please avoid submitting confidential information or another person's personal data unless necessary and authorised.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">3.7. Parental or guardian consent information</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                            For users aged 16 or 17, we may collect and process information necessary to establish age eligibility, identify or verify a parent or lawful guardian, record consent and maintain compliance records. We will seek to limit this information to what is reasonably necessary and lawful for these purposes.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section id="section-4" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    4. HOW WE USE PERSONAL DATA
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm">We may use personal data for the following purposes:</p>
                                <ul className="space-y-1.5 pl-5 text-xs sm:text-sm text-slate-600 list-disc">
                                    <li>Creating, maintaining and securing user accounts.</li>
                                    <li>Providing the platform's features and requested services.</li>
                                    <li>Supporting access to jobs, internships, projects, freelancing opportunities and events.</li>
                                    <li>Enabling candidate applications and sharing relevant candidate information with the relevant opportunity provider where authorised and lawful.</li>
                                    <li>Processing Pro subscriptions, verifying payments and administering refunds.</li>
                                    <li>Responding to support requests, complaints and privacy enquiries.</li>
                                    <li>Verifying accounts, organisations, listings, eligibility and parental consent where necessary.</li>
                                    <li>Detecting fraud, preventing abuse, maintaining security and enforcing platform rules.</li>
                                    <li>Maintaining required records, meeting legal obligations and responding to lawful requests.</li>
                                    <li>Understanding platform performance, diagnosing technical issues and improving functionality.</li>
                                    <li>Sending service-related notifications and, where permitted, optional promotional communications.</li>
                                    <li>Protecting users, the platform and the legitimate interests recognised under applicable law.</li>
                                </ul>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    We will not treat a user's acceptance of this policy as unlimited permission to use personal data for unrelated purposes.
                                </p>
                            </section>

                            {/* Section 5 */}
                            <section id="section-5" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    5. LEGAL BASIS AND CONSENT
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We will process personal data only on a basis permitted by applicable law, including consent where required, legally recognised uses, performance of requested services where permitted, and compliance with legal obligations.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Where consent is required, we will seek it through an appropriate process and provide relevant information about the purposes of processing. Users may withdraw consent where applicable, subject to legal consequences and any other lawful basis for retaining or processing the information.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Withdrawal of consent may affect our ability to provide certain features or services that depend on that consent.
                                </p>
                            </section>

                            {/* Section 6 */}
                            <section id="section-6" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    6. PERSONAL DATA OF USERS AGED 16 AND 17
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    GradEnvy permits eligible users aged 16 and 17 to use the platform subject to the required verified parental or lawful guardian consent process.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We will implement or maintain the safeguards required by applicable law, including age and consent verification, appropriate notices, and restrictions on prohibited processing of children's personal data where applicable.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We will not knowingly permit a child to bypass the required consent process. If we discover that required consent is missing or invalid, we may restrict or suspend the relevant account until the matter is resolved.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Parents or lawful guardians may contact support to raise concerns about a minor's account or personal information, subject to appropriate verification.
                                </p>
                            </section>

                            {/* Section 7 */}
                            <section id="section-7" className="scroll-mt-28 space-y-4">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    7. SHARING OF PERSONAL DATA
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                                    GradEnvy does not intend to sell personal data to third parties for their independent commercial use.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm">We may share or permit access to personal data in the following circumstances:</p>

                                <div className="space-y-3 pl-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">7.1. Between the two operating companies</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                                            NexGen Nextopia Private Limited and Nulinz Technology Private Limited may share information as necessary to jointly operate, administer, secure and support GradEnvy, subject to applicable law and their respective responsibilities.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">7.2. Employers and opportunity providers</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                                            Relevant candidate information may be shared with employers, recruiters, companies, colleges, project providers or event organisers when necessary for a requested application, opportunity, registration or interaction, and where authorised and lawful. Users should understand that information they choose to submit for an application or publish in a profile may be visible to the relevant recipient.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">7.3. Payment and technical service providers</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                                            We may share necessary information with service providers such as Razorpay, hosting providers, communications providers, security services, analytics services and technical support providers. Such providers may process information to perform contracted services, comply with law or protect their systems. The actual providers and processing locations will depend on the services GradEnvy uses.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">7.4. Legal and security disclosures</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                                            We may disclose information when required by law, a court order or lawful government request, or when reasonably necessary to investigate fraud, address security threats, protect rights or enforce legal obligations.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">7.5. Business restructuring</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                                            If GradEnvy or either operating company undergoes a merger, restructuring, acquisition or transfer of relevant operations, personal data may be transferred where legally permitted and subject to appropriate safeguards and notices.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-xs sm:text-sm italic">
                                    We do not authorise recipients to use personal data for unrelated purposes merely because it has been shared with them.
                                </p>
                            </section>

                            {/* Section 8 */}
                            <section id="section-8" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    8. EXTERNAL AI TOOLS AND THIRD-PARTY WEBSITES
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    GradEnvy's AI Stations provide links or access pathways to external artificial intelligence services. They may redirect users to third-party websites.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Once redirected, the external provider may collect information directly from the user, including account details, prompts, uploaded documents, device information and usage information, depending on its service.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    That provider's own privacy policy, terms and technical practices govern its processing of information on its service, subject to applicable law. GradEnvy does not control the independent data practices of external AI providers and cannot guarantee that their processing is limited to India or to GradEnvy's own systems.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Before submitting personal, confidential or sensitive information to an external AI service, users should review that provider's privacy policy and avoid sharing information that is unnecessary for the task.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    If GradEnvy embeds a third-party tool in the platform or shares information directly with an AI provider, that processing will be disclosed and handled as required by applicable law.
                                </p>
                            </section>

                            {/* Section 9 */}
                            <section id="section-9" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    9. DATA STORAGE AND INTERNATIONAL PROCESSING
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    GradEnvy intends to use service providers and hosting arrangements appropriate for secure platform operation. Depending on the providers used, personal data may be stored or processed in India or in other countries.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We will assess applicable legal requirements, contractual safeguards, security needs and any restrictions on cross-border transfers that apply to the relevant data and service.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We do not promise that all data remains physically located in India unless the actual technical architecture and service-provider arrangements support that statement.
                                </p>
                            </section>

                            {/* Section 10 */}
                            <section id="section-10" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    10. DATA SECURITY
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We seek to protect personal data using reasonable technical and organisational safeguards appropriate to the nature of the information and the risks involved.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Depending on the system, safeguards may include access controls, authentication, encryption, monitoring, backups, security reviews and restrictions on employee or provider access.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    No internet transmission or electronic storage system can be guaranteed completely secure. Users should protect their credentials and promptly report suspected account compromise.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Where a personal-data breach occurs, GradEnvy will assess and respond to it in accordance with applicable legal requirements, including any required notices or reporting.
                                </p>
                            </section>

                            {/* Section 11 */}
                            <section id="section-11" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    11. DATA RETENTION AND DELETION
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We retain personal data only for as long as reasonably necessary for the purposes described in this policy, subject to applicable legal obligations, dispute resolution, security needs and legitimate recordkeeping requirements.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Retention periods may differ for account details, payment records, applications, consent records, security logs and support communications.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Users may request account deletion through available account controls or by contacting support. We will assess and process such requests in accordance with applicable law. Account deletion may not immediately erase every record where retention is legally required or necessary for a permitted purpose. Where appropriate, information will be deleted, anonymised or securely retained with restricted access.
                                </p>
                            </section>

                            {/* Section 12 */}
                            <section id="section-12" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    12. USER RIGHTS AND PRIVACY REQUESTS
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm">Subject to applicable law and verification of identity, users may request:</p>
                                <ul className="space-y-1.5 pl-5 text-xs sm:text-sm text-slate-600 list-disc">
                                    <li>Access to relevant information about their personal data and its processing.</li>
                                    <li>Correction or updating of inaccurate or incomplete information.</li>
                                    <li>Deletion of personal data where applicable.</li>
                                    <li>Withdrawal of consent where processing relies on consent.</li>
                                    <li>Information about applicable grievance or complaint procedures.</li>
                                    <li>Other rights available under the law applicable at the time of the request.</li>
                                </ul>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Requests may be submitted to <a href="mailto:support@gradenvy.com" className="text-[#0070F3] font-medium hover:underline">support@gradenvy.com</a>. We may request additional information reasonably necessary to verify the requester and protect against unauthorised disclosure. Requests will be handled within applicable legal timelines.
                                </p>
                            </section>

                            {/* Section 13 */}
                            <section id="section-13" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    13. COOKIES AND SIMILAR TECHNOLOGIES
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    The website and related services may use cookies, SDKs, local storage or similar technologies for authentication, security, user preferences, performance monitoring and other disclosed purposes.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Where required, we will provide appropriate notices and obtain consent for non-essential technologies. Users may also be able to manage certain settings through their browser or device, although disabling essential technologies may affect functionality. The actual technologies used will depend on the platform's configuration.
                                </p>
                            </section>

                            {/* Section 14 */}
                            <section id="section-14" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    14. COMMUNICATIONS AND MARKETING
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We may send necessary service communications about account activity, payments, security, policy changes, applications or events.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Promotional communications will be sent in accordance with applicable law and the relevant preferences or consent requirements. Where an opt-out is available, users may use it to stop optional promotional messages. Opting out of promotional communications will not necessarily stop essential service or security notices.
                                </p>
                            </section>

                            {/* Section 15 */}
                            <section id="section-15" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    15. THIRD-PARTY LINKS AND SERVICES
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    The platform may link to third-party websites, services, event pages or external applications. These services may have separate privacy practices and terms.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Users should review the applicable third-party notices before sharing information. This section does not exclude any responsibility GradEnvy has under applicable law for its own conduct or disclosures.
                                </p>
                            </section>

                            {/* Section 16 */}
                            <section id="section-16" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    16. CHANGES TO THIS PRIVACY POLICY
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    We may update this policy to reflect changes in our platform, service providers, data practices or legal requirements.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    The latest version will be published on the relevant platform with its effective date. Where required, we will notify users and obtain additional consent before implementing material changes.
                                </p>
                            </section>

                            {/* Section 17 */}
                            <section id="section-17" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    17. GRIEVANCES AND CONTACT
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    For privacy questions, data requests, complaints or concerns, contact:
                                </p>
                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 space-y-1.5">
                                    <p><strong className="text-slate-900">Email:</strong> <a href="mailto:support@gradenvy.com" className="text-[#0070F3] hover:underline">support@gradenvy.com</a></p>
                                    <p><strong className="text-slate-900">Phone:</strong> <a href="tel:9080408749" className="text-[#0070F3] hover:underline">9080408749</a></p>
                                    <p><strong className="text-slate-900">Correspondence Address:</strong> 1st Floor, NV Arcade Building, Near 5 Road, Salem, Tamil Nadu – 636004, India.</p>
                                </div>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Any legally required grievance officer or designated privacy contact will be identified through the platform once formally appointed.
                                </p>
                            </section>

                            {/* Section 18 */}
                            <section id="section-18" className="scroll-mt-28 space-y-3.5">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    18. APPLICABLE LAW
                                </h2>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    This Privacy Policy is governed by the laws of India, including applicable data-protection and information-technology laws and rules, as they come into force.
                                </p>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Nothing in this policy limits rights or remedies that applicable law grants to individuals.
                                </p>
                            </section>
                        </div>
                    </article>
                </div>
            </main>

            {/* ─────────────────────────────────────────────────────────────
          4. FOOTER (DARK GRADIENT - EXACT MATCHING UI)
      ───────────────────────────────────────────────────────────── */}
            <footer className="w-full bg-[#050814] text-white border-t border-white/10 pt-16 pb-12">
                <div className="w-full max-w-[1340px] mx-auto px-6 md:px-[80px] space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Brand Column */}
                        <div className="lg:col-span-6 space-y-5">
                            <div
                                onClick={() => navigate("/")}
                                className="flex items-center gap-2 cursor-pointer group inline-block"
                            >
                                <img
                                    src={assets.landing_logo}
                                    alt="GradEnvy Logo"
                                    className="h-8 lg:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = assets.gradEnvyLogo;
                                    }}
                                />
                            </div>

                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
                                Empowering students and recent graduates with AI-powered career navigation, continuous skill verification, and verified recruitment pipelines.
                            </p>

                            {/* Social Media Links */}
                            <div className="flex items-center gap-3 pt-2">
                                <a
                                    href="https://x.com/GradEnvy"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                                    aria-label="X (formerly Twitter)"
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

                    {/* Bottom Copyright */}
                    <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-400">
                        <p>© 2026 Grad Envy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
