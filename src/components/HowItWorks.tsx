import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenOrder?: () => void;
}

const STEPS = [
  {
    stepNumber: 'STEP 1',
    title: 'Build flyer campaign',
    description:
      'Select your target Milan audience by zones, postcodes, or streets with our map polygon tool. Instant transparent pricing.',
    videoUrl:
      'https://realrun.com.au/__l5e/assets-v1/2fcc8170-43c7-41c4-99e2-04ba9932b673/step-build-campaign-v6.mp4',
    progressColor: 'bg-emerald-500',
  },
  {
    stepNumber: 'STEP 2',
    title: 'Get allocated Distributors',
    description:
      "Your run is matched to verified 'Realreach Walkers' in the Milan area and allocated ready for collection.",
    videoUrl:
      'https://realrun.com.au/__l5e/assets-v1/9cff4208-3ca3-4db0-a4b4-77a281c5c691/step-assign-distributor.mp4',
    progressColor: 'bg-amber-500',
  },
  {
    stepNumber: 'STEP 3',
    title: 'Collection & Pickup',
    description:
      'Choose any pickup location in Milan and a verified Realreach runner collects your flyers, ready to distribute in your campaign area.',
    videoUrl:
      'https://realrun.com.au/__l5e/assets-v1/38b8ca53-7ae2-4189-9d12-c4cc21a4bd51/step-collection-trim.mp4',
    progressColor: 'bg-blue-500',
  },
  {
    stepNumber: 'STEP 4',
    title: 'Live tracking & verification',
    description:
      'Watch your delivery happen live with real-time GPS breadcrumbs, verified delivery counts, and photo completion reports.',
    videoUrl:
      'https://realrun.com.au/__l5e/assets-v1/3b7a9410-988f-46f6-a942-4f92ac433527/step-tracking.mp4',
    progressColor: 'bg-indigo-500',
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrder }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(1); // Default to Step 2 as shown in PDF Page 5!

  const prevStep = () => {
    setCurrentStepIdx((idx) => (idx === 0 ? STEPS.length - 1 : idx - 1));
  };

  const nextStep = () => {
    setCurrentStepIdx((idx) => (idx === STEPS.length - 1 ? 0 : idx + 1));
  };

  const step = STEPS[currentStepIdx];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        
        {/* PAGE 4: SECTION HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-bold text-[#0a0a0b] leading-[1.1] tracking-[-0.03em] text-[clamp(2.2rem,4.5vw,3.5rem)]">
            How to start distributing
          </h2>
          <p className="mt-3 text-base sm:text-xl text-[#4b5563]">
            Draw it, price it, book it. Watch it happen live on the map.
          </p>
        </div>

        {/* STEP PROGRESS BAR INDICATOR (PAGE 4) */}
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2 sm:gap-3 mb-12">
          {STEPS.map((s, i) => (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => setCurrentStepIdx(i)}
              className="group text-left cursor-pointer focus:outline-none"
            >
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                  i === currentStepIdx
                    ? 'bg-[#0a0a0b]'
                    : i < currentStepIdx
                    ? 'bg-slate-400'
                    : 'bg-slate-200'
                }`}
              />
              <div className="mt-2 hidden sm:block">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {s.stepNumber}
                </span>
                <span className={`text-xs font-semibold block truncate ${i === currentStepIdx ? 'text-[#0a0a0b]' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* PAGE 5: STEP LAPTOP VIEW */}
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-20">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Step Copy */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {step.stepNumber}
              </span>

              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#0a0a0b] tracking-tight">
                {step.title}
              </h3>

              <p className="mt-4 text-base text-[#4b5563] leading-relaxed">
                {step.description}
              </p>

              {/* Prev / Next controls matching PDF Page 5 */}
              <div className="mt-8 flex items-center gap-6 text-sm font-semibold text-[#0a0a0b]">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Step Video Screen */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-md bg-black aspect-video flex items-center justify-center">
                <video
                  key={step.videoUrl}
                  src={step.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
export default HowItWorks;
