import React from 'react';
import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { RealReachLogo } from '../components/RealReachLogo';
import { SignupIllustration } from '../components/SignupIllustration';

export const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#0a0a0b] flex flex-col justify-between selection:bg-[#0a0a0b] selection:text-white">
      <div className="flex-1 w-full max-w-[1400px] mx-auto grid lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 px-6 sm:px-12 md:px-16 lg:px-20 py-12 md:py-16 flex flex-col justify-center max-w-xl mx-auto w-full">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <RealReachLogo size={26} color="#0a0a0b" className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[22px] font-bold tracking-tight text-[#0a0a0b]">
                Realreach
              </span>
            </Link>
          </div>

          <div className="animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 mb-6 text-sm text-[#6b7280]">
              Sign in to manage your distribution campaigns.
            </p>
            <SignIn
              routing="path"
              path="/signin"
              signUpUrl="/signup"
              fallbackRedirectUrl="/dashboard"
            />
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#fafafa] lg:min-h-screen border-l border-slate-100 flex flex-col items-center justify-center p-8 sm:p-12">
          <SignupIllustration />
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        &copy; 2026 Realreach S.r.l. P.IVA IT 12849300965. All rights reserved.
      </footer>
    </div>
  );
};

export default SignInPage;
