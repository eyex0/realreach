import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { RealReachLogo } from './RealReachLogo';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Demo', href: '/demo' },
    { label: 'For Distributors', href: '/for-distributors' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-200 border-b border-[var(--color-border)] ${
        isScrolled ? 'shadow-md bg-white/95 backdrop-blur-md' : 'shadow-sm bg-white'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

        {/* Left: Logo + Links */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            aria-label="Realreach Home"
          >
            <RealReachLogo size={26} color="#0a0a0b" className="group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[22px] font-bold tracking-tight text-[#0a0a0b]">
              Realreach
            </span>
          </Link>

          {/* Center Desktop Links */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
            {navLinks.map((item) => {
              const isCurrent = item.href === location.pathname;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={`text-[15px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? 'text-[#0a0a0b] font-semibold border-2 border-[#0a0a0b]'
                      : 'text-[#4b5563] hover:text-[#0a0a0b] border-2 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: auth controls */}
        <div className="hidden sm:flex items-center gap-7">
          <SignedOut>
            <button
              type="button"
              onClick={() => handleNavClick('/signin')}
              className="text-[15px] font-bold text-[#0a0a0b] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('/signup')}
              className="inline-flex items-center justify-center rounded-2xl bg-[#0a0a0b] text-white px-7 py-3 text-[15px] font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <button
              type="button"
              onClick={() => handleNavClick('/opportunities')}
              className="text-[15px] font-bold text-[#0a0a0b] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Opportunities
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/dashboard')}
              className="text-[15px] font-bold text-[#0a0a0b] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Dashboard
            </button>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-5 py-6 shadow-xl animate-fadeIn space-y-4">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isCurrent = item.href === location.pathname;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className={`text-left text-base font-medium py-2 px-3 rounded-lg cursor-pointer ${
                    isCurrent
                      ? 'text-black font-semibold border-2 border-black'
                      : 'text-slate-800 hover:text-black border-2 border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <SignedOut>
              <button
                type="button"
                onClick={() => handleNavClick('/signup')}
                className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold text-center cursor-pointer"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('/signin')}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium text-center cursor-pointer"
              >
                Log in
              </button>
            </SignedOut>
            <SignedIn>
              <button
                type="button"
                onClick={() => handleNavClick('/dashboard')}
                className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold text-center cursor-pointer"
              >
                Dashboard
              </button>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
