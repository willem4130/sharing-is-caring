'use client';

import Link from 'next/link';
import { useUser } from '@/lib/mock/user-context';
import { api } from '@/trpc/react';

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

export default function HomePage() {
  const { currentUser, isLoading: userLoading } = useUser();

  // Fetch featured events - more on desktop
  const { data: eventsData, isLoading: eventsLoading } = api.events.list.useQuery({
    page: 1,
    limit: 6,
    upcoming: true,
  });

  const isLoading = userLoading || eventsLoading;
  const events = eventsData?.events.slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 lg:py-8">
      {/* Welcome Section */}
      <section className="mb-8 lg:mb-10">
        <h1 className="font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          Hey, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="mt-1 text-white/50 lg:mt-2 lg:text-lg">Find your perfect event roommate</p>
      </section>

      {/* Quick Actions - Mobile/Tablet only (redundant with sidebar on desktop) */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:hidden">
        <Link
          href="/events"
          className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-4 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-instagram-soft text-2xl">
            🎪
          </div>
          <span className="text-sm font-medium text-white">Browse Events</span>
        </Link>
        <Link
          href="/matches"
          className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-4 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-instagram-soft text-2xl">
            💫
          </div>
          <span className="text-sm font-medium text-white">Find Matches</span>
        </Link>
        <Link
          href="/messages"
          className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-4 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-instagram-soft text-2xl">
            💬
          </div>
          <span className="text-sm font-medium text-white">Messages</span>
        </Link>
        <Link
          href="/profile"
          className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl p-4 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-instagram-soft text-2xl">
            👤
          </div>
          <span className="text-sm font-medium text-white">My Profile</span>
        </Link>
      </section>

      {/* Upcoming Events */}
      <section className="mb-8 lg:mb-12">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <h2 className="font-heading text-lg font-semibold text-white lg:text-xl">
            Upcoming Events
          </h2>
          <Link href="/events" className="text-sm text-instagram-pink hover:underline lg:text-base">
            See all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              slug={event.slug}
              name={event.name}
              date={formatDateRange(event.startDate, event.endDate)}
              location={`${event.city}, ${event.country}`}
              imageUrl={event.imageUrl}
              attendees={event._count.attendances}
            />
          ))}
          {events.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center md:col-span-2 xl:col-span-3">
              <p className="text-white/50">No upcoming events</p>
              <Link href="/events" className="mt-2 inline-block text-sm text-instagram-pink">
                Browse all events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Two-column layout for Matches + Activity on desktop */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* Top Matches */}
        <section>
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <h2 className="font-heading text-lg font-semibold text-white lg:text-xl">Top Matches</h2>
            <Link
              href="/matches"
              className="text-sm text-instagram-pink hover:underline lg:text-base"
            >
              See all
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:pb-0">
            <MatchCard
              name="Nina"
              compatibility={92}
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=nina"
              event="Tomorrowland"
            />
            <MatchCard
              name="James"
              compatibility={85}
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=james"
              event="Tomorrowland"
            />
            <MatchCard
              name="Tom"
              compatibility={78}
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=tom"
              event="Glastonbury"
            />
            <MatchCard
              name="Lisa"
              compatibility={75}
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=lisa"
              event="Tomorrowland"
            />
          </div>
        </section>

        {/* Activity */}
        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-white lg:mb-6 lg:text-xl">
            Recent Activity
          </h2>
          <div className="space-y-3 lg:space-y-4">
            <ActivityItem type="match" message="Nina sent you a match request" time="2h ago" />
            <ActivityItem type="message" message="New message from James" time="5h ago" />
            <ActivityItem
              type="event"
              message="Tomorrowland tickets are selling fast!"
              time="1d ago"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function EventCard({
  slug,
  name,
  date,
  location,
  imageUrl,
  attendees,
}: {
  slug: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string | null;
  attendees: number;
}) {
  return (
    <Link
      href={`/events/${slug}`}
      className="glass glass-hover flex gap-4 overflow-hidden rounded-2xl p-3 lg:flex-col lg:gap-0 lg:p-0"
    >
      {/* Image - horizontal on mobile, full width on desktop */}
      <div
        className="h-20 w-20 flex-shrink-0 rounded-xl bg-cover bg-center lg:h-36 lg:w-full lg:rounded-b-none lg:rounded-t-2xl"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      <div className="flex flex-1 flex-col justify-between py-1 lg:p-4">
        <div>
          <h3 className="font-semibold text-white lg:text-lg">{name}</h3>
          <p className="text-sm text-white/50">{date}</p>
          <p className="text-sm text-white/40">{location}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-instagram-pink/20 px-2 py-0.5 text-xs font-medium text-instagram-pink">
            {attendees} looking
          </span>
        </div>
      </div>
    </Link>
  );
}

function MatchCard({
  name,
  compatibility,
  image,
  event,
}: {
  name: string;
  compatibility: number;
  image: string;
  event: string;
}) {
  return (
    <Link
      href="/matches"
      className="glass glass-hover flex w-28 flex-shrink-0 flex-col items-center rounded-2xl p-4 lg:w-auto lg:flex-row lg:gap-4 lg:p-4"
    >
      {/* Avatar with compatibility badge */}
      <div className="relative mb-3 lg:mb-0">
        <div
          className="h-16 w-16 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-1.5 py-0.5 text-xs font-bold text-instagram-pink">
          {compatibility}%
        </div>
      </div>
      {/* Info */}
      <div className="text-center lg:text-left">
        <p className="font-medium text-white">{name}</p>
        <p className="text-xs text-white/40">{event}</p>
      </div>
    </Link>
  );
}

function ActivityItem({
  type,
  message,
  time,
}: {
  type: 'match' | 'message' | 'event';
  message: string;
  time: string;
}) {
  const icons = {
    match: '💫',
    message: '💬',
    event: '🎪',
  };

  return (
    <div className="glass flex items-center gap-3 rounded-xl p-3 lg:p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg lg:h-12 lg:w-12">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm text-white lg:text-base">{message}</p>
        <p className="text-xs text-white/40">{time}</p>
      </div>
    </div>
  );
}
