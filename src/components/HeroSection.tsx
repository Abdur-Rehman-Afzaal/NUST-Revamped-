import { useState } from 'react';
import { ArrowRight, Box } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  HERO_SLIDES,
  UTILITY_PORTALS,
  type PortalLink,
} from '../data/nustData';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroSectionProps {
  onExplorePrograms: () => void;
  onExplore3DCampus: () => void;
  onOpenAdmissions: () => void;
  onSelectPortal: (portal: PortalLink) => void;
}

const GLANCE_METRICS = [
  {
    value: '#1',
    label: 'In Pakistan',
    detail: 'QS World Rankings 2026–27',
  },
  {
    value: '#353',
    label: 'Global Standing',
    detail: 'Top 150 Engineering & Technology',
  },
  {
    value: '18',
    label: 'Constituent Institutions',
    detail: 'Across 5 Cities in Pakistan',
  },
  {
    value: '15,400+',
    label: 'Enrolled Scholars',
    detail: '110+ Resident NSTP Tech Firms',
  },
];

export function HeroSection({
  onExplorePrograms,
  onExplore3DCampus,
  onOpenAdmissions,
  onSelectPortal,
}: HeroSectionProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentSlide = HERO_SLIDES[activeSlideIndex] ?? HERO_SLIDES[0];

  const qalamPortal = UTILITY_PORTALS.find((p) => p.id === 'qalam');
  const nstpPortal = UTILITY_PORTALS.find((p) => p.id === 'nstp');

  return (
    <section id="top" className="bg-white text-slate-900">
      {/* Real NUST H-12 Photographic Showcase with Smooth Simultaneous Crossfade */}
      <div className="relative min-h-[540px] w-full overflow-hidden bg-[#002B54] sm:min-h-[520px] lg:min-h-[560px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <ImageWithFallback
              src={currentSlide.image}
              alt={currentSlide.alt}
              className="h-full w-full object-cover object-center"
              fallbackTitle={currentSlide.caption}
            />
          </motion.div>
        </AnimatePresence>

        {/* High-contrast institutional scrim keeping campus architecture legible */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#001429]/95 via-[#001F3F]/72 to-[#002B54]/45 sm:bg-gradient-to-r sm:from-[#001933]/92 sm:via-[#002B54]/68 sm:to-[#002B54]/20"
        />

        <div className="relative z-10 mx-auto flex min-h-[540px] max-w-7xl flex-col justify-end px-4 pt-24 pb-6 sm:min-h-[520px] sm:px-6 sm:pt-16 sm:pb-8 lg:min-h-[560px] lg:pb-12">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <p className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                Defining Futures · Sector H-12, Islamabad
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                National University of Sciences &amp; Technology
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-100 sm:text-base">
                Pakistan’s #1 research university—uniting 18 constituent schools across
                engineering, computing, architecture, business, and applied sciences.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                <button
                  type="button"
                  onClick={onExplorePrograms}
                  className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap shrink-0 rounded-[2px] bg-[#00447C] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#00559B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Explore Programmes</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onOpenAdmissions}
                  className="inline-flex min-h-11 items-center whitespace-nowrap shrink-0 rounded-[2px] border border-white/75 bg-[#002B54]/75 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white hover:text-[#002B54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Apply for Fall 2027
                </button>
                <button
                  type="button"
                  onClick={onExplore3DCampus}
                  className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap shrink-0 rounded-[2px] border border-amber-300/70 bg-[#001D3A]/80 px-4 py-2.5 text-sm font-semibold text-amber-200 transition-all duration-150 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-300 hover:text-[#002B54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  <Box className="h-4 w-4" aria-hidden="true" />
                  <span>3D Campus Twin</span>
                </button>
              </div>
            </motion.div>

            {/* Landmark Photo Switcher */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-full flex-col items-start gap-1.5 lg:items-end"
            >
              <span className="text-xs text-slate-200">{currentSlide.caption}</span>
              <div
                role="group"
                aria-label="Campus photo views"
                className="flex max-w-full flex-wrap border border-white/30 bg-[#001D3A]/85 sm:inline-flex sm:flex-nowrap"
              >
                {HERO_SLIDES.map((slide, idx) => {
                  const active = idx === activeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`whitespace-nowrap px-2.5 py-1.5 text-[11px] font-semibold transition-colors sm:px-3 sm:text-xs ${
                        active
                          ? 'bg-white text-[#002B54]'
                          : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      {slide.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Flush "NUST at a Glance" Institutional Ledger (Zero Floating Overlap) */}
      <div className="border-b border-[#DCE2EA] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-[#DCE2EA] md:grid-cols-4 md:divide-y-0">
          {GLANCE_METRICS.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="px-4 py-4 sm:px-6 sm:py-5"
            >
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2.5">
                <span className="font-display text-2xl font-extrabold tracking-tight text-[#00447C] tabular-nums sm:text-3xl">
                  {item.value}
                </span>
                <span className="font-display text-xs font-bold text-slate-900 sm:text-sm">
                  {item.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Text-Led 3-Lane Audience Index (Zero SaaS Icon Boxes) */}
      <div className="border-b border-[#DCE2EA] bg-[#F5F7FA]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#DCE2EA] md:grid-cols-3 md:divide-x md:divide-y-0">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-6 sm:px-6"
          >
            <div className="text-xs font-bold tracking-wider text-[#C26D10] uppercase">
              01. Prospective Students
            </div>
            <h2 className="mt-1.5 font-display text-base font-bold text-slate-900">
              Degree Programmes, Tuition &amp; NET Merit
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Compare upfront semester tuition, credit hours, and prior closing merit
              across SEECS, SMME, NBS, SADA, and S3H.
            </p>
            <button
              type="button"
              onClick={onExplorePrograms}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00447C] transition-colors hover:text-[#0070CD]"
            >
              <span>Browse Academic Directory</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-6 sm:px-6"
          >
            <div className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
              02. Current Students &amp; Faculty
            </div>
            <h2 className="mt-1.5 font-display text-base font-bold text-slate-900">
              Qalam, Moodle LMS &amp; Academic Calendar
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Direct sign-in gateways for semester enrollment, attendance, GPA
              transcripts, and coursework submissions.
            </p>
            <button
              type="button"
              onClick={() => qalamPortal && onSelectPortal(qalamPortal)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00447C] transition-colors hover:text-[#0070CD]"
            >
              <span>Open Qalam &amp; LMS Gateways</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-6 sm:px-6"
          >
            <div className="text-xs font-bold tracking-wider text-[#0F766E] uppercase">
              03. Industry &amp; Researchers
            </div>
            <h2 className="mt-1.5 font-display text-base font-bold text-slate-900">
              National Science &amp; Technology Park (NSTP)
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Partner with 110+ resident tech firms, ORIC commercialization grants,
              and USPCAS-E research laboratories.
            </p>
            <button
              type="button"
              onClick={() => nstpPortal && onSelectPortal(nstpPortal)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00447C] transition-colors hover:text-[#0070CD]"
            >
              <span>Explore NSTP &amp; R&amp;D</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
