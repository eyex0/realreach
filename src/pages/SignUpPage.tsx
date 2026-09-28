import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RealReachLogo } from '../components/RealReachLogo';
import { SignupIllustration } from '../components/SignupIllustration';
import { TermsModal } from '../components/TermsModal';
import { 
  Home, 
  User, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock,
  CheckCircle2
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  // Step 1: 'get-started' (email/phone prompt) -> Step 2: 'create-account' (details) -> Step 3: 'success'
  const [step, setStep] = useState<'get-started' | 'create-account' | 'success'>('get-started');
  const [emailOrPhone, setEmailOrPhone] = useState('montaser.abdalla01@gmail.com');
  const [role, setRole] = useState<'business' | 'distributor'>('business');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Step 1 submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter a valid email or phone number');
      return;
    }
    setErrorMsg('');
    setStep('create-account');
  };

  // Handle Step 2 submission
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms & Conditions to proceed');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return;
    }
    setErrorMsg('');
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0b] flex flex-col justify-between selection:bg-[#0a0a0b] selection:text-white">
      
      {/* Main Split Screen Container */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto grid lg:grid-cols-12 items-center">
        
        {/* LEFT COLUMN: AUTH FORM */}
        <div className="lg:col-span-6 px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-16 flex flex-col justify-center max-w-xl mx-auto w-full">
          
          {/* Top Brand Logo matching Image 2 & 3 */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <RealReachLogo size={26} color="#0a0a0b" className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[22px] font-bold tracking-tight text-[#0a0a0b]">
                REALREACH
              </span>
            </Link>
          </div>

          {/* STEP 1: GET STARTED (Image 2) */}
          {step === 'get-started' && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
                Get started
              </h1>

              <form onSubmit={handleStep1Submit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="emailOrPhone" className="block text-xs font-semibold text-[#0a0a0b] mb-2">
                    Email or Phone number
                  </label>
                  <input
                    id="emailOrPhone"
                    type="text"
                    required
                    placeholder="you@company.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full rounded-xl bg-[#f3f4f6] border border-transparent focus:border-slate-400 focus:bg-white px-4 py-3.5 text-sm text-[#0a0a0b] placeholder-slate-400 transition-all outline-none"
                  />
                  {errorMsg && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errorMsg}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-md hover:scale-101"
                >
                  Continue
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-[#6b7280]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setStep('create-account')}
                  className="font-bold text-[#0a0a0b] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE YOUR ACCOUNT (Image 3) */}
          {step === 'create-account' && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-[#6b7280]">
                It only takes a minute.
              </p>

              <form onSubmit={handleStep2Submit} className="mt-6 space-y-4">
                
                {/* Account Type Selection (Business vs Distributor) */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0b] mb-2">
                    How will you use REALREACH?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Business Card */}
                    <button
                      type="button"
                      onClick={() => setRole('business')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        role === 'business'
                          ? 'border-black ring-1 ring-black bg-white shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Home className="h-4 w-4 text-slate-800" />
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          role === 'business' ? 'bg-black text-white' : 'border border-slate-300'
                        }`}>
                          {role === 'business' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="block text-xs font-bold text-slate-900">Business</span>
                        <span className="block text-[11px] text-[#6b7280] mt-0.5">I want flyers delivered.</span>
                      </div>
                    </button>

                    {/* Distributor Card */}
                    <button
                      type="button"
                      onClick={() => setRole('distributor')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        role === 'distributor'
                          ? 'border-black ring-1 ring-black bg-white shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <User className="h-4 w-4 text-slate-800" />
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          role === 'distributor' ? 'bg-black text-white' : 'border border-slate-300'
                        }`}>
                          {role === 'distributor' && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="block text-xs font-bold text-slate-900">Distributor</span>
                        <span className="block text-[11px] text-[#6b7280] mt-0.5">I want to deliver and earn.</span>
                      </div>
                    </button>

                  </div>
                </div>

                {/* Name Fields (First and Last name) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Montaser"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl bg-[#f3f4f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Abdalla"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl bg-[#f3f4f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                    />
                  </div>
                </div>

                {/* Email (Locked to address signed up with) */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      readOnly
                      value={emailOrPhone}
                      className="w-full rounded-xl bg-[#f3f4f6] border border-slate-200 text-slate-600 px-3.5 py-2.5 text-sm cursor-not-allowed select-none pr-8"
                    />
                    <Lock className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                  <span className="text-[11px] text-[#6b7280] mt-1 block">
                    Locked to the address you signed up with.
                  </span>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+39 351 642 9276"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-[#f3f4f6] border border-transparent focus:border-slate-400 focus:bg-white px-3.5 py-2.5 text-sm text-[#0a0a0b] outline-none"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0b] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 focus:border-black px-3.5 py-2.5 text-sm text-[#0a0a0b] pr-10 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-black cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-[#6b7280] mt-1 block">
                    Use at least 8 characters with a mix of letters, numbers and a symbol.
                  </span>
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 select-none">
                      I have read and accept the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsModal(true);
                        }}
                        className="font-bold underline text-[#0a0a0b] hover:text-black cursor-pointer"
                      >
                        Terms &amp; Conditions
                      </button>
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                )}

                {/* Create Account Button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-md hover:scale-101"
                >
                  Create account
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-[#6b7280]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setStep('get-started')}
                  className="font-bold text-[#0a0a0b] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#0a0a0b]">Account Created Successfully!</h2>
              <p className="mt-2 text-sm text-[#6b7280] max-w-sm mx-auto">
                Welcome to REALREACH, {firstName || 'Montaser'}. Your account is ready to manage flyer distribution campaigns with live GPS tracking.
              </p>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Explore Milan Live Map &amp; Pricing
                </button>
                <Link
                  to="/about"
                  className="block text-xs font-semibold text-slate-500 hover:text-black"
                >
                  Return to REALREACH Homepage &rarr;
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: VECTOR ILLUSTRATION & BRAND MARQUEE (Matching Image 2 & 3) */}
        <div className="lg:col-span-6 bg-[#fafafa] lg:min-h-screen border-l border-slate-100 flex flex-col items-center justify-center p-8 sm:p-12">
          <SignupIllustration />
        </div>

      </div>

      {/* Copyright Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        &copy; 2026 REALREACH S.r.l. P.IVA IT 12849300965. All rights reserved.
      </footer>

      {/* Full Terms Modal (Image 4) */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setTermsAccepted(true)}
      />

    </div>
  );
};

export default SignUpPage;
