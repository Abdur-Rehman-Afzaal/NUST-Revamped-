import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type NewsItem,
  type PortalLink,
  type ProgramItem,
  type ResearchSpotlight,
} from '../data/nustData';
import {
  calculateMeritAggregate,
  formatPKR,
  searchUniversityPortal,
  type SearchableEntry,
} from '../utils/programs';

const BACKDROP_TRANSITION = { duration: 0.18 };
const DIALOG_TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

/* 1. Global Search Modal */
interface GlobalSearchModalProps {
  open: boolean;
  entries: SearchableEntry[];
  onClose: () => void;
  onSelectEntry: (entry: SearchableEntry) => void;
}

export function GlobalSearchModal({
  open,
  entries,
  onClose,
  onSelectEntry,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const results = searchUniversityPortal(query, entries, 8);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search NUST"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-16 backdrop-blur-xs sm:pt-24"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={DIALOG_TRANSITION}
            className="w-full max-w-2xl overflow-hidden border border-[#DCE2EA] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#DCE2EA] px-4 py-3">
              <Search className="h-5 w-5 text-[#00447C]" aria-hidden="true" />
              <label htmlFor="global-search-input" className="sr-only">
                Search programs, schools, portals, and research
              </label>
              <input
                ref={inputRef}
                id="global-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programmes (BS AI, BBA), schools (SEECS), portals (Qalam, NSTP)..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search dialog"
                className="inline-flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-[#F5F7FA] hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-slate-600">
                  No matching records found for “{query}”. Try searching for “SEECS”,
                  “Architecture”, “Qalam”, or “NSTP”.
                </div>
              ) : (
                <ul className="divide-y divide-[#DCE2EA]">
                  {results.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectEntry(entry);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between gap-4 px-3.5 py-3 text-left transition-colors hover:bg-[#F5F7FA]"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#00447C]">
                            {entry.type}
                          </div>
                          <div className="mt-0.5 font-display text-sm font-bold text-slate-900">
                            {entry.title}
                          </div>
                          <div className="text-xs text-slate-600">{entry.subtitle}</div>
                        </div>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-[#00447C]"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 2. Program Detail & Fee Modal */
interface ProgramDetailModalProps {
  program: ProgramItem | null;
  onClose: () => void;
  onOpenAdmissions: () => void;
}

export function ProgramDetailModal({
  program,
  onClose,
  onOpenAdmissions,
}: ProgramDetailModalProps) {
  useEffect(() => {
    if (!program) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [program, onClose]);

  return (
    <AnimatePresence>
      {program && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${program.title} curriculum and fee breakdown`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={DIALOG_TRANSITION}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#DCE2EA] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#00447C] pb-4">
              <div>
                <p className="text-xs font-bold text-[#00447C]">
                  {program.level} · {program.schoolName}
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                  {program.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close program details"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#DCE2EA] text-slate-600 hover:bg-[#F5F7FA]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              {program.summary}
            </p>

            {/* Fee & Entry Test Ledger */}
            <dl className="mt-6 grid grid-cols-2 gap-4 border border-[#DCE2EA] bg-[#F5F7FA] p-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-slate-500">Tuition / Semester</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-[#00447C] tabular-nums">
                  {formatPKR(program.tuitionPerSemesterPKR)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">One-Time Admission</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {formatPKR(program.admissionFeePKR)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Est. Total Degree</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {formatPKR(
                    program.tuitionPerSemesterPKR * (program.durationYears * 2) +
                      program.admissionFeePKR
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Credits &amp; Intake</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-slate-900 tabular-nums">
                  {program.creditHours} Cr · {program.intake}
                </dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2 text-sm">
              <div>
                <span className="font-semibold text-slate-900">Entry Test Pattern: </span>
                <span className="text-slate-700">{program.netPattern}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Prior Closing Merit: </span>
                <span className="font-mono font-semibold text-[#C26D10] tabular-nums">
                  {program.meritCutoffLastYear}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-display text-sm font-bold text-[#00447C]">
                Programme Highlights
              </h3>
              <ul className="mt-2.5 space-y-2">
                {program.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#00447C]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-[#DCE2EA] pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[2px] border border-[#DCE2EA] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#F5F7FA]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmissions();
                }}
                className="inline-flex items-center gap-2 rounded-[2px] bg-[#00447C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#002B54]"
              >
                <span>Estimate NET Merit &amp; Apply</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 3. Admissions, NET Schedule & Merit Calculator Modal */
interface AdmissionsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdmissionsModal({ open, onClose }: AdmissionsModalProps) {
  const [netScore, setNetScore] = useState('152');
  const [fscMarks, setFscMarks] = useState('960');
  const [fscTotal, setFscTotal] = useState('1100');
  const [matricMarks, setMatricMarks] = useState('990');
  const [matricTotal, setMatricTotal] = useState('1100');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const hasBlankInput =
    netScore.trim() === '' ||
    fscMarks.trim() === '' ||
    fscTotal.trim() === '' ||
    matricMarks.trim() === '' ||
    matricTotal.trim() === '';

  const merit = hasBlankInput
    ? {
        valid: false as const,
        error: 'Enter scores for NET, FSc / HSSC, and Matric / SSC to compute aggregate.',
        aggregatePercent: 0,
        netContribution: 0,
        fscContribution: 0,
        matricContribution: 0,
        competitivenessBand: 'Retake Recommended (Aim for 135+ NET)' as const,
      }
    : calculateMeritAggregate({
        netScore: Number(netScore),
        fscMarks: Number(fscMarks),
        fscTotal: Number(fscTotal),
        matricMarks: Number(matricMarks),
        matricTotal: Number(matricTotal),
      });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="NUST Fall 2027 Admissions and NET Merit Estimator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={DIALOG_TRANSITION}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#DCE2EA] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#00447C] pb-4">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#C26D10] uppercase">
                  Fall 2027 Intake · ugadmissions.nust.edu.pk
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                  Admissions &amp; NET Merit Estimator
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admissions dialog"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#DCE2EA] text-slate-600 hover:bg-[#F5F7FA]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Merit Aggregate Calculator */}
            <div className="mt-6 border border-[#DCE2EA] bg-[#F5F7FA] p-5">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-[#00447C]" aria-hidden="true" />
                <h3 className="font-display text-base font-bold text-[#00447C]">
                  Official Merit Formula (75% NET · 15% FSc · 10% Matric)
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="net-score-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    NET Score (out of 200)
                  </label>
                  <input
                    id="net-score-input"
                    type="number"
                    min={0}
                    max={200}
                    value={netScore}
                    onChange={(e) => setNetScore(e.target.value)}
                    className="mt-1 h-10 w-full rounded-[2px] border border-[#DCE2EA] bg-white px-3 font-mono text-sm text-slate-900 focus:border-[#00447C] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fsc-marks-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    FSc / HSSC Marks
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      id="fsc-marks-input"
                      type="number"
                      min={0}
                      value={fscMarks}
                      onChange={(e) => setFscMarks(e.target.value)}
                      className="h-10 w-full rounded-[2px] border border-[#DCE2EA] bg-white px-2.5 font-mono text-sm text-slate-900 focus:border-[#00447C] focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">/</span>
                    <input
                      aria-label="FSc total marks"
                      type="number"
                      min={1}
                      value={fscTotal}
                      onChange={(e) => setFscTotal(e.target.value)}
                      className="h-10 w-20 rounded-[2px] border border-[#DCE2EA] bg-white px-2 font-mono text-sm text-slate-700 focus:border-[#00447C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="matric-marks-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Matric / SSC Marks
                  </label>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      id="matric-marks-input"
                      type="number"
                      min={0}
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(e.target.value)}
                      className="h-10 w-full rounded-[2px] border border-[#DCE2EA] bg-white px-2.5 font-mono text-sm text-slate-900 focus:border-[#00447C] focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">/</span>
                    <input
                      aria-label="Matric total marks"
                      type="number"
                      min={1}
                      value={matricTotal}
                      onChange={(e) => setMatricTotal(e.target.value)}
                      className="h-10 w-20 rounded-[2px] border border-[#DCE2EA] bg-white px-2 font-mono text-sm text-slate-700 focus:border-[#00447C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {merit.valid ? (
                <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#DCE2EA] pt-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      Estimated NUST Aggregate
                    </div>
                    <div
                      data-testid="merit-result"
                      className="font-mono text-2xl font-extrabold text-[#00447C] tabular-nums"
                    >
                      {merit.aggregatePercent.toFixed(2)}%
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 tabular-nums">
                      NET {merit.netContribution}% + FSc {merit.fscContribution}% + Matric{' '}
                      {merit.matricContribution}%
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-semibold text-[#00447C]">
                      {merit.competitivenessBand}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Best NET score across Series I–IV is retained.
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  role="alert"
                  className="mt-4 border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-800"
                >
                  {merit.error}
                </div>
              )}
            </div>

            {/* Key Admission Milestones */}
            <div className="mt-6">
              <h3 className="font-display text-sm font-bold text-[#00447C]">
                NET 2027 Key Schedule &amp; Aid
              </h3>
              <ul className="mt-2.5 divide-y divide-[#DCE2EA] text-sm text-slate-700">
                <li className="flex justify-between py-2">
                  <span>NET Series-I Deadline</span>
                  <span className="font-mono font-semibold text-[#C26D10] tabular-nums">
                    Dec 08, 2026
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>NET Series-II Window Opens</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    Jan 25, 2027
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Need-Based Financial Aid Form</span>
                  <span className="font-mono font-semibold text-[#00447C]">
                    Integrated in Online Application
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#DCE2EA] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[2px] bg-[#00447C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#002B54]"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* 4. Portal / Research / Announcement Info Modal */
interface ContextModalProps {
  portal: PortalLink | null;
  research: ResearchSpotlight | null;
  newsItem: NewsItem | null;
  onClose: () => void;
}

export function ContextModal({
  portal,
  research,
  newsItem,
  onClose,
}: ContextModalProps) {
  useEffect(() => {
    if (!portal && !research && !newsItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [portal, research, newsItem, onClose]);

  const isOpen = Boolean(portal || research || newsItem);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={portal?.label ?? research?.title ?? newsItem?.title ?? 'Details'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={DIALOG_TRANSITION}
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto border border-[#DCE2EA] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#00447C] pb-4">
              <div>
                <p className="text-xs font-bold text-[#00447C] uppercase">
                  {portal
                    ? `${portal.audience} Portal`
                    : research
                    ? research.kicker
                    : newsItem?.meta}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {portal?.label ?? research?.title ?? newsItem?.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="inline-flex h-9 w-9 items-center justify-center border border-[#DCE2EA] text-slate-600 hover:bg-[#F5F7FA]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {portal && (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-relaxed text-slate-700">
                  {portal.shortDesc}
                </p>
                <div className="border border-[#DCE2EA] bg-[#F5F7FA] px-3.5 py-2.5 font-mono text-xs text-slate-700">
                  Official Endpoint: {portal.urlHint}
                </div>
                <ul className="space-y-2">
                  {portal.details.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#00447C]"
                        aria-hidden="true"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-3 border-t border-[#DCE2EA] pt-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-[2px] bg-[#00447C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002B54]"
                  >
                    <span>{portal.actionLabel}</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {research && (
              <div className="mt-5 space-y-4">
                <div className="text-xs font-medium text-slate-600">
                  {research.school} · Lead: {research.leadInvestigator}
                </div>
                <div className="border border-[#DCE2EA] bg-[#F5F7FA] p-3.5 font-mono text-xs font-semibold text-[#C26D10]">
                  Measured Outcome: {research.impactMetric}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {research.abstract}
                </p>
                <div className="flex justify-end border-t border-[#DCE2EA] pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[2px] bg-[#00447C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002B54]"
                  >
                    Close Brief
                  </button>
                </div>
              </div>
            )}

            {newsItem && (
              <div className="mt-5 space-y-4">
                <div className="font-mono text-xs text-slate-500">{newsItem.date}</div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {newsItem.summary}
                </p>
                <div className="flex justify-end border-t border-[#DCE2EA] pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[2px] bg-[#00447C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002B54]"
                  >
                    Close Notice
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
