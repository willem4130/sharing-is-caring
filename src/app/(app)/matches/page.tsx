'use client';

import { useState } from 'react';
import Link from 'next/link';

const MATCHES = [
  {
    id: '1',
    name: 'Nina Petrov',
    age: 27,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    compatibility: 92,
    event: 'Tomorrowland',
    bio: 'DJ & producer. Tomorrowland is my second home! 🎧',
    interests: ['djing', 'electronic music', 'dancing'],
    status: 'has_room',
  },
  {
    id: '2',
    name: 'James Chen',
    age: 32,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    compatibility: 85,
    event: 'Tomorrowland',
    bio: 'Tech entrepreneur by day, festival enthusiast by weekend.',
    interests: ['technology', 'electronic music', 'traveling'],
    status: 'looking',
  },
  {
    id: '3',
    name: 'Tom Brown',
    age: 31,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    compatibility: 78,
    event: 'Glastonbury',
    bio: 'Drummer in a rock band. Been to Glastonbury 5 times!',
    interests: ['rock music', 'drums', 'camping'],
    status: 'has_room',
  },
  {
    id: '4',
    name: 'Lisa Andersson',
    age: 29,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    compatibility: 75,
    event: 'Tomorrowland',
    bio: 'Minimalist traveler. Love house music and meaningful conversations.',
    interests: ['house music', 'meditation', 'sustainability'],
    status: 'looking',
  },
  {
    id: '5',
    name: 'Max Müller',
    age: 24,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=max',
    compatibility: 71,
    event: 'Gamescom',
    bio: 'Gaming enthusiast & Gamescom regular. Also into electronic music.',
    interests: ['gaming', 'esports', 'anime'],
    status: 'has_room',
  },
  {
    id: '6',
    name: 'Elena Popov',
    age: 28,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    compatibility: 68,
    event: 'Tomorrowland',
    bio: 'Classical musician exploring electronic festivals.',
    interests: ['classical music', 'electronic music', 'art'],
    status: 'looking',
  },
];

export default function MatchesPage() {
  const [filter, setFilter] = useState<'all' | 'has_room' | 'looking'>('all');

  const filteredMatches = MATCHES.filter((match) => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <h1 className="font-heading mb-2 text-2xl font-bold text-white">Find Matches</h1>
      <p className="mb-6 text-white/50">People looking for roommates at your events</p>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'has_room', label: 'Has Room' },
          { key: 'looking', label: 'Looking' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? 'gradient-primary text-white'
                : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Match Requests Banner */}
      <Link
        href="/matches/requests"
        className="mb-6 flex items-center justify-between rounded-xl border border-instagram-pink/30 bg-instagram-pink/10 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-instagram-pink/20">
            <span className="text-lg">💫</span>
          </div>
          <div>
            <p className="font-medium text-white">3 Match Requests</p>
            <p className="text-sm text-white/50">People want to connect with you</p>
          </div>
        </div>
        <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Matches Grid */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-white/50">No matches found</p>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }: { match: (typeof MATCHES)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      {/* Main Card */}
      <div
        className="flex cursor-pointer gap-4 p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative">
          <img
            src={match.image}
            alt={match.name}
            className="h-20 w-20 rounded-xl"
          />
          <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-instagram-pink">
            {match.compatibility}%
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{match.name}</h3>
            <span className="text-sm text-white/40">{match.age}</span>
          </div>
          <p className="text-sm text-instagram-pink">{match.event}</p>
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{match.bio}</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                match.status === 'has_room'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-instagram-orange/20 text-instagram-orange'
              }`}
            >
              {match.status === 'has_room' ? 'Has Room' : 'Looking'}
            </span>
          </div>
        </div>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-white/10 p-4">
          {/* Compatibility Breakdown */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-white/70">Compatibility</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Sleep</span>
                <span className="text-white">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Budget</span>
                <span className="text-white">88%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Social</span>
                <span className="text-white">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Cleanliness</span>
                <span className="text-white">85%</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-white/70">Interests</p>
            <div className="flex flex-wrap gap-2">
              {match.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              View Profile
            </button>
            <button className="flex-1 rounded-xl gradient-primary py-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Send Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
