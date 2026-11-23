import { ArrowRight, RotateCcw, Search } from 'lucide-react';
import { motion } from 'motion/react';
import {
  type DegreeLevel,
  type ProgramItem,
  type SchoolCode,
} from '../data/nustData';
import {
  filterPrograms,
  formatPKR,
  type ProgramSortOption,
} from '../utils/programs';

interface ProgramFinderProps {
  programs: ProgramItem[];
  selectedLevel: DegreeLevel | 'All';
  selectedSchool: SchoolCode | 'All';
  query: string;
  sortBy: ProgramSortOption;
  onChangeLevel: (level: DegreeLevel | 'All') => void;
  onChangeSchool: (school: SchoolCode | 'All') => void;
  onChangeQuery: (query: string) => void;
  onChangeSort: (sort: ProgramSortOption) => void;
  onResetFilters: () => void;
  onSelectProgram: (program: ProgramItem) => void;
}

const LEVELS: (DegreeLevel | 'All')[] = ['All', 'Undergraduate', 'MS', 'PhD'];

const SCHOOLS: { code: SchoolCode | 'All'; label: string }[] = [
  { code: 'All', label: 'All Schools' },
  { code: 'SEECS', label: 'Computing (SEECS)' },
  { code: 'SMME', label: 'Engineering (SMME)' },
  { code: 'NBS', label: 'Business (NBS)' },
  { code: 'SADA', label: 'Architecture (SADA)' },
  { code: 'S3H', label: 'Social Sciences (S3H)' },
];

export function ProgramFinder({
  programs,
  selectedLevel,
  selectedSchool,
  query,
  sortBy,
  onChangeLevel,
  onChangeSchool,
  onChangeQuery,
  onChangeSort,
  onResetFilters,
  onSelectProgram,
}: ProgramFinderProps) {
  const filtered = filterPrograms(programs, {
    level: selectedLevel,
    school: selectedSchool,
    query,
    sortBy,
  });

  return (
    <section
      id="programs"
      className="scroll-mt-20 bg-white py-16 sm:py-20 lg:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-4 border-b-2 border-[#00447C] pb-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
              Institutions &amp; Academic Programmes
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Program, School &amp; Fee Directory
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              Compare accredited degrees side-by-side with published per-semester
              tuition, credit hours, and prior closing merit cutoffs.
            </p>
          </div>
          <div className="font-mono text-sm font-semibold text-[#00447C] tabular-nums">
            Showing {filtered.length} of {programs.length} programmes
          </div>
        </motion.div>

        {/* Filter Controls */}
        <div className="mt-7 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Level Segmented Tabs */}
            <div
              role="group"
              aria-label="Filter by degree level"
              className="inline-flex flex-wrap items-center border border-[#DCE2EA] bg-[#F5F7FA]"
            >
              {LEVELS.map((level) => {
                const active = selectedLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChangeLevel(level)}
                    className={`min-h-10 whitespace-nowrap shrink-0 px-4 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#00447C] sm:text-sm ${
                      active
                        ? 'bg-[#00447C] text-white'
                        : 'text-slate-700 hover:bg-white hover:text-[#00447C]'
                    }`}
                  >
                    {level === 'All' ? 'All Levels' : level}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-72">
                <label htmlFor="program-search-input" className="sr-only">
                  Filter programs by keyword
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="program-search-input"
                  type="search"
                  value={query}
                  onChange={(e) => onChangeQuery(e.target.value)}
                  placeholder="Keyword (AI, BBA, PhD)..."
                  className="h-10 w-full rounded-[2px] border border-[#DCE2EA] bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00447C] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="program-sort-select"
                  className="whitespace-nowrap text-xs font-semibold text-slate-600"
                >
                  Sort by
                </label>
                <select
                  id="program-sort-select"
                  value={sortBy}
                  onChange={(e) => onChangeSort(e.target.value as ProgramSortOption)}
                  className="h-10 rounded-[2px] border border-[#DCE2EA] bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#00447C] focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="tuition-asc">Tuition: Low to High</option>
                  <option value="duration-asc">Duration: Shortest</option>
                </select>
              </div>
            </div>
          </div>

          {/* School Discipline Tabs */}
          <div
            role="group"
            aria-label="Filter by constituent school"
            className="flex flex-wrap items-center gap-2 border-b border-[#DCE2EA] pb-4"
          >
            {SCHOOLS.map((school) => {
              const active = selectedSchool === school.code;
              return (
                <button
                  key={school.code}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeSchool(school.code)}
                  className={`min-h-9 whitespace-nowrap shrink-0 rounded-[2px] border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#00447C] sm:text-sm ${
                    active
                      ? 'border-[#00447C] bg-[#00447C]/8 text-[#00447C]'
                      : 'border-[#DCE2EA] bg-white text-slate-700 hover:border-[#00447C]/50 hover:text-[#00447C]'
                  }`}
                >
                  {school.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairline Tabular Academic Directory */}
        {filtered.length === 0 ? (
          <div className="mt-8 border border-[#DCE2EA] bg-[#F5F7FA] px-6 py-12 text-center">
            <h3 className="font-display text-lg font-bold text-slate-900">
              No programmes match your selected filters
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Broaden the degree level, select All Schools, or clear your keyword
              filter.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-[2px] bg-[#00447C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#002B54]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div data-testid="program-grid" className="mt-6">
            {/* Desktop Institutional Table */}
            <div className="hidden overflow-x-auto border border-[#DCE2EA] md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#DCE2EA] bg-[#F5F7FA] text-xs font-bold tracking-wider text-slate-600 uppercase">
                    <th scope="col" className="px-5 py-3.5">
                      Programme &amp; School
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Level
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Duration &amp; Credits
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Tuition / Semester
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Prior Merit Cutoff
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE2EA] bg-white">
                  {filtered.map((program) => (
                    <tr
                      key={program.id}
                      className="transition-colors duration-100 hover:bg-[#F5F7FA]/75"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="font-display text-base font-bold text-[#00447C]">
                          {program.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-600">
                          {program.school} · {program.campus} · {program.intake}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm font-medium text-slate-800 whitespace-nowrap">
                        {program.level}
                      </td>
                      <td className="px-4 py-4 align-top font-mono text-sm text-slate-800 tabular-nums whitespace-nowrap">
                        {program.durationYears} Yrs · {program.creditHours} Cr
                      </td>
                      <td className="px-4 py-4 align-top font-mono text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatPKR(program.tuitionPerSemesterPKR)}
                      </td>
                      <td className="px-4 py-4 align-top font-mono text-sm font-semibold text-[#C26D10] tabular-nums whitespace-nowrap">
                        {program.meritCutoffLastYear}
                      </td>
                      <td className="px-5 py-4 text-right align-top whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectProgram(program)}
                          aria-label={`View curriculum and fees for ${program.title}`}
                          className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#00447C] px-3 py-1.5 text-xs font-semibold text-[#00447C] transition-colors hover:bg-[#00447C] hover:text-white focus-visible:outline-2 focus-visible:outline-[#00447C]"
                        >
                          <span>Curriculum &amp; Fees</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Hairline List */}
            <div className="divide-y divide-[#DCE2EA] border border-[#DCE2EA] md:hidden">
              {filtered.map((program) => (
                <article key={program.id} className="bg-white p-4">
                  <div className="text-xs font-semibold text-[#00447C]">
                    {program.level} · {program.school} · {program.campus}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
                    {program.title}
                  </h3>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-slate-500">Semester Tuition</dt>
                      <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                        {formatPKR(program.tuitionPerSemesterPKR)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Duration &amp; Cutoff</dt>
                      <dd className="font-mono font-semibold text-[#C26D10] tabular-nums">
                        {program.durationYears} Yrs · {program.meritCutoffLastYear}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => onSelectProgram(program)}
                    aria-label={`View curriculum and fees for ${program.title}`}
                    className="mt-3 inline-flex min-h-10 w-full items-center justify-between rounded-[2px] border border-[#00447C] px-3 py-2 text-xs font-semibold text-[#00447C]"
                  >
                    <span>Curriculum &amp; Fee Breakdown</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
