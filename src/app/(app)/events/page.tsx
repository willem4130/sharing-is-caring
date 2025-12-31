'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';

type EventType =
  | 'MUSIC_FESTIVAL'
  | 'CONFERENCE'
  | 'CONCERT'
  | 'SPORTS_EVENT'
  | 'CONVENTION'
  | 'TRADE_SHOW'
  | 'CULTURAL_EVENT'
  | 'OTHER';

const FILTERS: { label: string; value: EventType | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Festival', value: 'MUSIC_FESTIVAL' },
  { label: 'Conference', value: 'CONFERENCE' },
  { label: 'Convention', value: 'CONVENTION' },
  { label: 'Sports', value: 'SPORTS_EVENT' },
  { label: 'Cultural', value: 'CULTURAL_EVENT' },
];

const TYPE_LABELS: Record<EventType, string> = {
  MUSIC_FESTIVAL: 'Festival',
  CONFERENCE: 'Conference',
  CONCERT: 'Concert',
  SPORTS_EVENT: 'Sports',
  CONVENTION: 'Convention',
  TRADE_SHOW: 'Trade Show',
  CULTURAL_EVENT: 'Cultural',
  OTHER: 'Other',
};

function formatDateRange(startDate: Date, endDate: Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<EventType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = api.events.list.useQuery({
    page: 1,
    limit: 50,
    upcoming: true,
    eventType: activeFilter === 'ALL' ? undefined : activeFilter,
    search: searchQuery || undefined,
  });

  const events = data?.events ?? [];
  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 3);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <h1 className="font-heading mb-6 text-2xl font-bold text-white">Discover Events</h1>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-instagram-pink"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? 'gradient-primary text-white'
                : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
          <p className="mt-4 text-white/50">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Featured Events */}
          {activeFilter === 'ALL' && !searchQuery && featuredEvents.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 font-heading text-lg font-semibold text-white">Featured</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {featuredEvents.map((event) => (
                  <FeaturedEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* All Events */}
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-white">
              {activeFilter === 'ALL'
                ? 'All Events'
                : FILTERS.find((f) => f.value === activeFilter)?.label ?? 'Events'}
            </h2>
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {events.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-white/50">No events found</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

type EventData = {
  id: string;
  slug: string;
  name: string;
  startDate: Date;
  endDate: Date;
  city: string;
  country: string;
  imageUrl: string | null;
  eventType: EventType;
  isFeatured: boolean;
  _count: { attendances: number };
};

function FeaturedEventCard({ event }: { event: EventData }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="relative w-64 flex-shrink-0 overflow-hidden rounded-2xl"
    >
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-white">{event.name}</h3>
        <p className="text-sm text-white/70">{formatDateRange(event.startDate, event.endDate)}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-instagram-pink/20 px-2 py-0.5 text-xs font-medium text-instagram-pink">
            {event._count.attendances} looking
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: EventData }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="glass glass-hover flex gap-4 overflow-hidden rounded-2xl p-3"
    >
      <div
        className="h-24 w-24 flex-shrink-0 rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{event.name}</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
              {TYPE_LABELS[event.eventType]}
            </span>
          </div>
          <p className="text-sm text-white/50">{formatDateRange(event.startDate, event.endDate)}</p>
          <p className="text-sm text-white/40">
            {event.city}, {event.country}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-black bg-white/20" />
            ))}
          </div>
          <span className="text-xs text-white/50">{event._count.attendances} people looking</span>
        </div>
      </div>
    </Link>
  );
}
