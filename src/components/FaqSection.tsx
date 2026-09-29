import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I know my jobs have been delivered?',
    a: 'Every Realreach flyer distribution campaign is GPS tracked. You can follow the progress of your campaign through your Realreach account and, once completed, view the delivery route and tracking data showing where your flyers were distributed.',
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
        
        {/* OPERATOR APP ACCESS */}
        {/* There is no App Store or Google Play listing yet: pointing at the
            stores would be a dead end for anyone who believed it. Say what is
            actually true, and how to get on. */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left">
            <p className="text-sm font-bold text-[#0a0a0b]">Realreach Runner app</p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              The courier app runs on iOS and Android. Store listings are not published yet, so we
              hand out access directly: ask your account contact for a pairing code, install the
              build we send you, and sign in with your work email and that code.
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Already paired? Open the app and enter the same six-character code. It works once and
              expires, so it is safe to read out over the phone.
            </p>
          </div>
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
