import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { RealReachLogo } from './RealReachLogo';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('Montaser Abdalla');
  const [phoneNumber, setPhoneNumber] = useState('3516429276');
  const [email, setEmail] = useState('montaser.abdalla01@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-200 text-center animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Top Logo Badge matching Image 5 */}
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-950 shadow-2xs">
              <RealReachLogo size={28} color="#0a0a0b" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-2xl font-bold text-[#0a0a0b] tracking-tight">
              Create Account
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#6b7280]">
              Create your account to get started
            </p>

            {/* Form Fields matching Image 5 */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-[#eef2f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl bg-[#eef2f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#eef2f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-900 focus:border-black px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-5 text-xs text-[#6b7280]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-[#0a0a0b] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </>
        ) : (
          <div className="py-6 space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-lg text-slate-900">Account Ready!</h4>
            <p className="text-xs text-slate-500">Welcome to REALREACH. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;
