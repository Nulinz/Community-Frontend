import React, { useState } from 'react';
import { IoCallOutline } from 'react-icons/io5';
import { assets } from '../../assets/assets';

const ForgotPassword = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp.join(''));
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-black px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${assets.login_bg})` }}
    >
      {/* Glassmorphism Card */}
      <form
        onSubmit={handleVerify}
        className="w-full max-w-[450px] space-y-8 rounded-[30px] bg-black/8 p-10 shadow-2xl backdrop-blur-[68px] border border-white/10"
      >
        <div className="text-center">
          <img
            src={assets.logo} 
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">Forgot Password</h1>
        </div>

        <div className="space-y-6">
          {/* Mobile Input Section */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-light">Enter your Mobile Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                <IoCallOutline size={20} />
              </div>
              <input
                type="tel"
                placeholder="8438298692"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full rounded-[14px] border border-white/20 bg-black/10 py-3.5 pl-12 pr-28 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
              />
              <button 
                type="button"
                className="absolute right-1 rounded-[12px] bg-[#0091D5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007fb8] transition-colors"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP Section with * Placeholder */}
          <div className="space-y-4 text-center">
            <label className="block text-left text-sm text-gray-300 font-light">Enter your Credentials</label>
            <div className="flex justify-between gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  placeholder="*"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  className="h-16 w-16 rounded-[18px] border border-white/20 bg-black/10 text-center text-xl text-white placeholder-gray-400 focus:border-[#0091D5] focus:outline-none backdrop-blur-md transition-all"
                />
              ))}
            </div>
            
            <div className="pt-2">
              <p className="text-[13px] text-gray-400">Did'nt receive the code ?</p>
              <button type="button" className="text-[15px] font-medium text-white hover:text-[#0091D5] transition-colors">
                Resent OTP
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            className="w-full rounded-[15px] bg-[#0091D5] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#007fb8] active:scale-[0.98]"
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;