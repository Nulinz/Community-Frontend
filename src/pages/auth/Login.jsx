import React, { useState } from 'react';
import { IoCallOutline, IoLockClosedOutline } from 'react-icons/io5'; // Using Ionicons
import { assets } from '../../assets/assets';
import { useMain } from '../../context/MainContext';

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
        className="w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
        {...props}
      />
    </div>
  </div>
);



const Login = () => {
  const { login, authLoading, authError } = useMain();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        phone: mobileNumber.trim(),
        password,
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };



  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-black px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${assets.login_bg})` }} // Static BG from public folder
    >
      {/* Glassmorphism Card */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[450px] space-y-8 rounded-[30px] bg-black/8 p-10 shadow-2xl backdrop-blur-[68px] border border-white/10"
      >
        <div className="text-center">
          {/* Static Logo from public folder */}
          <img
            src={assets.logo} 
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">Login</h1>
        </div>

        <div className="space-y-5">
          <InputField
            label="Enter your Mobile Number"
            id="mobileNumber"
            type="tel"
            placeholder="8438298692"
            icon={IoCallOutline}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />

          <InputField
            label="Enter your Password"
            id="password"
            type="password"
            placeholder="********"
            icon={IoLockClosedOutline}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-[15px] bg-[#0091D5] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#007fb8] hover:shadow-[#0091D5]/20 active:scale-[0.99]"
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>

          {authError && (
            <p className="text-sm text-red-400">{authError}</p>
          )}

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-400">Did you forget your password?</span>
            <a href="#" className="font-semibold text-white underline underline-offset-4 hover:text-[#0091D5] transition-colors">
              Forgot Password
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
