// import React, { useState } from 'react';
// import { IoCallOutline } from 'react-icons/io5';
// import { assets } from '../../assets/assets';

// const ForgotPassword = () => {
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '']);

//   const handleOtpChange = (element, index) => {
//     if (isNaN(element.value)) return false;
//     const newOtp = [...otp];
//     newOtp[index] = element.value;
//     setOtp(newOtp);

//     // Focus next input if value is entered
//     if (element.value !== "" && element.nextSibling) {
//       element.nextSibling.focus();
//     }
//   };

//   const handleVerify = (e) => {
//     e.preventDefault();
//     console.log("Verifying OTP:", otp.join(''));
//   };

//   return (
//     <div 
//       className="flex min-h-screen items-center justify-center bg-black px-4 bg-cover bg-center bg-no-repeat"
//       style={{ backgroundImage: `url(${assets.login_bg})` }}
//     >
//       {/* Glassmorphism Card */}
//       <form
//         onSubmit={handleVerify}
//         className="w-full max-w-[450px] space-y-8 rounded-[30px] bg-black/8 p-10 shadow-2xl backdrop-blur-[68px] border border-white/10"
//       >
//         <div className="text-center">
//           <img
//             src={assets.logo} 
//             alt="Nulinz Logo"
//             className="mx-auto h-14 w-auto mb-1"
//           />
//           <h1 className="text-[28px] font-bold text-white tracking-tight">Forgot Password</h1>
//         </div>

//         <div className="space-y-6">
//           {/* Mobile Input Section */}
//           <div className="space-y-2">
//             <label className="text-sm text-gray-300 font-light">Enter your Mobile Number</label>
//             <div className="relative flex items-center">
//               <div className="absolute left-4 text-gray-400">
//                 <IoCallOutline size={20} />
//               </div>
//               <input
//                 type="tel"
//                 placeholder="8438298692"
//                 value={mobileNumber}
//                 onChange={(e) => setMobileNumber(e.target.value)}
//                 className="w-full rounded-[14px] border border-white/20 bg-black/10 py-3.5 pl-12 pr-28 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
//               />
//               <button 
//                 type="button"
//                 className="absolute right-1 rounded-[12px] bg-[#0091D5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#007fb8] transition-colors"
//               >
//                 Send OTP
//               </button>
//             </div>
//           </div>

//           {/* OTP Section with * Placeholder */}
//           <div className="space-y-4 text-center">
//             <label className="block text-left text-sm text-gray-300 font-light">Enter your Credentials</label>
//             <div className="flex justify-between gap-3">
//               {otp.map((data, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength="1"
//                   placeholder="*"
//                   value={data}
//                   onChange={(e) => handleOtpChange(e.target, index)}
//                   className="h-16 w-16 rounded-[18px] border border-white/20 bg-black/10 text-center text-xl text-white placeholder-gray-400 focus:border-[#0091D5] focus:outline-none backdrop-blur-md transition-all"
//                 />
//               ))}
//             </div>
            
//             <div className="pt-2">
//               <p className="text-[13px] text-gray-400">Did'nt receive the code ?</p>
//               <button type="button" className="text-[15px] font-medium text-white hover:text-[#0091D5] transition-colors">
//                 Resent OTP
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-5">
//           <button
//             type="submit"
//             className="w-full rounded-[15px] bg-[#0091D5] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#007fb8] active:scale-[0.98]"
//           >
//             Verify
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;



import React, { useState, useEffect, useRef } from 'react';
import { IoCallOutline } from 'react-icons/io5';
import { assets } from '../../assets/assets';
import {
  forgotPassword,
  forgotOtpVerify,
  resendOtp,
  resetPassword,
} from '../../services/auth/authServices'; // adjust path as needed
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SESSION_KEY = 'forgotpwd_phone_verified';

const ForgotPassword = () => {
  // --- State ---
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false); // true after Send OTP success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const storedOtp=sessionStorage.getItem("forgotOtp")
  const navigate=useNavigate()
  // Resend timer
  const [timer, setTimer] = useState(0); // seconds remaining
  const timerRef = useRef(null);

  const otpRefs = useRef([]);

  // --- On mount: restore session if phone was already verified ---
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setMobileNumber(saved);
      setPhoneVerified(true);
      startTimer(); 
    }

    return () => clearInterval(timerRef.current);
  }, []);

  // --- Timer helpers ---
  const startTimer = () => {
    setTimer(20);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Send OTP ---
  const handleSendOtp = async () => {
    setError('');
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid mobile number.');
      return;
    }
    setLoading(true);
    try {
     const res = await forgotPassword({ phone: mobileNumber });
      if(res.status){
        toast.success(res?.message)
        sessionStorage.setItem("forgotOtp",res.data.otp)
        // Save to sessionStorage so page refresh doesn't re-enable phone field
        sessionStorage.setItem(SESSION_KEY, mobileNumber);
        setPhoneVerified(true);
        startTimer();
      }
      else{
        toast.error(res.message)
      }
    } catch (err) {
       toast.error(err?.message)
    } finally {
      setLoading(false);
    }
  };

  // --- Resend OTP ---
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res=await resendOtp({ phone: mobileNumber, type: 'forgot' });
      if(res.status){
        setOtp(['', '', '', '']);
        startTimer();
        toast.success(res.message)
        otpRefs.current[0]?.focus();
        sessionStorage.setItem("forgotOtp",res.otp)
      }
      else{
         toast.error(res.message) 
      }
    } catch (err) {
       toast.error(res.message)
    } finally {
      setLoading(false);
    }
  };

  // --- OTP input handling ---
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // only last char
    setOtp(newOtp);
    if (val && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --- Verify OTP ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      setError('Please enter the 4-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotOtpVerify({ phone: mobileNumber, otp: otpValue });
    if(res.status){

          // sessionStorage.removeItem(SESSION_KEY);
          toast.success(res?.message)
          navigate("/auth/change-password")
      }
      else{
         toast.error(res.message) 
      }
    
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black px-4 bg-cover bg-center bg-no-repeat"
      // style={{ backgroundImage: `url(${assets.login_bg})` }}
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
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            Forgot Password  {storedOtp}
          </h1>
        </div>

        {/* Error / Success banners */}
        {error && (
          <p className="text-center text-sm text-red-400 bg-red-500/10 rounded-xl py-2 px-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-center text-sm text-green-400 bg-green-500/10 rounded-xl py-2 px-4">
            {success}
          </p>
        )}

        <div className="space-y-6">
          {/* Mobile Input Section */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-light">
              Enter your Mobile Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                <IoCallOutline size={20} />
              </div>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => !phoneVerified && setMobileNumber(e.target.value)}
                // 🔒 Lock phone field once OTP is sent (persists on refresh via sessionStorage)
                disabled={phoneVerified}
                className={`w-full rounded-[14px] border border-white/20 bg-black/10 py-3.5 pl-12 pr-28 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md ${
                  phoneVerified ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phoneVerified || loading}
                className={`absolute right-1 rounded-[12px] bg-[#0091D5] px-4 py-3 text-sm font-semibold text-white transition-colors ${
                  phoneVerified || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#007fb8]'
                }`}
              >
                {loading && !phoneVerified ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* OTP Section — only shown after phone verified */}
        
            <div className="space-y-4 text-center">
              <label className="block text-left text-sm text-gray-300 font-light">
                Enter your OTP
              </label>
              <div className="flex justify-between gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    placeholder="*"
                    value={data}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="h-16 w-16 rounded-[18px] border border-white/20 bg-black/10 text-center text-xl text-white placeholder-gray-400 focus:border-[#0091D5] focus:outline-none backdrop-blur-md transition-all"
                  />
                ))}
              </div>

              {/* Resend section */}
              <div className="pt-2">
                <p className="text-[13px] text-gray-400">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || loading || !phoneVerified}
                  className={`text-[15px] font-medium transition-colors ${
                    timer > 0 || loading || !phoneVerified
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-white hover:text-[#0091D5]'
                  }`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>

        </div>

        {/* Verify button — only shown after phone verified */}
        
          <div className="space-y-5">
            <button
              type="submit"
              disabled={loading || !phoneVerified}
              className={`w-full rounded-[15px] bg-[#0091D5] py-3.5 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                (loading ||!phoneVerified ) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#007fb8]'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
 
      </form>
    </div>
  );
};

export default ForgotPassword;