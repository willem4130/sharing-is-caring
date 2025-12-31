'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { useUser } from '@/lib/mock/user-context';
import { MATCHING_WEIGHTS } from '@/lib/matching/weights';

type AccommodationStatus = 'LOOKING' | 'HAVE_ROOM' | 'NOT_NEEDED';

// Generate stable demo compatibility scores based on user ID
function generateDemoScore(seed: string): { total: number; breakdown: Record<string, number> } {
  // Simple hash function for consistent scores per user
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const rand = (offset: number) => Math.abs((hash + offset * 1000) % 100) / 100;

  const breakdown = {
    sleepSchedule: Math.round(rand(1) * MATCHING_WEIGHTS.sleepSchedule),
    cleanlinessLevel: Math.round(rand(2) * MATCHING_WEIGHTS.cleanlinessLevel),
    smokingTolerance: Math.round(rand(3) * MATCHING_WEIGHTS.smokingTolerance),
    drinkingTolerance: Math.round(rand(4) * MATCHING_WEIGHTS.drinkingTolerance),
    socialLevel: Math.round(rand(5) * MATCHING_WEIGHTS.socialLevel),
    budgetCompatibility: Math.round(rand(6) * MATCHING_WEIGHTS.budgetCompatibility),
    interests: Math.round(rand(7) * MATCHING_WEIGHTS.interests),
    languages: Math.round(rand(8) * MATCHING_WEIGHTS.languages),
  };
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total, breakdown };
}

export default function MatchesPage() {
  const [filter, setFilter] = useState<'all' | 'HAVE_ROOM' | 'LOOKING'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { currentUser } = useUser();

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = api.events.list.useQuery({
    page: 1,
    limit: 20,
    upcoming: true,
  });

  // Fetch attendees for selected event
  const { data: attendeesData, isLoading: attendeesLoading } = api.events.getAttendees.useQuery(
    {
      eventId: selectedEventId!,
      page: 1,
      limit: 50,
      accommodationStatus: filter === 'all' ? undefined : filter,
    },
    { enabled: !!selectedEventId }
  );

  const events = eventsData?.events ?? [];
  const attendees = attendeesData?.attendees ?? [];

  // Filter out current user from attendees
  const filteredAttendees = attendees.filter((a) => a.user.id !== currentUser?.id);

  // Auto-select first event if none selected
  if (events.length > 0 && !selectedEventId) {
    setSelectedEventId(events[0]?.id ?? null);
  }

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Header */}
      <h1 className="font-heading mb-2 text-2xl font-bold text-white md:text-3xl">Find Matches</h1>
      <p className="mb-6 text-white/50">People looking for roommates at your events</p>

      {/* Event Selector */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-white/70">Select Event</label>
        <select
          value={selectedEventId ?? ''}
          onChange={(e) => setSelectedEventId(e.target.value || null)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-instagram-pink"
        >
          {eventsLoading ? (
            <option value="">Loading events...</option>
          ) : events.length === 0 ? (
            <option value="">No events available</option>
          ) : (
            events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - {event.city}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'HAVE_ROOM', label: 'Has Room' },
          { key: 'LOOKING', label: 'Looking' },
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
            <p className="font-medium text-white">Match Requests</p>
            <p className="text-sm text-white/50">See who wants to connect with you</p>
          </div>
        </div>
        <svg
          className="h-5 w-5 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Loading State */}
      {(eventsLoading || attendeesLoading) && selectedEventId && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
          <p className="mt-4 text-white/50">Finding matches...</p>
        </div>
      )}

      {/* Matches Grid */}
      {!attendeesLoading && selectedEventId && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAttendees.map((attendance) => (
            <MatchCard key={attendance.id} attendance={attendance} eventId={selectedEventId} />
          ))}
        </div>
      )}

      {!attendeesLoading && selectedEventId && filteredAttendees.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-5xl">🔍</div>
          <p className="mt-4 text-white/50">No people found for this event</p>
          <p className="mt-2 text-sm text-white/30">Try selecting a different event or filter</p>
        </div>
      )}

      {/* Demo Notice */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-center text-sm text-white/40">
          💡 Demo mode: Compatibility scores are simulated.
          <br />
          Real matching will work with authentication.
        </p>
      </div>
    </div>
  );
}

type AttendanceData = {
  id: string;
  accommodationStatus: AccommodationStatus;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    profile: {
      displayName: string | null;
      bio: string | null;
      age: number | null;
      interests: string[];
    } | null;
  };
};

function MatchCard({ attendance, eventId }: { attendance: AttendanceData; eventId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const score = useMemo(() => generateDemoScore(attendance.user.id), [attendance.user.id]);

  const sendRequestMutation = api.matches.sendRequest.useMutation({
    onSuccess: () => {
      setRequestSent(true);
    },
  });

  const handleSendRequest = () => {
    sendRequestMutation.mutate({
      receiverId: attendance.user.id,
      eventId,
    });
  };

  const user = attendance.user;
  const profile = user.profile;
  const displayName = profile?.displayName || user.name || 'Anonymous';
  const avatarUrl =
    user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

  return (
    <div className="glass overflow-hidden rounded-2xl">
      {/* Main Card */}
      <div className="flex cursor-pointer gap-4 p-4" onClick={() => setExpanded(!expanded)}>
        <div className="relative">
          <div
            className="h-20 w-20 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${avatarUrl})` }}
          />
          <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-2 py-0.5 text-xs font-bold text-instagram-pink">
            {score.total}%
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">{displayName}</h3>
            {profile?.age && <span className="text-sm text-white/40">{profile.age}</span>}
          </div>
          {profile?.bio && (
            <p className="mt-1 line-clamp-2 text-sm text-white/60">{profile.bio}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                attendance.accommodationStatus === 'HAVE_ROOM'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-instagram-orange/20 text-instagram-orange'
              }`}
            >
              {attendance.accommodationStatus === 'HAVE_ROOM' ? 'Has Room' : 'Looking'}
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
            <p className="mb-2 text-sm font-medium text-white/70">Compatibility Breakdown</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Sleep</span>
                <span className="text-white">{score.breakdown.sleepSchedule}/{MATCHING_WEIGHTS.sleepSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Budget</span>
                <span className="text-white">{score.breakdown.budgetCompatibility}/{MATCHING_WEIGHTS.budgetCompatibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Social</span>
                <span className="text-white">{score.breakdown.socialLevel}/{MATCHING_WEIGHTS.socialLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Cleanliness</span>
                <span className="text-white">{score.breakdown.cleanlinessLevel}/{MATCHING_WEIGHTS.cleanlinessLevel}</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          {profile?.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-white/70">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/profile/${user.id}`}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              View Profile
            </Link>
            {requestSent ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500/20 py-3 text-sm font-medium text-green-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Request Sent
              </div>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={sendRequestMutation.isPending}
                className="gradient-primary flex-1 rounded-xl py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {sendRequestMutation.isPending ? 'Sending...' : 'Send Request'}
              </button>
            )}
          </div>

          {/* Error message */}
          {sendRequestMutation.error && (
            <p className="mt-2 text-center text-sm text-red-400">
              {sendRequestMutation.error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
