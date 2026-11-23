import { ArrowRight, CalendarCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';
import {
  CAMPUS_EVENTS,
  NET_DEADLINES,
  NEWS_ITEMS,
  type DegreeLevel,
  type NewsItem,
} from '../data/nustData';

interface NewsEventsHubProps {
  rsvpIds: string[];
  onToggleRsvp: (eventId: string) => void;
  onOpenAdmissions: () => void;
  onFilterProgramsLevel: (level: DegreeLevel) => void;
  onInspectAnnouncement: (item: NewsItem) => void;
}

export function NewsEventsHub({
  rsvpIds,
  onToggleRsvp,
  onOpenAdmissions,
  onFilterProgramsLevel,
  onInspectAnnouncement,
}: NewsEventsHubProps) {
  return (
    <section
      id="news"
      className="scroll-mt-20 border-t border-[#DCE2EA] bg-white py-16 sm:py-20 lg:scroll-mt-28"
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
              University Dispatch &amp; What’s On
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">
              Top Stories, NET Deadlines &amp; Events
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate-600">
              Separated into official announcements, upcoming NUST Entry Test (NET)
              milestones, and H-12 campus symposia.
            </p>
          </div>
          {rsvpIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#00447C] tabular-nums"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              <span>{rsvpIds.length} event RSVP saved</span>
            </motion.div>
          )}
        </motion.div>

        {/* 3-Column Broadsheet Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Column 1: Top Stories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="border-b-2 border-[#00447C] pb-3 font-display text-base font-bold text-[#00447C]">
              01. Top Stories &amp; Notices
            </h3>
            <div className="divide-y divide-[#DCE2EA]">
              {NEWS_ITEMS.map((item) => (
                <article key={item.id} className="py-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-medium text-slate-700 tabular-nums">
                      {item.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.meta}</span>
                  </div>
                  <h4 className="mt-2 font-display text-base font-bold leading-snug text-slate-900">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => onInspectAnnouncement(item)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00447C] hover:text-[#0070CD]"
                  >
                    <span>{item.venueOrAction}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Admissions & NET Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="border-b-2 border-[#C26D10] pb-3 font-display text-base font-bold text-[#C26D10]">
              02. Admissions &amp; NET Schedule
            </h3>
            <div className="divide-y divide-[#DCE2EA]">
              {NET_DEADLINES.map((item) => (
                <article key={item.id} className="py-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#C26D10] tabular-nums">
                      {item.date}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-slate-600">{item.meta}</span>
                  </div>
                  <h4 className="mt-2 font-display text-base font-bold leading-snug text-slate-900">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.summary}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.id === 'net-ms-phd') {
                        onFilterProgramsLevel('MS');
                        document
                          .querySelector('#programs')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onOpenAdmissions();
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#C26D10] hover:text-[#00447C]"
                  >
                    <span>{item.venueOrAction}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </motion.div>

          {/* Column 3: What's On (Campus Events) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="border-b-2 border-slate-800 pb-3 font-display text-base font-bold text-slate-900">
              03. What’s On — Campus Events
            </h3>
            <div className="divide-y divide-[#DCE2EA]">
              {CAMPUS_EVENTS.map((item) => {
                const isRsvped = rsvpIds.includes(item.id);
                return (
                  <article key={item.id} className="py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-[#00447C] tabular-nums">
                        {item.date}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.meta}</span>
                    </div>
                    <h4 className="mt-2 font-display text-base font-bold leading-snug text-slate-900">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-500">
                        Venue: {item.venueOrAction}
                      </span>
                      <button
                        type="button"
                        aria-pressed={isRsvped}
                        onClick={() => onToggleRsvp(item.id)}
                        className={`inline-flex items-center gap-1.5 rounded-[2px] border px-3 py-1.5 text-xs font-semibold transition-colors duration-100 ${
                          isRsvped
                            ? 'border-[#00447C] bg-[#00447C] text-white'
                            : 'border-[#00447C] bg-white text-[#00447C] hover:bg-[#00447C] hover:text-white'
                        }`}
                      >
                        {isRsvped ? (
                          <>
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Reserved</span>
                          </>
                        ) : (
                          <span>RSVP Seat</span>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
