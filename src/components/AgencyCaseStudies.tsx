import React, { useState } from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    quote:
      "Using REALREACH has saved our team a significant amount of time and provided a far more reliable brochure delivery solution. They've streamlined the entire process, from organising distributors to handling payments, which has taken a lot of admin off our plate. The consistency and ease of working with REALREACH has been a big win for our office.",
    author: 'Kate Barber',
    agency: 'Belle Property & Engel & Völkers Milano',
  },
  {
    quote:
      "REALREACH has made our letterbox drops across Milan far more organised and easy to manage. The REALREACH app is easy to use and gives us clear visibility on delivery progress in Navigli and Brera, which saves time and gives us confidence that our campaigns are being completed properly.",
    author: 'Jazmin Fitzgerald',
    agency: 'Ray White / Tecnocasa Milano',
  },
  {
    quote:
      'REALREACH is time efficient, and allows our team to focus on their higher priority prospecting tasks. The group at REALREACH are always prompt to respond, and happy to assist where needed.',
    author: 'Zoe Dowd',
    agency: 'Gabetti & Remax Italia',
  },
];

export const AgencyCaseStudies: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = REVIEWS[activeIdx];

  return (
    <section
      id="testimonials"
      className="bg-[#006de4] text-white py-20 md:py-28 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 lg:px-8 text-center">
        
        {/* PDF PAGE 7: HEADING & STARS */}
        <h2
          id="testimonials-heading"
          className="font-bold text-white tracking-[-0.03em] text-[clamp(2.2rem,4.5vw,3.5rem)] leading-tight"
        >
          Loved by teams across Italy
        </h2>

        <p className="mt-3 text-white/90 text-base sm:text-xl max-w-xl mx-auto">
          Real feedback from the businesses using REALREACH every week
        </p>

        {/* 5 Gold Stars */}
        <div className="mt-6 flex justify-center items-center gap-1.5 text-amber-300">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-amber-300 text-amber-300" />
          ))}
        </div>

        {/* PDF PAGE 8: TESTIMONIAL QUOTE & AUTHOR */}
        <div className="mt-14 max-w-3xl mx-auto text-center px-4">
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium leading-relaxed">
            "{current.quote}"
          </p>

          <div className="mt-8">
            <h4 className="font-bold text-white text-lg sm:text-xl">
              {current.author}
            </h4>
            <p className="text-white/80 text-sm sm:text-base mt-1">
              {current.agency}
            </p>
          </div>

          {/* Dash & Dots Indicator matching PDF Page 8 */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Review ${i + 1}`}
                className={`transition-all duration-200 cursor-pointer ${
                  i === activeIdx
                    ? 'w-8 h-1.5 bg-white rounded-full'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70 rounded-full'
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
export default AgencyCaseStudies;
