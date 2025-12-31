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

  // Fetch featured events
  const { data: eventsData, isLoading: eventsLoading } = api.events.list.useQuery({
    page: 1,
    limit: 4,
    upcoming: true,
  });

  const isLoading = userLoading || eventsLoading;
  const events = eventsData?.events.slice(0, 2) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-white">
          Hey, {currentUser?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="mt-1 text-white/50">Find your perfect event roommate</p>
      </section>

      {/* Quick Actions */}
      <section className="mb-8 grid grid-cols-2 gap-3">
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
      </section>

      {/* Upcoming Events */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">Upcoming Events</h2>
          <Link href="/events" className="text-sm text-instagram-pink">
            See all
          </Link>
        </div>

        <div className="space-y-3">
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
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-white/50">No upcoming events</p>
              <Link href="/events" className="mt-2 inline-block text-sm text-instagram-pink">
                Browse all events
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Demo Matches */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">Top Matches</h2>
          <Link href="/matches" className="text-sm text-instagram-pink">
            See all
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
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
        <h2 className="mb-4 font-heading text-lg font-semibold text-white">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem type="match" message="Nina sent you a match request" time="2h ago" />
          <ActivityItem type="message" message="New message from James" time="5h ago" />
          <ActivityItem type="event" message="Tomorrowland tickets are selling fast!" time="1d ago" />
        </div>
      </section>
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
      className="glass glass-hover flex gap-4 overflow-hidden rounded-2xl p-3"
    >
      <div
        className="h-20 w-20 flex-shrink-0 rounded-xl bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/50">{date}</p>
          <p className="text-sm text-white/40">{location}</p>
        </div>
        <div className="flex items-center gap-2">
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
      className="glass glass-hover flex w-28 flex-shrink-0 flex-col items-center rounded-2xl p-4"
    >
      <div className="relative mb-3">
        <div
          className="h-16 w-16 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-1.5 py-0.5 text-xs font-bold text-instagram-pink">
          {compatibility}%
        </div>
      </div>
      <p className="font-medium text-white">{name}</p>
      <p className="text-xs text-white/40">{event}</p>
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
    <div className="glass flex items-center gap-3 rounded-xl p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{message}</p>
        <p className="text-xs text-white/40">{time}</p>
      </div>
    </div>
  );
}
