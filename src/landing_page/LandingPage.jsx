import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  ArrowUpRight,
  ArrowRight,
  Briefcase,
  Calendar,
  Award,
  ShieldCheck,
  ChevronRight,
  Cpu,
  TrendingUp,
  UserCheck,
  Globe,
  Star,
  Settings,
  Terminal,
  Target,
  Trophy,
  Users,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intersection observer state for smooth entrance transitions
  const careerOsRef = useRef(null);
  const [isCareerOsVisible, setIsCareerOsVisible] = useState(false);

  const ecosystemRef = useRef(null);
  const [isEcosystemVisible, setIsEcosystemVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === careerOsRef.current) {
              setIsCareerOsVisible(true);
            }
            if (entry.target === ecosystemRef.current) {
              setIsEcosystemVisible(true);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    if (careerOsRef.current) observer.observe(careerOsRef.current);
    if (ecosystemRef.current) observer.observe(ecosystemRef.current);

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#03040A] text-white font-outfit selection:bg-blue-600 selection:text-white">
      {/* ── Top Navigation Bar (Solid black header) ── */}
      <header className="sticky top-0 z-50 w-full bg-[#000000] px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={assets.landing_logo}
            alt="GradEnvy Logo"
            className="h-8 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = assets.gradEnvyLogo;
            }}
          />
        </div>

        {/* Center Navigation Links (4 items matching screenshot) */}
        <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium">
          {[
            { id: "why-choose", label: "Why Choose" },
            { id: "ai-station", label: "AI station" },
            { id: "career-os", label: "Career OS" },
            { id: "how-it-works", label: "How it Works" },
          ].map((item) => {
            const isActive = activeTab === item.id || (!activeTab && item.id === "why-choose");
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative py-1 transition-all ${isActive
                  ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: White pill button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/auth/login")}
            className="px-6 py-2 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-100 shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Sign in
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white p-1 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden sticky top-[64px] z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {[
            { id: "why-choose", label: "Why Choose" },
            { id: "ai-station", label: "AI station" },
            { id: "career-os", label: "Career OS" },
            { id: "how-it-works", label: "How it Works" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-base font-medium text-gray-200 hover:text-white border-b border-white/5"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION WITH EXACT IMAGE PLACEMENT & TEXT OVERLAY
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-[#0A0C10]">
        {/* Full Hero Image Rendered in natural aspect ratio */}
        <div className="w-full relative">
          <img
            src={assets.landing_bg}
            alt="Grad Envy Connected Ecosystem"
            className="w-full h-auto min-h-[560px] sm:min-h-[660px] md:min-h-0 object-cover md:object-contain object-bottom block select-none pointer-events-none"
          />

          {/* Soft Mobile Overlay for text readability on small viewports */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#03040A]/90 via-[#03040A]/50 to-transparent md:hidden pointer-events-none z-10" />

          {/* ── Exact Text Placement Overlay matching screenshot ── */}
          <div className="absolute inset-0 z-20 w-full px-6 sm:px-10 md:px-12 lg:px-20 pt-6 sm:pt-8 md:pt-10 lg:pt-14 xl:pt-16 pointer-events-auto">
            <div className="max-w-4xl space-y-3 sm:space-y-4 md:space-y-5 text-left">
              <h1
                style={{ lineHeight: 1.0 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-bold text-white tracking-tight drop-shadow-sm"
              >
                Every skill. Every connection. Every opportunity.
              </h1>

              {/* Paragraph Sub-text */}
              <p className="text-gray-200 md:text-[#2D313A] text-xs sm:text-sm md:text-[15px] lg:text-[16px] leading-[1.55] font-medium max-w-xl lg:max-w-2xl">
                Grad Envy brings freelancing, recruitment, events, and career intelligence into one platform — so every project you ship and every person you meet builds toward a single, growing professional identity.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1.5 sm:pt-2 md:pt-3">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-[#2A2B31] hover:bg-[#1E1F24] text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Get Started <ArrowUpRight size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-white text-[#111111] hover:bg-gray-100 shadow-lg border border-gray-200/40 transition-all hover:scale-105 active:scale-95"
                >
                  Signin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION: WHY GRAD ENVY (Exact Screenshot UI Design)
      ───────────────────────────────────────────────────────────── */}
      <section id="why-choose" className="relative z-10 py-24 bg-[#010102] px-6 md:px-[80px] border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto space-y-16">
          {/* Top 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text & Headline */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Star Badge */}
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-transparent text-[#00A3FF] border border-[#00A3FF]/40 inline-flex items-center gap-1.5">
                  <Star size={12} className="fill-[#00A3FF] stroke-none" /> WHY GRADENVY
                </span>
              </div>

              {/* Main Section Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]">
                The future of <br />
                professional growth <br />
                is connected.
              </h2>

              {/* Paragraph 1 with Bold Highlights */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Today's professional journey isn't defined by a single resume.{" "}
                <span className="text-white font-bold">Skills are built through projects.</span>{" "}
                <span className="text-white font-bold">Experience is earned through freelancing.</span>{" "}
                <span className="text-white font-bold">Connections form through networking.</span>
              </p>

              {/* Paragraph 2 */}
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Growth happens through competitions, events, and internships — yet these experiences stay scattered across platforms that never talk to each other. Grad Envy brings them together into one ecosystem, where every achievement contributes to a professional identity that keeps evolving.
              </p>
            </div>

            {/* Right Column GradEnvy Globe Animated GIF */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <img
                src={assets.GlobeGif}
                alt="GradEnvy Globe Network"
                className="w-full max-w-[460px] h-auto object-contain transition-transform hover:scale-105 duration-500"
              />
            </div>
          </div>

          {/* Bottom Glassmorphic Category Navigation Bar */}
          <div className="w-full bg-[#FFFFFF08]/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 sm:gap-6 shadow-2xl">
            {[
              { icon: Award, label: "Competitions", color: "bg-blue-600" },
              { icon: Cpu, label: "University Engagement", color: "bg-teal-500" },
              { icon: UserCheck, label: "Professional Networking", color: "bg-purple-600" },
              { icon: Briefcase, label: "Freelancing", color: "bg-amber-600" },
              { icon: TrendingUp, label: "Career Development", color: "bg-emerald-500" },
              { icon: Globe, label: "Recruitment", color: "bg-indigo-600" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white shadow-md`}>
                  <item.icon size={14} />
                </div>
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          APP DOWNLOAD SECTION: OUR APPLICATION IS NOW AVAILABLE (#111827)
          Flush at screen left 0 with 480px height
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#111827] border-t border-b border-white/10 overflow-hidden w-full min-h-[480px] lg:h-[480px] flex items-center">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Full-Height Image positioned flush at screen Left 0 */}
          <div className="lg:col-span-6 xl:col-span-6 h-full flex items-center justify-start overflow-hidden">
            <img
              src={assets.phone_mockup}
              alt="GradEnvy Mobile App Mockup"
              className="w-full h-full object-cover object-left select-none"
            />
          </div>

          {/* Right Column: Title, Subtitle and Store Download Buttons */}
          <div className="lg:col-span-6 xl:col-span-6 py-10 lg:py-0 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-24 space-y-6 text-left flex flex-col justify-center max-w-2xl">
            <h2 className="text-2xl sm:text-[32px] md:text-[36px] lg:text-[38px] xl:text-[42px] font-semibold text-white tracking-tight whitespace-nowrap">
              Our Application is Now Available
            </h2>

            <p className="font-outfit font-normal text-[16px] leading-[150%] tracking-normal text-gray-300 max-w-lg">
              Download Grad Envy on the Play Store and App Store to keep your professional identity with you wherever you go.
            </p>

            {/* Store Badges Row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Google Play Store Badge */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-[#1E293B]/90 hover:bg-[#1E293B] border border-white/15 px-5 py-3 rounded-[12px] flex items-center gap-3.5 transition-all duration-300 hover:scale-105 shadow-xl group cursor-pointer"
              >
                <img
                  src={assets.playstore_img}
                  alt="Google Play"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                />
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1">
                    GET IT ON
                  </span>
                  <span className="block text-base sm:text-[17px] font-bold text-white">
                    Google Play
                  </span>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="bg-[#1E293B]/90 hover:bg-[#1E293B] border border-white/15 px-5 py-3 rounded-[12px] flex items-center gap-3.5 transition-all duration-300 hover:scale-105 shadow-xl group cursor-pointer"
              >
                <img
                  src={assets.appstore_img}
                  alt="App Store"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
                />
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-gray-400 font-semibold tracking-wider uppercase mb-1">
                    DOWNLOAD ON THE
                  </span>
                  <span className="block text-base sm:text-[17px] font-bold text-white">
                    App Store
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION: OUR ECOSYSTEM (Three pillars. One profile.)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="ecosystem"
        ref={ecosystemRef}
        className="relative z-10 py-24 bg-[#FAFAFD] text-slate-900 px-6 md:px-[80px] overflow-hidden"
      >
        {/* Subtle 3-Color Ambient Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_50%,rgba(124,58,237,0.16),transparent_50%),radial-gradient(ellipse_at_50%_55%,rgba(16,185,129,0.14),transparent_50%),radial-gradient(ellipse_at_82%_50%,rgba(245,158,11,0.16),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1340px] mx-auto space-y-12">
          {/* Header */}
          <div className="text-left space-y-3 max-w-2xl">
            <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
              OUR ECOSYSTEM
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#090D16] tracking-tight leading-tight">
              Three pillars. One profile.
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Freelancing, companies, and events feed the same professional identity — nothing you build here stays siloed.
            </p>
          </div>

          {/* 3 Pillar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Freelancing */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-white/90 hover:bg-[#F8F9FF] backdrop-blur-xl border border-slate-200/80 hover:border-indigo-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(79,70,229,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Glass Specular Glare */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="text-center">
                  <span className="text-slate-700 group-hover:text-indigo-600 font-bold text-sm sm:text-base tracking-wide transition-colors">
                    Freelancing
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Freelancing — the foundation of Grad Envy
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Turn your skills into real-world experience. Connect with companies, startups, and organizations, and build a portfolio backed by verified work and client reviews.
                </p>

                {/* Tag Pills with Staggered Scroll-In & Hover States */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "FREELANCE OPPORTUNITIES",
                    "PORTFOLIO",
                    "VERIFIED SKILLS",
                    "COLLABORATION",
                    "TEAM FORMATION",
                    "CLIENT REVIEWS",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        transitionDelay: `${idx * 45}ms`,
                      }}
                      className={`border border-transparent bg-[#F3F4F6] text-[#4B5563] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200/80 hover:scale-105 px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase transition-all duration-500 ease-out cursor-default transform ${isEcosystemVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Indigo Bottom-Bar that fills left-to-right on hover */}
              <div className="relative z-10 h-1 bg-slate-200/70 rounded-full w-full mt-8 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </div>

            {/* Card 2: Companies */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-white/90 hover:bg-[#F8F9FF] backdrop-blur-xl border border-slate-200/80 hover:border-indigo-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(79,70,229,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Glass Specular Glare */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="text-center">
                  <span className="text-slate-700 group-hover:text-indigo-600 font-bold text-sm sm:text-base tracking-wide transition-colors">
                    Companies
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Discover talent beyond resumes
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Publish freelance projects, internships, and roles. Strengthen your employer brand and hire with confidence.
                </p>

                {/* Tag Pills with Staggered Scroll-In & Hover States */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "COMPANY PROFILE",
                    "TALENT DISCOVERY",
                    "RECRUITMENT",
                    "EMPLOYER BRANDING",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        transitionDelay: `${idx * 45}ms`,
                      }}
                      className={`border border-transparent bg-[#F3F4F6] text-[#4B5563] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200/80 hover:scale-105 px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase transition-all duration-500 ease-out cursor-default transform ${isEcosystemVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Indigo Bottom-Bar that fills left-to-right on hover */}
              <div className="relative z-10 h-1 bg-slate-200/70 rounded-full w-full mt-8 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </div>

            {/* Card 3: Events */}
            <div className="group relative overflow-hidden rounded-2xl p-8 bg-white/90 hover:bg-[#F8F9FF] backdrop-blur-xl border border-slate-200/80 hover:border-indigo-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(79,70,229,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              {/* Glass Specular Glare */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent rounded-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="text-center">
                  <span className="text-slate-700 group-hover:text-indigo-600 font-bold text-sm sm:text-base tracking-wide transition-colors">
                    Events
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#090D16] leading-snug">
                  Every event creates new opportunity
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Discover workshops, hackathons, conferences, and career fairs that become milestones on your profile.
                </p>

                {/* Tag Pills with Staggered Scroll-In & Hover States */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {[
                    "WORKSHOPS",
                    "HACKATHONS",
                    "CAREER FAIRS",
                    "NETWORKING",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        transitionDelay: `${idx * 45}ms`,
                      }}
                      className={`border border-transparent bg-[#F3F4F6] text-[#4B5563] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200/80 hover:scale-105 px-3 py-1.5 rounded-md text-[10px] font-outfit font-semibold tracking-wider uppercase transition-all duration-500 ease-out cursor-default transform ${isEcosystemVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Indigo Bottom-Bar that fills left-to-right on hover */}
              <div className="relative z-10 h-1 bg-slate-200/70 rounded-full w-full mt-8 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION: CAREER TRAJECTORY (One project can change your whole trajectory.)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="career-os"
        ref={careerOsRef}
        className="relative z-10 w-full mx-auto min-h-[491px] opacity-100 pt-[50px] pb-[50px] px-6 md:px-[80px] bg-[#080c1d] border-t border-b border-white/10 flex flex-col justify-between overflow-hidden"
      >
        <div className="w-full space-y-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-semibold text-white tracking-tight leading-tight">
              One project can <br />
              change your whole trajectory.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              From discovery to growth, our ecosystem connects every step so you can focus on building what matters.
            </p>
          </div>

          {/* 5 Step Process Cards Row (Left-to-Right Animated Transition) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3 items-stretch relative">
            {[
              {
                step: "01",
                title: "DISCOVER",
                desc: "Find an AI tool that helps you build a project.",
                textColor: "text-emerald-400",
                bgColor: "bg-emerald-400",
              },
              {
                step: "02",
                title: "SHOWCASE",
                desc: "Add the project to your professional portfolio.",
                textColor: "text-cyan-400",
                bgColor: "bg-cyan-400",
              },
              {
                step: "03",
                title: "COLLABORATE",
                desc: "A company invites you onto a freelance project.",
                textColor: "text-purple-400",
                bgColor: "bg-purple-400",
              },
              {
                step: "04",
                title: "COMPETE",
                desc: "You join a hackathon and expand your network.",
                textColor: "text-blue-400",
                bgColor: "bg-blue-400",
              },
              {
                step: "05",
                title: "GROW",
                desc: "Those wins open internships and long-term roles.",
                textColor: "text-emerald-400",
                bgColor: "bg-emerald-400",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  transitionDelay: `${idx * 140}ms`,
                }}
                className={`relative bg-[#0F172A] p-6 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[190px] shadow-xl group hover:border-white/20 transition-all duration-700 ease-out transform ${isCareerOsVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
                  }`}
              >
                <div>
                  {/* Top Step Number & Indicator Line */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-outfit text-xs font-bold ${card.textColor}`}>
                      {card.step}
                    </span>
                  </div>
                  <div className={`w-5 h-[2px] ${card.bgColor} rounded-full mb-3`} />

                  {/* Card Title */}
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-gray-400 text-xs leading-relaxed opacity-90">
                    {card.desc}
                  </p>
                </div>

                {/* Connector Arrow for Cards 1 to 4 */}
                {idx < 4 && (
                  <div
                    style={{
                      transitionDelay: `${idx * 140 + 200}ms`,
                    }}
                    className={`hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#13192e] border border-white/10 items-center justify-center z-20 shadow-md transition-all duration-500 transform ${isCareerOsVisible
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50"
                      }`}
                  >
                    <ArrowRight size={14} className={card.textColor} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION: EVERYTHING IS CONNECTED (Comprehensive Ecosystem Grid)
      ───────────────────────────────────────────────────────────── */}
      <section id="ai-station" className="relative z-10 py-24 bg-[#FAFAFD] text-slate-900 px-6 md:px-[80px]">
        <div className="w-full max-w-[1340px] mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#090D16] tracking-tight leading-tight">
              Everything is connected
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto opacity-90">
              Discover AI tools, showcase real projects, collaborate on freelance work, and compete in hackathons — all building toward a single verified profile that unlocks internships and career opportunities. Not separate platforms, just one connected ecosystem.
            </p>
          </div>

          {/* 6 Feature Cards Grid (2 columns x 3 rows) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-left">
            {/* Card 1: AI Station */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Settings size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  AI STATION
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#090D16] tracking-tight">
                  Learn faster. Build smarter.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Discover, learn, and leverage curated AI tools, platforms, and prompt libraries across your professional journey. From software development to workflow automation, AI Station empowers you to work smarter.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "AI Tool Directory",
                    "AI Agent Platforms",
                    "Prompt Hub",
                    "AI Learning Resources",
                    "AI News & Updates",
                    "AI Research Tools",
                    "AI Recommendations",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Prompt Hub */}
            {/* <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Terminal size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  PROMPT HUB
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#090D16] tracking-tight">
                  Better prompts. Better results.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Prompt Hub helps users unlock the full potential of modern AI platforms through professionally crafted prompts for a wide range of real-world use cases. Instead of searching across multiple sources, users can explore ready-to-use prompts, organize collections, save favorites, and generate optimized prompts tailored for different AI models.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Writing",
                    "Programming",
                    "Research",
                    "Image Generation",
                    "Video Generation",
                    "Daily Challenges",
                    "Resume Building",
                    "Presentations",
                    "Marketing",
                    "Business",
                    "Education",
                    "Design",
                    "Productivity",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Card 3: Career OS */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Target size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  CAREER OS
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#090D16] tracking-tight">
                  Your career. Connected.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Bring every project, certification, hackathon, and freelance milestone into a single, evolving professional profile. Career OS helps you track skill growth and unlock high-impact career opportunities.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Career Wallet",
                    // "Career Roadmap",
                    "Career Goals",
                    "Career Score",
                    // "Career Analytics",
                    "Resume Builder",
                    "Interview Preparation",
                    // "Achievement Timeline",
                    "Skills Dashboard",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>


            {/* Card 5: Professional Networking */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Users size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  PROFESSIONAL NETWORKING
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#090D16] tracking-tight">
                  Build meaningful professional connections.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Build meaningful relationships beyond traditional connection requests. Connect with peers, mentors, recruiters, and startups in an active ecosystem designed for genuine collaboration and career milestones.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Student Profiles",
                    "Company Profiles",
                    "Professional Connections",
                    "Communities",
                    "Mentorship",
                    "Industry Networking",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6: University Platform */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <GraduationCap size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  UNIVERSITY PLATFORM
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#090D16] tracking-tight">
                  Empowering universities through digital engagement.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Help educational institutions simplify campus event management, student attendance, and digital credentialing. Gain actionable analytics on student engagement while streamlining department operations.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Event Management",
                    "Student Registration",
                    "Attendance Tracking",
                    "QR Check-in",
                    "Certificate Generation",
                    // "Department Dashboard",
                    // "Reports & Analytics",
                    "Budget Tracking",
                    "Student Participation Analytics",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Card 4: Envy League */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                  <Trophy size={20} />
                </div>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block">
                  ENVY LEAGUE
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#090D16] tracking-tight">
                  Compete. Improve. Get recognized.
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  Step into Grad Envy's competitive arena to tackle real-world technical, creative, and business challenges. Climb dynamic leaderboards, showcase verified achievements, and earn industry-wide recognition.
                </p>
                <span className="text-[#2563EB] text-[11px] font-outfit font-bold tracking-widest uppercase block pt-2">
                  HIGHLIGHTS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    // "Coding Challenges",
                    "Design Competitions",
                    "Innovation Challenges",
                    "Research Competitions",
                    // "Business Case Competitions",
                    "Daily Challenges",
                    "Weekly Championships",
                    // "Leaderboards",
                    // "Hall of Fame",
                    "XP & Badges",
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F3F4F6] text-[#4B5563] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION: HOW GRAD ENVY WORKS (Exact Screenshot UI)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 py-20 lg:py-28 bg-[#FAFAFD] text-slate-900 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-slate-200/60">
        <div className="w-full max-w-[1240px] mx-auto space-y-12 sm:space-y-14">
          {/* Centered Top Header */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <span className="text-[#6366F1] text-[12px] font-outfit font-bold tracking-[0.2em] uppercase block">
              HOW GRAD ENVY WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-[#090D16] tracking-tight leading-tight">
              One platform. One connected <span className="text-[#0095FF]">journey</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Five steps take you from a blank profile to a professional identity backed by real, verifiable work.
            </p>
          </div>

          {/* 5 Cards Grid (2 in Row 1, 2 in Row 2, 1 Full-Width in Row 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Sign up as a Freelancer, Company, University, or Event Organizer and build a profile that represents your skills and expertise.",
                color: "bg-[#7C3AED]",
                span: "col-span-1",
              },
              {
                step: "02",
                title: "Build your professional identity",
                desc: "Create your portfolio, showcase projects, earn certifications, and track your progress through Career OS.",
                color: "bg-[#2563EB]",
                span: "col-span-1",
              },
              {
                step: "03",
                title: "Discover opportunities",
                desc: "Explore freelance projects, internships, competitions, AI resources, and industry events that align with your goals.",
                color: "bg-[#10B981]",
                span: "col-span-1",
              },
              {
                step: "04",
                title: "Connect & collaborate",
                desc: "Work with companies, join communities, and gain real-world experience through meaningful collaboration.",
                color: "bg-[#F97316]",
                span: "col-span-1",
              },
              {
                step: "05",
                title: "Grow your career",
                desc: "Every project, competition, event, and connection strengthens your profile - unlocking bigger opportunities over time.",
                color: "bg-[#E11D48]",
                span: "col-span-1 md:col-span-2",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`${card.span} relative bg-white rounded-2xl p-6 sm:p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden flex items-start sm:items-center gap-4 sm:gap-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300`}
              >
                {/* Left Colored Accent Stripe */}
                <div className={`w-1.5 ${card.color} absolute left-0 top-0 bottom-0`} />

                {/* Circular Step Badge */}
                <div className={`w-10 h-10 rounded-full ${card.color} text-white font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {card.step}
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION: EXPLORE THE PLATFORM (Experience Grad Envy in Action.)
      ───────────────────────────────────────────────────────────── */}
      {/* <section id="explore-platform" className="relative z-10 py-24 bg-[#050716] px-6 md:px-[80px] border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto space-y-12"> */}
      {/* Header */}
      {/* <div className="text-left space-y-3 max-w-3xl">
            <span className="text-[#0095FF] text-[11px] font-outfit font-bold tracking-widest uppercase block">
              EXPLORE THE PLATFORM
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Experience Grad Envy in Action.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Explore a modern platform designed to simplify freelancing, professional networking, recruitment, career development, and university engagement through one connected ecosystem.
            </p>
          </div> */}

      {/* 3-Column Grid Table */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 rounded-2xl overflow-hidden bg-[#070a1e]/60 shadow-2xl">
            {[
              "Home Dashboard",
              "Envy Marketplace",
              "Professional Profile",
              "Portfolio",
              "Resume Builder",
              "AI Station",
              "Prompt Hub",
              "Career OS",
              "Company Dashboard",
              "University Dashboard",
              "Event Dashboard",
              "Freelance Marketplace",
              "Project Details",
              "Job & Internship Portal",
              "Competition Hub",
              "Professional Networking",
              "Mobile Application",
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/auth/login")}
                className="px-6 py-4 sm:py-5 border-r border-b border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/[0.04] transition-all"
              >
                <span className="text-white font-semibold text-xs sm:text-sm group-hover:text-[#0095FF] transition-colors">
                  {item}
                </span>
                <ChevronRight
                  size={14}
                  className="text-gray-500 group-hover:text-[#0095FF] group-hover:translate-x-1 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION: CONNECTED CAREER JOURNEY
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 bg-[#FAFAFD] pt-24 pb-56 px-6 md:px-[80px]">
        <div className="w-full max-w-[1340px] mx-auto">
          {/* Header */}
          <div className="text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full text-[11px] font-outfit font-bold tracking-widest uppercase bg-white border border-slate-300 text-slate-800 shadow-sm">
                CONNECTED CAREER JOURNEY
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#090D16] tracking-tight leading-tight">
              Every experience builds your future
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
              A professional journey isn't defined by one achievement — it's built through continuous learning, collaboration, and experience. A user might begin in <span className="text-[#2563EB] font-bold">AI Station</span>, apply what they learn in a hackathon, then collaborate on a freelance project through <span className="text-[#10B981] font-bold">Envy</span>. As their portfolio grows, companies take notice — leading to internships, recruitment, and long-term career growth, all tracked in one continuously evolving identity.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. COMPREHENSIVE FOOTER WITH OVERLAPPING 50/50 CTA CARD
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 bg-[#050B1E] pb-16 px-6 md:px-[80px] text-white border-t border-white/10">
        <div className="w-full max-w-[1340px] mx-auto">
          {/* Floating Dark Carbon CTA Card centered 50/50 over section border */}
          <div className="relative z-30 -mt-44 sm:-mt-48 mb-20 max-w-full mx-auto rounded-[32px] p-10 sm:p-14 text-center bg-[#070913] border border-white/10 shadow-2xl overflow-hidden">
            {/* Subtle background glow dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <span className="text-slate-400 text-[10px] font-outfit font-bold tracking-widest uppercase block">
                READY TO SHAPE WHAT'S NEXT
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.15]">
                Build skills. Create opportunities. <br />
                Shape your future.
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-1">
                Whether you're building your identity, discovering freelance work, or recruiting future-ready talent - Grad Envy brings it together in one intelligent ecosystem.
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-7 py-3 rounded-full text-sm font-semibold bg-[#2563EB] hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                >
                  Get Started <ArrowUpRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-7 py-3 rounded-full text-sm font-semibold bg-[#262A37] hover:bg-[#313646] text-white border border-white/10 transition-all hover:scale-105 active:scale-95"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Footer Navigation Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            {/* Brand Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <img src={assets.landing_logo} alt="GradEnvy" className="h-12 w-auto object-contain" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                A connected professional ecosystem where freelancing, career development, networking, recruitment, AI-powered learning, and events come together to build future-ready professionals.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    "AI Station",
                    "Prompt Hub",
                    "Career OS",
                    "Envy Marketplace",
                    "Envy League",
                    "University Platform",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate("/auth/login")} className="hover:text-white transition-colors">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    "About Grad Envy",
                    "Vision",
                    "Mission",
                    "Contact Us",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate("/auth/login")} className="hover:text-white transition-colors">
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
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {[
                    { label: "Help Center", path: "/auth/login" },
                    { label: "Privacy Policy", path: "/privacy-policy" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => navigate(item.path)} className="hover:text-[#0095FF] transition-colors">
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
