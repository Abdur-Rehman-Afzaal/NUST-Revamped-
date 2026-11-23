import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Moon,
  RotateCw,
  Sun,
  Sunrise,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  CAMPUS_LANDMARKS,
  type CampusLandmarkSpec,
  type LightingPresetId,
} from '../campus3d/nustCampusLayout';
import {
  mountCampus3DScene,
  type Campus3DController,
} from '../campus3d/campusScene';
import type { SchoolCode } from '../data/nustData';

interface Campus3DReplicaProps {
  onSelectSchoolPrograms: (school: SchoolCode) => void;
}

const LIGHTING_OPTIONS: {
  id: LightingPresetId;
  label: string;
  Icon: typeof Sun;
}[] = [
  { id: 'morning', label: 'Morning', Icon: Sun },
  { id: 'golden', label: 'Golden Hour', Icon: Sunrise },
  { id: 'dusk', label: 'Dusk', Icon: Moon },
];

export function Campus3DReplica({
  onSelectSchoolPrograms,
}: Campus3DReplicaProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Campus3DController | null>(null);

  const [activeId, setActiveId] = useState<string>('overview');
  const [hoveredLandmark, setHoveredLandmark] =
    useState<CampusLandmarkSpec | null>(null);
  const [selectedLandmark, setSelectedLandmark] =
    useState<CampusLandmarkSpec | null>(null);
  const [lighting, setLighting] = useState<LightingPresetId>('morning');
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [dockOpen, setDockOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );
  const [webglError, setWebglError] = useState<string | null>(null);

  // Store latest handlers in refs so WebGL scene mounts once and never resets on React state changes
  const hoverCbRef = useRef((lm: CampusLandmarkSpec | null) => {
    setHoveredLandmark(lm);
  });
  const selectCbRef = useRef((lm: CampusLandmarkSpec | null) => {
    setSelectedLandmark(lm);
    setActiveId(lm ? lm.id : 'overview');
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const controller = mountCampus3DScene(container, {
        onHoverLandmark: (lm) => hoverCbRef.current(lm),
        onSelectLandmark: (lm) => selectCbRef.current(lm),
      });
      controllerRef.current = controller;
      return () => {
        controller.dispose();
        controllerRef.current = null;
      };
    } catch (err) {
      setWebglError(
        err instanceof Error ? err.message : '3D WebGL context unavailable'
      );
    }
  }, []);

  // Keyboard shortcut H toggles bottom dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setDockOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleFocus = (id: string) => {
    setActiveId(id);
    controllerRef.current?.focusLandmark(id);
  };

  const handleLighting = (presetId: LightingPresetId) => {
    setLighting(presetId);
    controllerRef.current?.setLightingPreset(presetId);
  };

  const handleToggleAutoOrbit = () => {
    const next = !autoOrbit;
    setAutoOrbit(next);
    controllerRef.current?.setAutoOrbit(next);
  };

  const inspectedLandmark = hoveredLandmark ?? selectedLandmark;

  return (
    <section
      id="campus-3d"
      className="scroll-mt-20 border-t border-b border-[#DCE2EA] bg-[#F5F7FA] py-14 sm:py-16 lg:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-between gap-4 border-b-2 border-[#00447C] pb-5 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
              Interactive 3D Masterplan · Sector H-12, Islamabad
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Explore the NUST Campus in 3D
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Orbit across the 707-acre Sector H-12 architectural replica—from the
              Rectorate Dome and USPCAS-E solar ridge beneath the Margalla Hills to
              SEECS, SMME, NBS, SADA, NSTP, and NUST Lake.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 border border-[#DCE2EA] bg-white px-3 py-1.5 text-[#00447C]">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Drag to Orbit · Scroll to Zoom · Click Any Building</span>
            </span>
          </div>
        </motion.div>

        {/* Unobstructed 3D Viewport Container */}
        <div className="relative mt-6 h-[500px] w-full overflow-hidden border border-[#DCE2EA] bg-[#002B54] sm:h-[580px] lg:h-[640px]">
          {/* Dedicated empty Three.js WebGL Mount */}
          <div
            ref={mountRef}
            data-testid="campus-3d-canvas-host"
            aria-label="Interactive 3D architectural model of NUST Sector H-12 campus"
            className="h-full w-full"
          />

          {webglError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#002B54] p-6 text-center text-white">
              <p className="font-display text-lg font-bold">
                3D Viewport Unavailable
              </p>
              <p className="mt-2 max-w-md text-xs text-slate-300">
                {webglError}
              </p>
            </div>
          )}

          {/* Minimal Top-Left Spec / Selected Landmark Bar (Solid surface, no backdrop-blur over WebGL) */}
          <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-start justify-between gap-3 sm:top-4 sm:right-auto sm:left-4">
            <div className="pointer-events-auto w-full max-w-sm border border-[#DCE2EA] bg-white/95 px-3 py-2 shadow-md sm:max-w-md sm:px-4 sm:py-3">
              {inspectedLandmark ? (
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#C26D10] uppercase sm:text-[11px]">
                    {inspectedLandmark.zone}
                  </div>
                  <h3 className="mt-0.5 font-display text-xs font-extrabold text-[#002B54] sm:text-base">
                    {inspectedLandmark.name}
                  </h3>
                  <p className="mt-1 hidden text-xs leading-relaxed text-slate-600 sm:block">
                    {inspectedLandmark.description}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE2EA] pt-1.5 sm:mt-2 sm:pt-2">
                    <span className="hidden font-mono text-[11px] font-medium text-slate-500 sm:inline">
                      {inspectedLandmark.highlights}
                    </span>
                    {inspectedLandmark.linkedSchool && (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSchoolPrograms(inspectedLandmark.linkedSchool!)
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#00447C] hover:text-[#0070CD]"
                      >
                        <span>View {inspectedLandmark.linkedSchool} Degrees</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#00447C] uppercase sm:text-[11px]">
                    NUST Sector H-12 · Live Architectural Twin
                  </div>
                  <div className="mt-0.5 font-display text-xs font-bold text-slate-900 sm:text-sm">
                    9 Major Precincts · Animated Campus Shuttles · Margalla Ridge
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Bottom Control Dock (Zero Central Occlusion) */}
          <div className="pointer-events-none absolute right-2 bottom-2.5 left-2 flex flex-col items-center sm:right-3 sm:bottom-3 sm:left-3">
            {/* Collapse / Expand Dock Handle */}
            <button
              type="button"
              onClick={() => setDockOpen((prev) => !prev)}
              aria-expanded={dockOpen}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-t-[2px] border border-b-0 border-[#DCE2EA] bg-[#002B54] px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-[#00447C]"
            >
              {dockOpen ? (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hide Controls (H)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Show Campus Controls (H)</span>
                </>
              )}
            </button>

            {/* Unified Compact Horizontal Dock */}
            <motion.div
              initial={false}
              animate={{
                y: dockOpen ? 0 : 20,
                opacity: dockOpen ? 1 : 0,
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full max-w-[1160px] border border-[#DCE2EA] bg-white/95 px-2.5 py-2 shadow-xl ${
                dockOpen ? 'pointer-events-auto' : 'pointer-events-none hidden'
              }`}
            >
              <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                {/* Landmark Fly-To Strip (horizontal scroll on mobile, single row on desktop) */}
                <div
                  role="group"
                  aria-label="Fly to NUST campus building"
                  className="flex flex-nowrap items-center gap-1 overflow-x-auto pb-0.5 xl:pb-0"
                >
                  <button
                    type="button"
                    aria-pressed={activeId === 'overview'}
                    onClick={() => handleFocus('overview')}
                    className={`whitespace-nowrap shrink-0 rounded-[2px] border px-2 py-1 text-[11px] font-semibold transition-colors ${
                      activeId === 'overview'
                        ? 'border-[#00447C] bg-[#00447C] text-white'
                        : 'border-[#DCE2EA] bg-[#F5F7FA] text-slate-700 hover:border-[#00447C]/50 hover:text-[#00447C]'
                    }`}
                  >
                    Whole H-12
                  </button>
                  {CAMPUS_LANDMARKS.map((lm) => {
                    const active = activeId === lm.id;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => handleFocus(lm.id)}
                        className={`whitespace-nowrap shrink-0 rounded-[2px] border px-2 py-1 text-[11px] font-semibold transition-colors ${
                          active
                            ? 'border-[#00447C] bg-[#00447C] text-white'
                            : 'border-[#DCE2EA] bg-[#F5F7FA] text-slate-700 hover:border-[#00447C]/50 hover:text-[#00447C]'
                        }`}
                      >
                        {lm.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Lighting & Auto-Orbit Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE2EA] pt-1.5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-2.5">
                  <div
                    role="group"
                    aria-label="Campus time of day lighting"
                    className="inline-flex border border-[#DCE2EA] bg-[#F5F7FA]"
                  >
                    {LIGHTING_OPTIONS.map(({ id, label, Icon }) => {
                      const active = lighting === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => handleLighting(id)}
                          className={`inline-flex items-center gap-1 whitespace-nowrap px-2 py-1 text-[11px] font-semibold transition-colors ${
                            active
                              ? 'bg-[#002B54] text-white'
                              : 'text-slate-700 hover:bg-white'
                          }`}
                        >
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    aria-pressed={autoOrbit}
                    onClick={handleToggleAutoOrbit}
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-[2px] border px-2 py-1 text-[11px] font-semibold transition-colors ${
                      autoOrbit
                        ? 'border-[#C26D10] bg-[#C26D10] text-white'
                        : 'border-[#DCE2EA] bg-[#F5F7FA] text-slate-700 hover:border-[#00447C]'
                    }`}
                  >
                    <RotateCw className="h-3 w-3" aria-hidden="true" />
                    <span>Auto-Orbit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
