'use client';

import { useState } from 'react';
import Link from 'next/link';

const EVENTS = [
  {
    slug: 'tomorrowland-2025',
    name: 'Tomorrowland',
    date: 'Jul 18-27, 2025',
    location: 'Boom, Belgium',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    type: 'Festival',
    attendees: 127,
    featured: true,
  },
  {
    slug: 'glastonbury-2025',
    name: 'Glastonbury',
    date: 'Jun 25-29, 2025',
    location: 'Pilton, UK',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    type: 'Festival',
    attendees: 89,
    featured: true,
  },
  {
    slug: 'coachella-2025',
    name: 'Coachella',
    date: 'Apr 11-20, 2025',
    location: 'Indio, USA',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    type: 'Festival',
    attendees: 156,
    featured: true,
  },
  {
    slug: 'web-summit-2025',
    name: 'Web Summit',
    date: 'Nov 11-14, 2025',
    location: 'Lisbon, Portugal',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    type: 'Conference',
    attendees: 43,
    featured: true,
  },
  {
    slug: 'gamescom-2025',
    name: 'Gamescom',
    date: 'Aug 20-24, 2025',
    location: 'Cologne, Germany',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    type: 'Convention',
    attendees: 67,
    featured: true,
  },
  {
    slug: 'burning-man-2025',
    name: 'Burning Man',
    date: 'Aug 24 - Sep 1, 2025',
    location: 'Black Rock Desert, USA',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
    type: 'Cultural',
    attendees: 34,
    featured: false,
  },
  {
    slug: 'f1-monaco-2025',
    name: 'F1 Monaco GP',
    date: 'May 23-25, 2025',
    location: 'Monte Carlo, Monaco',
    image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
    type: 'Sports',
    attendees: 21,
    featured: true,
  },
  {
    slug: 'lowlands-2025',
    name: 'Lowlands',
    date: 'Aug 15-17, 2025',
    location: 'Biddinghuizen, NL',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    type: 'Festival',
    attendees: 52,
    featured: false,
  },
];

const FILTERS = ['All', 'Festival', 'Conference', 'Convention', 'Sports', 'Cultural'];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = EVENTS.filter((event) => {
    const matchesFilter = activeFilter === 'All' || event.type === activeFilter;
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === filter
                ? 'gradient-primary text-white'
                : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Featured Events */}
      {activeFilter === 'All' && !searchQuery && (
        <section className="mb-8">
          <h2 className="mb-4 font-heading text-lg font-semibold text-white">Featured</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {EVENTS.filter((e) => e.featured)
              .slice(0, 3)
              .map((event) => (
                <FeaturedEventCard key={event.slug} event={event} />
              ))}
          </div>
        </section>
      )}

      {/* All Events */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold text-white">
          {activeFilter === 'All' ? 'All Events' : activeFilter}
        </h2>
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        {filteredEvents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-white/50">No events found</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FeaturedEventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="relative w-64 flex-shrink-0 overflow-hidden rounded-2xl"
    >
      <img src={event.image} alt={event.name} className="h-40 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-white">{event.name}</h3>
        <p className="text-sm text-white/70">{event.date}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-instagram-pink/20 px-2 py-0.5 text-xs font-medium text-instagram-pink">
            {event.attendees} looking
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventCard({ event }: { event: (typeof EVENTS)[0] }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="glass glass-hover flex gap-4 overflow-hidden rounded-2xl p-3"
    >
      <img src={event.image} alt={event.name} className="h-24 w-24 rounded-xl object-cover" />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{event.name}</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
              {event.type}
            </span>
          </div>
          <p className="text-sm text-white/50">{event.date}</p>
          <p className="text-sm text-white/40">{event.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full border-2 border-black bg-white/20"
              />
            ))}
          </div>
          <span className="text-xs text-white/50">{event.attendees} people looking</span>
        </div>
      </div>
    </Link>
  );
}
