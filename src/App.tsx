import { useEffect, useMemo, useState } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import {
  CAMPUS_EVENTS,
  NET_DEADLINES,
  NEWS_ITEMS,
  PROGRAMS,
  RESEARCH_SPOTLIGHTS,
  UTILITY_PORTALS,
  type DegreeLevel,
  type NewsItem,
  type PortalLink,
  type ProgramItem,
  type ResearchSpotlight,
  type SchoolCode,
} from './data/nustData';
import type { ProgramSortOption, SearchableEntry } from './utils/programs';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Campus3DReplica } from './components/Campus3DReplica';
import { ProgramFinder } from './components/ProgramFinder';
import { ResearchBento } from './components/ResearchBento';
import { NewsEventsHub } from './components/NewsEventsHub';
import { Footer } from './components/Footer';
import {
  AdmissionsModal,
  ContextModal,
  GlobalSearchModal,
  ProgramDetailModal,
} from './components/Modals';

export default function App() {
  // Program Finder state
  const [selectedLevel, setSelectedLevel] = useState<DegreeLevel | 'All'>('All');
  const [selectedSchool, setSelectedSchool] = useState<SchoolCode | 'All'>('All');
  const [programQuery, setProgramQuery] = useState('');
  const [programSort, setProgramSort] = useState<ProgramSortOption>('recommended');

  // Interactive modals & RSVP state
  const [searchOpen, setSearchOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [activePortal, setActivePortal] = useState<PortalLink | null>(null);
  const [activeResearch, setActiveResearch] = useState<ResearchSpotlight | null>(null);
  const [activeNewsItem, setActiveNewsItem] = useState<NewsItem | null>(null);
  const [rsvpIds, setRsvpIds] = useState<string[]>([]);

  // Smooth architectural reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  // Global keyboard shortcut Cmd/Ctrl+K for Global Search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const searchableEntries = useMemo<SearchableEntry[]>(() => {
    const programEntries: SearchableEntry[] = PROGRAMS.map((p) => ({
      id: `prog-${p.id}`,
      type: 'Program',
      title: p.title,
      subtitle: `${p.level} · ${p.school} · ${p.campus}`,
      keywords: `${p.schoolName} ${p.disciplineLabel} ${p.summary}`,
      targetSection: '#programs',
      refId: p.id,
    }));

    const portalEntries: SearchableEntry[] = UTILITY_PORTALS.map((portal) => ({
      id: `port-${portal.id}`,
      type: 'Portal',
      title: `${portal.label} (${portal.audience})`,
      subtitle: portal.shortDesc,
      keywords: `${portal.urlHint} ${portal.details.join(' ')}`,
      targetSection: '#top',
      refId: portal.id,
    }));

    const researchEntries: SearchableEntry[] = RESEARCH_SPOTLIGHTS.map((res) => ({
      id: `res-${res.id}`,
      type: 'Research',
      title: res.title,
      subtitle: `${res.kicker} · ${res.impactMetric}`,
      keywords: `${res.school} ${res.leadInvestigator} ${res.summary}`,
      targetSection: '#research',
      refId: res.id,
    }));

    const newsEntries: SearchableEntry[] = [
      ...NEWS_ITEMS,
      ...NET_DEADLINES,
      ...CAMPUS_EVENTS,
    ].map((item) => ({
      id: `news-${item.id}`,
      type: 'News & Event',
      title: item.title,
      subtitle: `${item.category} · ${item.date}`,
      keywords: `${item.meta} ${item.summary}`,
      targetSection: '#news',
      refId: item.id,
    }));

    return [
      ...programEntries,
      ...portalEntries,
      ...researchEntries,
      ...newsEntries,
    ];
  }, []);

  const handleSelectSearchEntry = (entry: SearchableEntry) => {
    if (entry.type === 'Program') {
      const prog = PROGRAMS.find((p) => p.id === entry.refId);
      if (prog) {
        setSelectedProgram(prog);
        document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (entry.type === 'Portal') {
      if (entry.refId === 'admissions') {
        setAdmissionsOpen(true);
        return;
      }
      const portal = UTILITY_PORTALS.find((p) => p.id === entry.refId);
      if (portal) setActivePortal(portal);
      return;
    }
    if (entry.type === 'Research') {
      const res = RESEARCH_SPOTLIGHTS.find((r) => r.id === entry.refId);
      if (res) setActiveResearch(res);
      return;
    }
    if (entry.type === 'News & Event') {
      document.querySelector('#news')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickFilter = (opts: {
    school?: SchoolCode;
    level?: DegreeLevel;
  }) => {
    setSelectedSchool(opts.school ?? 'All');
    setSelectedLevel(opts.level ?? 'All');
    setProgramQuery('');
  };

  const handleResetFilters = () => {
    setSelectedLevel('All');
    setSelectedSchool('All');
    setProgramQuery('');
    setProgramSort('recommended');
  };

  const handleToggleRsvp = (eventId: string) => {
    setRsvpIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-slate-900">
        {/* Top Architectural Scroll Progress Line */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-[#C26D10]"
        />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#0A1E3D] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>

        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAdmissions={() => setAdmissionsOpen(true)}
          onSelectPortal={(portal) => setActivePortal(portal)}
          onQuickFilter={handleQuickFilter}
        />

        <main id="main-content">
          <HeroSection
            onExplorePrograms={() => {
              document
                .querySelector('#programs')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExplore3DCampus={() => {
              document
                .querySelector('#campus-3d')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenAdmissions={() => setAdmissionsOpen(true)}
            onSelectPortal={(portal) => setActivePortal(portal)}
          />

          <Campus3DReplica
            onSelectSchoolPrograms={(school) => {
              setSelectedSchool(school);
              setSelectedLevel('All');
              setProgramQuery('');
              document
                .querySelector('#programs')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <ProgramFinder
            programs={PROGRAMS}
            selectedLevel={selectedLevel}
            selectedSchool={selectedSchool}
            query={programQuery}
            sortBy={programSort}
            onChangeLevel={setSelectedLevel}
            onChangeSchool={setSelectedSchool}
            onChangeQuery={setProgramQuery}
            onChangeSort={setProgramSort}
            onResetFilters={handleResetFilters}
            onSelectProgram={(program) => setSelectedProgram(program)}
          />

          <ResearchBento
            onSelectResearch={(item) => setActiveResearch(item)}
            onSelectPortal={(portal) => setActivePortal(portal)}
          />

          <NewsEventsHub
            rsvpIds={rsvpIds}
            onToggleRsvp={handleToggleRsvp}
            onOpenAdmissions={() => setAdmissionsOpen(true)}
            onFilterProgramsLevel={(level) => {
              setSelectedLevel(level);
              setSelectedSchool('All');
            }}
            onInspectAnnouncement={(item) => setActiveNewsItem(item)}
          />
        </main>

        <Footer
          onOpenAdmissions={() => setAdmissionsOpen(true)}
          onSelectPortal={(portal) => setActivePortal(portal)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <GlobalSearchModal
          open={searchOpen}
          entries={searchableEntries}
          onClose={() => setSearchOpen(false)}
          onSelectEntry={handleSelectSearchEntry}
        />

        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onOpenAdmissions={() => setAdmissionsOpen(true)}
        />

        <AdmissionsModal
          open={admissionsOpen}
          onClose={() => setAdmissionsOpen(false)}
        />

        <ContextModal
          portal={activePortal}
          research={activeResearch}
          newsItem={activeNewsItem}
          onClose={() => {
            setActivePortal(null);
            setActiveResearch(null);
            setActiveNewsItem(null);
          }}
        />
      </div>
    </MotionConfig>
  );
}
