'use client';

import { use } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { useUser } from '@/lib/mock/user-context';

type EventType =
  | 'MUSIC_FESTIVAL'
  | 'CONFERENCE'
  | 'CONCERT'
  | 'SPORTS_EVENT'
  | 'CONVENTION'
  | 'TRADE_SHOW'
  | 'CULTURAL_EVENT'
  | 'OTHER';

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
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { currentUser } = useUser();

  const { data: event, isLoading, error } = api.events.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
        <p className="mt-4 text-white/50">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-6xl">🎪</div>
        <h2 className="mt-4 font-heading text-xl font-bold text-white">Event Not Found</h2>
        <p className="mt-2 text-white/50">This event doesn&apos;t exist or has been removed.</p>
        <Link
          href="/events"
          className="gradient-primary mt-6 rounded-full px-6 py-3 font-semibold text-white"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero Image */}
      <div className="relative h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: event.imageUrl
              ? `url(${event.imageUrl})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Back Button */}
        <Link
          href="/events"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Event Type Badge */}
        <div className="absolute right-4 top-4">
          <span className="rounded-full bg-instagram-pink/80 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {TYPE_LABELS[event.eventType as EventType]}
          </span>
        </div>

        {/* Event Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="font-heading text-2xl font-bold text-white">{event.name}</h1>
          <p className="mt-1 text-white/70">{formatDateRange(event.startDate, event.endDate)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-4 pt-6">
        {/* Location */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-instagram-pink/20">
              <svg
                className="h-5 w-5 text-instagram-pink"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">{event.venueName || 'Venue TBA'}</h3>
              <p className="text-sm text-white/50">
                {event.city}, {event.country}
              </p>
              {event.address && <p className="mt-1 text-sm text-white/40">{event.address}</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-instagram-pink">
              {event._count.attendances}
            </div>
            <div className="text-sm text-white/50">People Looking</div>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-instagram-purple">
              {event._count.accommodations}
            </div>
            <div className="text-sm text-white/50">Accommodations</div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="glass rounded-2xl p-4">
            <h3 className="mb-2 font-semibold text-white">About</h3>
            <p className="text-sm leading-relaxed text-white/70">{event.description}</p>
          </div>
        )}

        {/* Attendees Preview */}
        {event.attendances.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">Who&apos;s Going</h3>
              <Link href={`/events/${slug}/attendees`} className="text-sm text-instagram-pink">
                See all
              </Link>
            </div>
            <div className="flex -space-x-3">
              {event.attendances.slice(0, 8).map((attendance) => (
                <div
                  key={attendance.id}
                  className="h-10 w-10 rounded-full border-2 border-black bg-white/20"
                  title={attendance.user.name || 'User'}
                  style={{
                    backgroundImage: attendance.user.image
                      ? `url(${attendance.user.image})`
                      : undefined,
                    backgroundSize: 'cover',
                  }}
                />
              ))}
              {event._count.attendances > 8 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white/10 text-xs font-medium text-white">
                  +{event._count.attendances - 8}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accommodations Preview */}
        {event.accommodations.length > 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-white">Available Accommodations</h3>
              <Link
                href={`/events/${slug}/accommodations`}
                className="text-sm text-instagram-pink"
              >
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {event.accommodations.slice(0, 2).map((accommodation) => (
                <div
                  key={accommodation.id}
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-instagram-purple/20 text-2xl">
                    🏠
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{accommodation.title}</h4>
                    <p className="text-sm text-white/50">
                      {accommodation.availableSpots} spot
                      {accommodation.availableSpots !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  {accommodation.costPerNight && (
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        €{Number(accommodation.costPerNight)}
                      </div>
                      <div className="text-xs text-white/50">per night</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Website Link */}
        {event.websiteUrl && (
          <a
            href={event.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover flex items-center justify-center gap-2 rounded-2xl p-4 text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Visit Official Website
          </a>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-8">
        <button className="gradient-primary w-full rounded-full py-4 font-semibold text-white">
          I&apos;m Going - Find Roommates
        </button>
        {currentUser && (
          <p className="mt-2 text-center text-xs text-white/40">
            Signed in as {currentUser.name}
          </p>
        )}
      </div>
    </div>
  );
}
