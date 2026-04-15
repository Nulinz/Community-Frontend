import React, { useState } from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';
import { Eye, EyeOff } from 'lucide-react';
import { assets } from '../../assets/assets';

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
          className="w-full rounded-[14px] border border-white/20 bg-black/10 backdrop-blur-[68px] py-3.5 pl-12 pr-12 text-white placeholder-gray-500 transition focus:border-[#0091D5] focus:outline-none backdrop-blur-md"
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

const CreatePassword = () => {
  // 1. Separate state for each field
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSavePassword = (e) => {
    e.preventDefault();
    
    // 2. Logic check: Do they match?
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    
    console.log("Password updated successfully!");
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-black px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${assets.login_bg})` }}
    >
      <form
        onSubmit={handleSavePassword}
        className="w-full max-w-[450px] space-y-8 rounded-[30px] bg-black/8 p-10 shadow-2xl backdrop-blur-[68px] border border-white/10"
      >
        <div className="text-center">
          <img
            src={assets.logo} 
            alt="Nulinz Logo"
            className="mx-auto h-14 w-auto mb-1"
          />
          <h1 className="text-[28px] font-bold text-white tracking-tight">Create Password</h1>
        </div>

        <div className="space-y-6">
          <PasswordField
            label="New Password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Connects to New State
            placeholder="**********"
            required
          />

          <PasswordField
            label="Confirm Password"
            id="confirmPassword"
            value={confirmPassword} // Connects to Confirm State
            onChange={(e) => setConfirmPassword(e.target.value)} // Connects to Confirm State
            placeholder="**********"
            required
          />
        </div>

        <div className="space-y-5">
          <button
            type="submit"
            className="w-full rounded-[15px] bg-[#0091D5] py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#007fb8] active:scale-[0.98]"
          >
            Save password
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePassword;