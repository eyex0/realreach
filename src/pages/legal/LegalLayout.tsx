import React from 'react';
import { Link } from 'react-router-dom';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, children }) => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-black">
            &larr; Back to Realreach Home
          </Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0a0a0b] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Last revised: September 2026 &bull; Realreach S.r.l., Milan, Italy
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed border-t border-slate-200 pt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
