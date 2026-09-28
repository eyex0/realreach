import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RealReachLogo } from './RealReachLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenOrder: () => void;
  onOpenPortal: () => void;
  onOpenSignUp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder, onOpenPortal, onOpenSignUp }) => {
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
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Free Features', href: '/#features' },
    { label: 'For Distributors', href: '/for-distributors' },
    { label: 'Print Store', href: '/print' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* 1. Top Blue Banner */}
      <div className="w-full bg-[#006de4] text-white py-2 px-4 text-center text-xs sm:text-sm font-medium transition-colors hover:bg-[#0060ca]">
        <button
          type="button"
          onClick={onOpenOrder}
          className="inline-flex items-center justify-center gap-1.5 cursor-pointer mx-auto group hover:underline"
        >
          <span>New REALREACH 2.0 out now</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 2. Main Sticky Navbar matching PDF Page 1 */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 border-b border-[var(--color-border)] ${
          isScrolled ? 'shadow-sm bg-white/95 backdrop-blur-md' : 'bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          
          {/* Left: Transparent Origami Paper Airplane Logo (NO CIRCLE) + REALREACH brand text */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
              aria-label="REALREACH Home"
            >
              {/* Pure Transparent Vector Paper Airplane, without circle container */}
              <RealReachLogo size={26} color="#0a0a0b" className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[22px] font-bold tracking-tight text-[#0a0a0b]">
                REALREACH
              </span>
            </Link>

            {/* Center Desktop Links: Exactly as in PDF */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {navLinks.map((item) => {
                const isCurrent =
                  item.href === location.pathname ||
                  (item.href === '/#how-it-works' && location.pathname === '/' && location.hash === '#how-it-works');
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className={`text-[14px] font-medium transition-colors cursor-pointer ${
                      isCurrent
                        ? 'text-[#0a0a0b] font-semibold'
                        : 'text-[#4b5563] hover:text-[#0a0a0b]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Buttons: "Log in" and "Get Started" black pill button */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenPortal}
              className="text-[14px] font-medium text-[#4b5563] hover:text-[#0a0a0b] px-3 py-1.5 transition-colors cursor-pointer"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={onOpenOrder}
              className="inline-flex items-center justify-center rounded-xl bg-[#0a0a0b] text-white px-5 py-2 text-[14px] font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              Get Started
            </button>
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
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.href)}
                  className="text-left text-base font-medium text-slate-800 py-1.5 hover:text-black cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder();
                }}
                className="w-full py-3 rounded-xl bg-[#0a0a0b] text-white text-sm font-semibold text-center cursor-pointer"
              >
                Get Started
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-medium text-center cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
export default Navbar;
