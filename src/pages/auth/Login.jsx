import React, { useState } from 'react';
import { IoCallOutline, IoLockClosedOutline, IoMailOutline } from 'react-icons/io5';
import { assets } from '../../assets/assets';
import { useMain } from '../../context/MainContext';
import AuthBase from '../../layout/AuthBase';
import { loginUser, registerCompanyApi } from '../../services/auth/authServices';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Building2, User, MapPin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

/**
 * Reusable text input field styled for dark glassmorphic auth cards.
 * Uses high-performance translucent background (bg-black/25) to avoid expensive
 * nested GPU backdrop-filter recalculations during scrolling.
 */
const InputField = ({ label, id, type, placeholder, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm text-gray-300 font-light">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
        {Icon && <Icon size={20} />}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-[14px] border border-white/20 bg-black/25 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-colors focus:border-[#0091D5] focus:outline-none"
        {...props}
      />
    </div>
  </div>
);

/**
 * Reusable password input with toggleable visibility.
 * Optimized with lightweight GPU-friendly styling to maintain silky-smooth 60fps scrolling.
 */
const PasswordField = ({ label, id, placeholder, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm text-gray-300 font-light">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <IoLockClosedOutline size={20} />
        </div>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full rounded-[14px] border border-white/20 bg-black/25 py-3 pl-12 pr-12 text-white placeholder-gray-500 transition-colors focus:border-[#0091D5] focus:outline-none"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const { login, fetchCurrentUser } = useMain();
  const [searchParams] = useSearchParams();
  const loginType = searchParams.get('type'); // "company" | "college" | null

  // Sign In state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Company Registration state (active when company user opts to register)
  const [isRegister, setIsRegister] = useState(false);
  const [regForm, setRegForm] = useState({
    companyName: '',
    contactPersonName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
  });

  const handleRegChange = (field, value) => {
    setRegForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Determine background image based on login entry point.
   * Dynamically renders tailored background for company vs college sign in.
   */
  const getBackgroundImage = () => {
    if (loginType === 'company') return assets.CompanyloginBg;
    if (loginType === 'college') return assets.CollegeloginBg;
    return assets.CompanyloginBg;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanIdentifier = identifier.trim();
      const isEmail = cleanIdentifier.includes('@');

      const res = await login({
        identifier: cleanIdentifier,
        email: isEmail ? cleanIdentifier : undefined,
        phone: !isEmail ? cleanIdentifier : undefined,
        password,
      });

      if (res?.status) {
        let role = res?.data?.user?.role;
        if (role === "admin" || role === "college" || role === "company" || role === "influencer" || role === "") {
          toast.success(res?.message || "Login successfully");
        }
        await fetchCurrentUser();
      } else {
        toast.error(res?.message || "Login Failed");
      }
    } catch (error) {
      toast.error(error.message || "Login Failed");
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanPhone = regForm.phone.trim();
      if (cleanPhone.length !== 10) {
        toast.error("Mobile number must be exactly 10 digits");
        setLoading(false);
        return;
      }
      if (regForm.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const res = await registerCompanyApi({
        companyName: regForm.companyName.trim(),
        contactPersonName: regForm.contactPersonName.trim(),
        email: regForm.email.trim(),
        phone: cleanPhone,
        password: regForm.password,
        city: regForm.city.trim(),
      });

      if (res?.success && res?.token) {
        localStorage.setItem("token", res.token);
        toast.success(res.message || "Company registered successfully!");
        await fetchCurrentUser();
      } else {
        toast.error(res?.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.message || "Registration failed");
      console.error("Company registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBase
      backgroundImage={getBackgroundImage()}
      maxWidth={isRegister ? 'max-w-[500px]' : 'max-w-[450px]'}
      cardClassName={isRegister ? 'max-h-[92vh] flex flex-col !p-6 sm:!p-8' : ''}
    >
      {isRegister && loginType === 'company' ? (
        /* ── COMPANY REGISTRATION FORM ── */
        /* Flex column layout keeps header static at the top while form fields and actions scroll internally */
        <form onSubmit={handleRegister} className="w-full flex flex-col flex-1 min-h-0">
          {/* Fixed Header: Remains visible at all times */}
          <div className="text-center pb-2 shrink-0">
            <img
              src={assets.landing_logo}
              alt="Nulinz Logo"
              className="mx-auto h-12 w-auto mb-1"
            />
            <h1 className="text-[24px] md:text-[26px] font-bold text-white tracking-tight">
              Register Your Company
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              Join GradEnvy to discover candidates and post opportunities
            </p>
          </div>

          {/* Scrollable Form Body: Fields, Register button, and Sign-in link all scroll together */}
          <div
            className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-4 pt-1 pb-2 custom-auth-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.25) transparent',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              transform: 'translateZ(0)',
              willChange: 'scroll-position',
            }}
          >
            <InputField
              label="Company Name"
              id="regCompanyName"
              type="text"
              placeholder="Acme Innovations Pvt Ltd"
              icon={Building2}
              value={regForm.companyName}
              onChange={(e) => handleRegChange('companyName', e.target.value)}
              required
            />

            <InputField
              label="Contact Person Name"
              id="regContactPerson"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={regForm.contactPersonName}
              onChange={(e) => handleRegChange('contactPersonName', e.target.value)}
              required
            />

            <InputField
              label="Official Email Address"
              id="regEmail"
              type="email"
              placeholder="hr@company.com"
              icon={IoMailOutline}
              value={regForm.email}
              onChange={(e) => handleRegChange('email', e.target.value)}
              required
            />

            <InputField
              label="Mobile Number (10 digits)"
              id="regPhone"
              type="tel"
              maxLength={10}
              placeholder="9876543210"
              icon={IoCallOutline}
              value={regForm.phone}
              onChange={(e) => handleRegChange('phone', e.target.value.replace(/\D/g, ''))}
              required
            />

            <PasswordField
              label="Password"
              id="regPassword"
              placeholder="Create a secure password"
              value={regForm.password}
              onChange={(e) => handleRegChange('password', e.target.value)}
              required
            />

            <InputField
              label="City / Location"
              id="regCity"
              type="text"
              placeholder="Coimbatore, Tamil Nadu"
              icon={MapPin}
              value={regForm.city}
              onChange={(e) => handleRegChange('city', e.target.value)}
            />

            {/* Scrollable Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center rounded-[15px] bg-[#171717] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-black active:scale-[0.99] cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register Company"}
              </button>

              <div className="pt-1 text-center border-t border-white/10">
                <p className="text-[13px] sm:text-[14px] text-gray-300">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="font-semibold text-white underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* ── STANDARD LOGIN FORM ── */
        <form onSubmit={handleLogin} className="w-full space-y-8">
          <div className="text-center">
            <img
              src={assets.landing_logo}
              alt="Nulinz Logo"
              className="mx-auto h-14 w-auto mb-1"
            />
            <h1 className="text-[28px] font-bold text-white tracking-tight">
              {loginType === 'company'
                ? 'Company Login'
                : loginType === 'college'
                ? 'College Login'
                : 'Login'}
            </h1>
          </div>

          <div className="space-y-5">
            <InputField
              label="Enter your Email or Mobile Number"
              id="identifier"
              type="text"
              placeholder="Enter Email or Mobile Number"
              icon={identifier.includes('@') ? IoMailOutline : IoCallOutline}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <PasswordField
              label="Enter your Password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-[15px] bg-[#171717] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#171717] hover:shadow-[#171717]/20 active:scale-[0.99] cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </button>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-gray-400">Did you forget your password?</span>
              <Link to="/auth/forgot-password" className="font-semibold text-white underline underline-offset-4 hover:text-white transition-colors">
                Forgot Password
              </Link>
            </div>

            {loginType === 'company' && (
              <div className="pt-2 text-center border-t border-white/10">
                <p className="text-[14px] text-gray-300">
                  Don't have a company account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="font-semibold text-white underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Register your Company
                  </button>
                </p>
              </div>
            )}
          </div>
        </form>
      )}
    </AuthBase>
  );
};

export default Login;
