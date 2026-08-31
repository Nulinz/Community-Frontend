import React, { useState, useEffect, useRef } from 'react';
import { IoCallOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import AuthBase from '../../layout/AuthBase';
import {
  forgotPassword,
  forgotOtpVerify,
  resendOtp,
} from '../../services/auth/authServices';

const SESSION_KEY = 'forgotpwd_phone_verified';

/**
 * ForgotPassword Component
 *
 * Provides a streamlined password recovery flow:
 * 1. Mobile number validation & OTP dispatch.
 * 2. 4-digit OTP input with automatic focus forwarding & keyboard backspace handling.
 * 3. OTP verification routing directly to the password reset view.
 * 
 * Styled with the identical glassmorphic theme and AuthBase layout as Login.
 */
const ForgotPassword = () => {
  // Form & verification state
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Resend OTP countdown timer
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const otpRefs = useRef([]);

  // Restore active verification session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setMobileNumber(saved);
      setPhoneVerified(true);
      startTimer();
    }

    return () => clearInterval(timerRef.current);
  }, []);

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

  // Dispatch OTP to user's registered phone
  const handleSendOtp = async () => {
    setError('');
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword({ phone: mobileNumber });
      if (res?.status) {
        toast.success(res?.message || 'OTP sent successfully');
        if (res?.data?.otp) {
          sessionStorage.setItem('forgotOtp', res.data.otp);
        }
        sessionStorage.setItem(SESSION_KEY, mobileNumber);
        setPhoneVerified(true);
        startTimer();
      } else {
        toast.error(res?.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-request OTP code
  const handleResendOtp = async () => {
    if (timer > 0 || loading || !phoneVerified) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await resendOtp({ phone: mobileNumber, type: 'forgot' });
      if (res?.status) {
        setOtp(['', '', '', '']);
        startTimer();
        toast.success(res?.message || 'OTP resent successfully');
        otpRefs.current[0]?.focus();
        if (res?.otp) {
          sessionStorage.setItem('forgotOtp', res.otp);
        }
      } else {
        toast.error(res?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP cell changes with focus stepping
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation across OTP cells
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Submit and verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      setError('Please enter the full 4-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotOtpVerify({ phone: mobileNumber, otp: otpValue });
      if (res?.status) {
        toast.success(res?.message || 'OTP verified successfully');
        navigate('/auth/change-password');
      } else {
        toast.error(res?.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBase maxWidth="max-w-[450px]">
      <form onSubmit={handleVerify} className="w-full space-y-8">
        <div className="text-center">
          <img
            src={assets.landing_logo}
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            Forgot Password
          </h1>
        </div>

        {/* Dynamic status alerts */}
        {error && (
          <p className="text-center text-sm text-red-400 bg-red-500/10 rounded-xl py-2 px-4 border border-red-500/20">
            {error}
          </p>
        )}
        {success && (
          <p className="text-center text-sm text-green-400 bg-green-500/10 rounded-xl py-2 px-4 border border-green-500/20">
            {success}
          </p>
        )}

        <div className="space-y-6">
          {/* Mobile input field with Send OTP button */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-light">
              Enter your Mobile Number
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <IoCallOutline size={20} />
              </div>
              <input
                type="tel"
                placeholder="Enter Mobile Number"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => !phoneVerified && setMobileNumber(e.target.value)}
                disabled={phoneVerified}
                className={`w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3 pl-12 pr-28 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md ${
                  phoneVerified ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={phoneVerified || loading}
                className={`absolute right-1.5 rounded-[12px] bg-[#171717] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white border border-white/10 transition-all ${
                  phoneVerified || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-black active:scale-[0.98]'
                }`}
              >
                {loading && !phoneVerified ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* 4-Digit OTP Grid */}
          <div className="space-y-4 text-center">
            <label className="block text-left text-sm text-gray-300 font-light">
              Enter your OTP
            </label>
            <div className="flex justify-between gap-2.5 sm:gap-3">
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
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-[16px] sm:rounded-[18px] border border-white/20 bg-black/10 backdrop-blur-[68px] text-center text-xl font-bold text-white placeholder-gray-500 focus:border-[#0091D5] focus:outline-none backdrop-blur-md transition-all"
                />
              ))}
            </div>

            {/* Resend OTP button */}
            <div className="pt-2 text-center">
              <p className="text-[13px] text-gray-400">
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0 || loading || !phoneVerified}
                className={`mt-1 text-[14px] font-semibold transition-colors ${
                  timer > 0 || loading || !phoneVerified
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white underline underline-offset-4 hover:text-white/80'
                }`}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button & Navigation Link */}
        <div className="space-y-5">
          <button
            type="submit"
            disabled={loading || !phoneVerified}
            className={`w-full flex justify-center items-center rounded-[15px] bg-[#171717] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-black hover:shadow-black/20 active:scale-[0.99] ${
              loading || !phoneVerified ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Verify'}
          </button>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-400">Remember your password?</span>
            <Link
              to="/auth/login"
              className="font-semibold text-white underline underline-offset-4 hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </AuthBase>
  );
};

export default ForgotPassword;