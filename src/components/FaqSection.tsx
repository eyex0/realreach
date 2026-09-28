import React, { useState } from 'react';
import { ChevronDown, Apple } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I know my jobs have been delivered?',
    a: 'Every REALREACH flyer distribution campaign is GPS tracked. You can follow the progress of your campaign through your REALREACH account and, once completed, view the delivery route and tracking data showing where your flyers were distributed.',
  },
  {
    q: 'What happens if something goes wrong?',
    a: 'We flag issues early and keep you in the loop. Our team handles communication with distributors and will re-allocate or re-deliver where needed. You can reach out anytime via the app or our support team.',
  },
  {
    q: 'Is my delivery guaranteed?',
    a: 'Yes. If not we will refund completely.',
  },
  {
    q: 'Do you cover my area?',
    a: 'We have active distributors across Milan (Centro, Navigli, Brera, Porta Nuova, CityLife, Isola, Lambrate, Porta Romana), Monza, and the greater Lombardy region. When you draw your zone on the map, you’ll see the exact address count and we’ll only confirm the job when we have verified walker coverage.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // Default open first as in Page 10 screenshot!

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        
        {/* PDF PAGE 9: APP STORE & GOOGLE PLAY DOWNLOAD BADGES */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {/* Apple App Store */}
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <Apple className="h-7 w-7 text-black fill-black" />
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Download on the
              </span>
              <span className="block text-base font-bold text-[#0a0a0b] leading-tight">
                App Store
              </span>
            </div>
          </a>

          {/* Google Play */}
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M3.6 1.4L13.8 11.6L3.6 21.8C3.2 21.4 3 20.7 3 19.8V3.4C3 2.5 3.2 1.8 3.6 1.4Z" fill="#2196F3" />
              <path d="M17.2 8.2L13.8 11.6L3.6 1.4C4.1 1.1 4.8 1.1 5.4 1.5L17.2 8.2Z" fill="#4CAF50" />
              <path d="M17.2 15L5.4 21.7C4.8 22.1 4.1 22.1 3.6 21.8L13.8 11.6L17.2 15Z" fill="#F44336" />
              <path d="M21.5 10.7L17.2 8.2L13.8 11.6L17.2 15L21.5 12.5C22.2 12.1 22.2 11.1 21.5 10.7Z" fill="#FFEB3B" />
            </svg>
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Get it on
              </span>
              <span className="block text-base font-bold text-[#0a0a0b] leading-tight">
                Google Play
              </span>
            </div>
          </a>
        </div>

        {/* PDF PAGE 9: FAQ HEADING */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6b7280]">
            FAQ
          </p>
          <h2 className="mt-2 font-bold text-[#0a0a0b] tracking-[-0.03em] text-[clamp(2.2rem,4vw,3.25rem)]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* PDF PAGE 10: FAQ ACCORDION CARDS */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-lg sm:text-xl text-[#0a0a0b] pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-slate-900 text-white' : 'text-slate-700'
                    }`}
                  >
                    <ChevronDown className={`h-4 w-4 ${isOpen ? 'text-white' : 'text-slate-700'}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-7 pt-1 text-[#4b5563] text-base leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
export default FaqSection;
