import React, { useState } from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import AuthBase from '../../layout/AuthBase';
import { resetPassword } from '../../services/auth/authServices';

const SESSION_KEY = 'forgotpwd_phone_verified';

/**
 * PasswordField Component
 * Reusable password input field with secure eye toggle and glassmorphism styling.
 */
const PasswordField = ({ label, id, value, onChange, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

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
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3 pl-12 pr-12 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
};

/**
 * CreatePassword Component
 *
 * Final step in the password reset process.
 * Verifies session, validates matching credentials, and submits the new password.
 */
const CreatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Retrieve verified phone number from session
  const phone = sessionStorage.getItem(SESSION_KEY);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phone) {
      setError('Session expired. Please restart the forgot password process.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ phone, new_password: newPassword });
      if (res?.status) {
        toast.success(res?.message || 'Password reset successfully');
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem('forgotOtp');
        setTimeout(() => navigate('/auth/login'), 1200);
      } else {
        toast.error(res?.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBase maxWidth="max-w-[450px]">
      <form onSubmit={handleSavePassword} className="w-full space-y-8">
        <div className="text-center">
          <img
            src={assets.landing_logo}
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">
            Create Password
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

        <div className="space-y-5">
          <PasswordField
            label="New Password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <PasswordField
            label="Confirm Password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center rounded-[15px] bg-[#171717] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-black hover:shadow-black/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Save Password'}
          </button>

          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-400">Changed your mind?</span>
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

export default CreatePassword;