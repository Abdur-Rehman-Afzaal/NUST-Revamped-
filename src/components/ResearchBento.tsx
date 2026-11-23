import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  NUST_MEDIA,
  RESEARCH_SPOTLIGHTS,
  UTILITY_PORTALS,
  type PortalLink,
  type ResearchSpotlight,
} from '../data/nustData';
import { ImageWithFallback } from './ImageWithFallback';

interface ResearchBentoProps {
  onSelectResearch: (item: ResearchSpotlight) => void;
  onSelectPortal: (portal: PortalLink) => void;
}

const QS_METRICS = [
  { discipline: 'Engineering & Technology', rank: 'Top 150', note: 'QS Subject Ranking' },
  { discipline: 'Computer Science & Info Systems', rank: 'Top 250', note: 'QS Subject Ranking' },
  { discipline: 'Electrical & Electronic Engg.', rank: 'Top 200', note: 'QS Subject Ranking' },
  { discipline: 'Overall Global Standing', rank: '#353', note: '#1 in Pakistan' },
];

export function ResearchBento({
  onSelectResearch,
  onSelectPortal,
}: ResearchBentoProps) {
  const nstpPortal = UTILITY_PORTALS.find((p) => p.id === 'nstp');

  return (
    <section
      id="research"
      className="scroll-mt-20 border-t border-[#DCE2EA] bg-[#F5F7FA] py-16 sm:py-20 lg:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-4 border-b-2 border-[#00447C] pb-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
              Research, Rankings &amp; NSTP Commercialisation
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Research &amp; Innovation Ecosystem
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              Connecting NUST H-12 research centers—including USPCAS-E, NCAI, and
              S3H—directly with Pakistan’s flagship National Science &amp; Technology
              Park.
            </p>
          </div>
          {nstpPortal && (
            <button
              type="button"
              onClick={() => onSelectPortal(nstpPortal)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start rounded-[2px] border border-[#00447C] bg-white px-4 py-2 text-sm font-semibold text-[#00447C] transition-colors hover:bg-[#00447C] hover:text-white md:self-auto"
            >
              <span>Explore NSTP Portal</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </motion.div>

        {/* Top Broadsheet Split: Official NSTP Feature + QS Rankings Ledger */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* NSTP Official Feature */}
          <motion.div
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between border border-slate-800 bg-black p-6 text-white sm:p-8 lg:col-span-7"
          >
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                IASP-Certified Special Technology Zone · H-12 Islamabad
              </p>
              <div className="mt-5 flex items-center justify-start border-b border-white/15 pb-5">
                <img
                  src={NUST_MEDIA.nstpLogo}
                  alt="National Science and Technology Park (NSTP) — Defining Innovation"
                  referrerPolicy="no-referrer"
                  className="h-24 w-auto object-contain sm:h-28"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">
                National Science &amp; Technology Park (NSTP)
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Pakistan’s premier university-hosted technology park co-locating
                deep-tech startups, multinational R&amp;D centers, and Hatch 8 / Cube 8
                incubators directly alongside NUST laboratories.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-xs">
              <div>
                <div className="font-mono text-lg font-bold text-white tabular-nums">
                  110+
                </div>
                <div className="text-slate-400">Resident Tech Firms</div>
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-white tabular-nums">
                  PKR 18B+
                </div>
                <div className="text-slate-400">Ecosystem Valuation</div>
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-white tabular-nums">
                  400+
                </div>
                <div className="text-slate-400">Active Patents</div>
              </div>
            </div>
          </motion.div>

          {/* QS Rankings Ledger */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between border border-[#DCE2EA] bg-white p-6 sm:p-8 lg:col-span-5"
          >
            <div>
              <p className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
                Global Benchmark
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
                QS World Rankings 2026–27
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Ranked Pakistan’s #1 university for international research network,
                employer reputation, and engineering citations.
              </p>

              <dl className="mt-6 divide-y divide-[#DCE2EA] border-t border-b border-[#DCE2EA]">
                {QS_METRICS.map((item) => (
                  <div
                    key={item.discipline}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div>
                      <dt className="text-sm font-semibold text-slate-900">
                        {item.discipline}
                      </dt>
                      <dd className="text-xs text-slate-500">{item.note}</dd>
                    </div>
                    <div className="font-mono text-lg font-bold text-[#00447C] tabular-nums">
                      {item.rank}
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
              <span>QS Quacquarelli Symonds Verified</span>
              <span className="font-mono font-semibold text-[#00447C]">
                #1 in Pakistan
              </span>
            </div>
          </motion.div>
        </div>

        {/* Real-Photo NUST Research & Policy Spotlights */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {RESEARCH_SPOTLIGHTS.map((spotlight, idx) => (
            <motion.article
              key={spotlight.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{
                duration: 0.38,
                delay: idx * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col justify-between border border-[#DCE2EA] bg-white transition-shadow duration-200 hover:shadow-lg"
            >
              <div>
                <div className="aspect-[16/10] w-full overflow-hidden border-b border-[#DCE2EA] bg-slate-100">
                  <ImageWithFallback
                    src={spotlight.image}
                    alt={spotlight.imageAlt ?? spotlight.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    fallbackTitle={spotlight.title}
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-[#00447C]">
                    {spotlight.kicker}
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-slate-900">
                    {spotlight.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {spotlight.summary}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#DCE2EA] px-6 py-4">
                <div className="font-mono text-xs font-semibold text-[#C26D10]">
                  {spotlight.impactMetric}
                </div>
                <button
                  type="button"
                  onClick={() => onSelectResearch(spotlight)}
                  aria-label={`Read research brief: ${spotlight.title}`}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#00447C] transition-colors hover:text-[#0070CD]"
                >
                  <span>Read Research Brief</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
