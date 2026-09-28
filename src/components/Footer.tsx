import React from 'react';
import { Link } from 'react-router-dom';
import { RealReachLogo } from './RealReachLogo';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        
        {/* PDF PAGE 11: 4-COLUMN FOOTER GRID */}
        <div className="grid gap-10 py-16 sm:py-20 md:grid-cols-5 md:gap-12">
          
          {/* Brand & Socials (Col span 2) */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <RealReachLogo size={24} color="#0a0a0b" className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[22px] font-bold tracking-tight text-[#0a0a0b]">
                REALREACH
              </span>
            </Link>

            <p className="mt-4 text-sm text-[#4b5563] max-w-sm leading-relaxed">
              Italy's #1 flyer distribution platform — letterbox drops and pamphlet delivery with GPS verification in Milan.
            </p>

            {/* Social Icons matching PDF Page 11 */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-black transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-black transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-black transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-[#0a0a0b]">Company</h3>
            <ul className="space-y-3 text-sm text-[#4b5563]">
              <li>
                <Link to="/about" className="hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-[#0a0a0b]">Resources</h3>
            <ul className="space-y-3 text-sm text-[#4b5563]">
              <li>
                <Link to="/blog" className="hover:text-black transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-black transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/for-distributors" className="hover:text-black transition-colors">
                  For Distributors
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-[#0a0a0b]">Legal</h3>
            <ul className="space-y-3 text-sm text-[#4b5563]">
              <li>
                <Link to="/legal/terms" className="hover:text-black transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/community-clients" className="hover:text-black transition-colors">
                  Community Guidelines (Clients)
                </Link>
              </li>
              <li>
                <Link to="/legal/community-distributors" className="hover:text-black transition-colors">
                  Community Guidelines (Distributors)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* PDF PAGE 11: COPYRIGHT NOTICE */}
        <div className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[#6b7280]">
          © 2026 REALREACH S.r.l. P.IVA IT 12849300965. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
export default Footer;
