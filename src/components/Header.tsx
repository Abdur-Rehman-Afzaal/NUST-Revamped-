import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MEGA_MENUS,
  NUST_MEDIA,
  UTILITY_PORTALS,
  type DegreeLevel,
  type PortalLink,
  type SchoolCode,
} from '../data/nustData';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAdmissions: () => void;
  onSelectPortal: (portal: PortalLink) => void;
  onQuickFilter: (opts: { school?: SchoolCode; level?: DegreeLevel }) => void;
}

export function Header({
  onOpenSearch,
  onOpenAdmissions,
  onSelectPortal,
  onQuickFilter,
}: HeaderProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordionId, setMobileAccordionId] = useState<string | null>('institutions');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeMegaMenu = MEGA_MENUS.find((m) => m.id === openMenuId) ?? null;

  const handleMegaLinkClick = (link: {
    href: string;
    filterSchool?: SchoolCode;
    filterLevel?: DegreeLevel;
    modalAction?: 'admissions' | 'search' | 'portal-nstp' | 'portal-qalam';
  }) => {
    setOpenMenuId(null);
    setMobileOpen(false);

    if (link.modalAction === 'admissions') {
      onOpenAdmissions();
      return;
    }
    if (link.modalAction === 'search') {
      onOpenSearch();
      return;
    }
    if (link.modalAction === 'portal-nstp') {
      const nstp = UTILITY_PORTALS.find((p) => p.id === 'nstp');
      if (nstp) onSelectPortal(nstp);
      return;
    }
    if (link.modalAction === 'portal-qalam') {
      const qalam = UTILITY_PORTALS.find((p) => p.id === 'qalam');
      if (qalam) onSelectPortal(qalam);
      return;
    }

    if (link.filterSchool || link.filterLevel) {
      onQuickFilter({
        school: link.filterSchool,
        level: link.filterLevel,
      });
    }

    const target = document.querySelector(link.href);
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-[#DCE2EA] bg-white"
    >
      {/* Tier 1: Official NUST Utility Bar (Desktop & Tablet) */}
      <div className="hidden bg-[#002B54] text-slate-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-xs">
          <div className="flex items-center gap-6 overflow-x-auto">
            {UTILITY_PORTALS.map((portal) => (
              <button
                key={portal.id}
                type="button"
                onClick={() => {
                  if (portal.id === 'admissions') {
                    onOpenAdmissions();
                  } else {
                    onSelectPortal(portal);
                  }
                }}
                className="whitespace-nowrap shrink-0 font-medium text-slate-100 transition-colors duration-150 hover:text-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                {portal.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href="#campus-3d"
              className="whitespace-nowrap shrink-0 font-semibold text-amber-300 transition-colors hover:text-white"
            >
              3D Campus Twin
            </a>
            <a
              href="#footer"
              className="whitespace-nowrap shrink-0 text-slate-200 transition-colors hover:text-white"
            >
              Campuses &amp; Directory
            </a>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open Global Search"
              className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-[2px] border border-white/25 bg-[#00447C] px-3 py-1 text-xs font-medium text-white transition-colors duration-150 hover:border-white/50 hover:bg-[#00559B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <Search className="h-3.5 w-3.5 text-slate-200" aria-hidden="true" />
              <span>Search NUST</span>
              <kbd className="hidden font-mono text-[10px] text-slate-200 lg:inline-block">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Official NUST Main Header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px]">
        {/* Brand Wordmark with Official NUST Emblem */}
        <a
          href="#top"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00447C]"
        >
          <img
            src={NUST_MEDIA.emblem}
            alt="National University of Sciences and Technology official emblem"
            referrerPolicy="no-referrer"
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="font-display text-xl font-extrabold tracking-tight text-[#00447C]">
            NUST
          </span>
        </a>

        {/* Primary Mega-Menu Navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {MEGA_MENUS.map((menu) => {
            const isOpen = openMenuId === menu.id;
            return (
              <button
                key={menu.id}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenMenuId(isOpen ? null : menu.id)}
                className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 border-b-2 px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00447C] ${
                  isOpen
                    ? 'border-[#00447C] text-[#00447C]'
                    : 'border-transparent text-slate-700 hover:border-[#DCE2EA] hover:text-[#00447C]'
                }`}
              >
                <span>{menu.label}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    isOpen ? 'rotate-180 text-[#00447C]' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search programs, schools, and portals"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#DCE2EA] text-slate-700 transition-colors hover:bg-[#F5F7FA] md:hidden"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onOpenAdmissions}
            className="hidden whitespace-nowrap shrink-0 rounded-[2px] bg-[#00447C] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#002B54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00447C] sm:inline-flex"
          >
            Apply Fall 2027
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] border border-[#DCE2EA] text-slate-800 transition-colors hover:bg-[#F5F7FA] lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Mega-Menu Panel */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            key={activeMegaMenu.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hidden border-t border-[#DCE2EA] bg-white shadow-lg lg:block"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-8">
              <div className="col-span-8 grid grid-cols-2 gap-8">
                {activeMegaMenu.columns.map((column) => (
                  <div key={column.heading}>
                    <h2 className="mb-3 border-b border-[#DCE2EA] pb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                      {column.heading}
                    </h2>
                    <ul className="space-y-1">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <button
                            type="button"
                            onClick={() => handleMegaLinkClick(link)}
                            className="group w-full px-2 py-2 text-left transition-colors duration-150 hover:bg-[#F5F7FA] focus-visible:outline-2 focus-visible:outline-[#00447C]"
                          >
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-[#00447C]">
                              {link.label}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-600">
                              {link.description}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="col-span-4 flex flex-col justify-between border border-[#DCE2EA] bg-[#F5F7FA] p-6">
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#00447C] uppercase">
                    {activeMegaMenu.featuredCallout.kicker}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                    {activeMegaMenu.featuredCallout.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {activeMegaMenu.featuredCallout.description}
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      handleMegaLinkClick({
                        href: activeMegaMenu.featuredCallout.href,
                        modalAction: activeMegaMenu.featuredCallout.modalAction,
                      })
                    }
                    className="rounded-[2px] bg-[#00447C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#002B54]"
                  >
                    {activeMegaMenu.featuredCallout.ctaLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[#DCE2EA] bg-white px-4 py-5 lg:hidden"
          >
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenAdmissions();
              }}
              className="flex min-h-11 w-full items-center justify-center rounded-[2px] bg-[#00447C] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Apply for Fall 2027 Admissions
            </button>
          </div>

          <div className="mb-5 border-b border-[#DCE2EA] pb-4">
            <p className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              University Portals
            </p>
            <div className="grid grid-cols-2 gap-2">
              {UTILITY_PORTALS.map((portal) => (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (portal.id === 'admissions') {
                      onOpenAdmissions();
                    } else {
                      onSelectPortal(portal);
                    }
                  }}
                  className="flex min-h-11 items-center justify-between border border-[#DCE2EA] bg-[#F5F7FA] px-3 py-2 text-left text-xs font-semibold text-[#00447C]"
                >
                  <span>{portal.label}</span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {MEGA_MENUS.map((menu) => {
              const expanded = mobileAccordionId === menu.id;
              return (
                <div key={menu.id} className="border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setMobileAccordionId(expanded ? null : menu.id)
                    }
                    className="flex min-h-11 w-full items-center justify-between py-2 text-left text-sm font-bold text-[#00447C]"
                  >
                    <span>{menu.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded && (
                    <div className="space-y-3 pb-2 pl-2">
                      {menu.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="mb-1 text-xs font-semibold text-slate-500">
                            {col.heading}
                          </p>
                          <ul className="space-y-1">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <button
                                  type="button"
                                  onClick={() => handleMegaLinkClick(link)}
                                  className="min-h-10 w-full py-1.5 text-left text-sm font-medium text-slate-800 hover:text-[#00447C]"
                                >
                                  {link.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
