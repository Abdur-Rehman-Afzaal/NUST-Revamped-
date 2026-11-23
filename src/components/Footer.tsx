import { useState } from 'react';
import { MapPin, Phone, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CAMPUSES,
  NUST_MEDIA,
  UTILITY_PORTALS,
  type PortalLink,
} from '../data/nustData';

interface FooterProps {
  onOpenAdmissions: () => void;
  onSelectPortal: (portal: PortalLink) => void;
  onOpenSearch: () => void;
}

export function Footer({
  onOpenAdmissions,
  onSelectPortal,
  onOpenSearch,
}: FooterProps) {
  const [selectedCampusId, setSelectedCampusId] = useState<string>(CAMPUSES[0].id);
  const activeCampus =
    CAMPUSES.find((c) => c.id === selectedCampusId) ?? CAMPUSES[0];

  return (
    <footer
      id="footer"
      className="scroll-mt-20 bg-[#002B54] text-slate-200 lg:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {/* Top Row: Official NUST Identity & Helplines */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 gap-8 border-b border-white/15 pb-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1">
                <img
                  src={NUST_MEDIA.emblem}
                  alt="NUST Official Emblem"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="font-display text-lg font-extrabold tracking-tight text-white">
                  NUST — Defining Futures
                </div>
                <div className="text-xs text-slate-300">
                  National University of Sciences &amp; Technology
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Chartered in 1991, NUST unites 18 constituent schools and colleges across
              five Pakistani cities under a single standard of merit, research rigor,
              and national service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="border border-white/20 bg-[#00447C]/55 p-5 transition-colors hover:border-white/40">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Admissions &amp; NET Helpline</span>
              </div>
              <div className="mt-2 font-mono text-lg font-bold text-white tabular-nums">
                +92-51-9085-1000
              </div>
              <p className="mt-1 text-xs text-slate-200">
                admissions@nust.edu.pk · Mon–Fri, 09:00–17:00 PKT
              </p>
            </div>

            <div className="border border-white/20 bg-[#00447C]/55 p-5 transition-colors hover:border-white/40">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-100 uppercase">
                <ShieldAlert className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>24/7 Medical &amp; Anti-Harassment Desk</span>
              </div>
              <div className="mt-2 font-mono text-lg font-bold text-white tabular-nums">
                +92-51-9085-1999
              </div>
              <p className="mt-1 text-xs text-slate-200">
                H-12 Medical Center, Security &amp; Student Helpline
              </p>
            </div>
          </div>
        </motion.div>

        {/* Middle Row: 5-City Campus Directory + nust.edu.pk Quick Links */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/15 py-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">
              National Campuses (5 Cities)
            </h3>
            <div
              role="tablist"
              aria-label="NUST Regional Campuses"
              className="mt-4 flex flex-wrap gap-2"
            >
              {CAMPUSES.map((campus) => {
                const active = campus.id === selectedCampusId;
                return (
                  <button
                    key={campus.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCampusId(campus.id)}
                    className={`whitespace-nowrap shrink-0 rounded-[2px] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'border-white bg-white text-[#002B54]'
                        : 'border-white/25 bg-[#00447C]/50 text-slate-100 hover:border-white/60'
                    }`}
                  >
                    {campus.city}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 min-h-[146px] border border-white/20 bg-[#00447C]/40 p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCampus.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3"
                >
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-amber-300"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      {activeCampus.campusName} — {activeCampus.city}
                    </h4>
                    <p className="mt-1 text-sm text-slate-200">{activeCampus.address}</p>
                    <p className="mt-2 text-xs text-slate-300">
                      <span className="font-semibold text-white">Institutions: </span>
                      {activeCampus.schoolsHosted}
                    </p>
                    <p className="mt-2 font-mono text-xs text-amber-300 tabular-nums">
                      {activeCampus.helplineLabel}: {activeCampus.phone}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
            <div>
              <h3 className="font-display text-xs font-bold tracking-wider text-slate-300 uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href="#programs" className="text-slate-100 hover:text-amber-300">
                    Program &amp; Fee Finder
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmissions}
                    className="text-left text-slate-100 hover:text-amber-300"
                  >
                    NET Schedule &amp; Merit
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdmissions}
                    className="text-left text-slate-100 hover:text-amber-300"
                  >
                    Scholarships &amp; Aid
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenSearch}
                    className="text-left text-slate-100 hover:text-amber-300"
                  >
                    Search NUST
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xs font-bold tracking-wider text-slate-300 uppercase">
                Portals &amp; Services
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {UTILITY_PORTALS.map((portal) => (
                  <li key={portal.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (portal.id === 'admissions') {
                          onOpenAdmissions();
                        } else {
                          onSelectPortal(portal);
                        }
                      }}
                      className="text-left text-slate-100 hover:text-amber-300"
                    >
                      {portal.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xs font-bold tracking-wider text-slate-300 uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-100 hover:text-amber-300"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-100 hover:text-amber-300"
                  >
                    X (Official)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-100 hover:text-amber-300"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@nust.edu.pk"
                    className="text-slate-100 hover:text-amber-300"
                  >
                    info@nust.edu.pk
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-slate-300 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} National University of Sciences &amp;
            Technology (NUST), Sector H-12, Islamabad.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#top" className="hover:text-white">
              Back to Top
            </a>
            <a href="#programs" className="hover:text-white">
              Fee Disclosure
            </a>
            <a href="#research" className="hover:text-white">
              NSTP &amp; ORIC
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
