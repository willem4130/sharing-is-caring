'use client';

import Link from 'next/link';
import { useUser } from '@/lib/mock/user-context';

export default function HomePage() {
  const { currentUser, isLoading } = useUser();

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

      {/* Your Events */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-white">Your Events</h2>
          <Link href="/events" className="text-sm text-instagram-pink">
            See all
          </Link>
        </div>

        <div className="space-y-3">
          <EventCard
            name="Tomorrowland"
            date="Jul 18-27, 2025"
            location="Boom, Belgium"
            image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400"
            status="looking"
            matches={3}
          />
          <EventCard
            name="Glastonbury"
            date="Jun 25-29, 2025"
            location="Pilton, UK"
            image="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
            status="looking"
            matches={5}
          />
        </div>
      </section>

      {/* Potential Matches */}
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
          <ActivityItem
            type="match"
            message="Nina sent you a match request"
            time="2h ago"
          />
          <ActivityItem
            type="message"
            message="New message from James"
            time="5h ago"
          />
          <ActivityItem
            type="event"
            message="Tomorrowland tickets are selling fast!"
            time="1d ago"
          />
        </div>
      </section>
    </div>
  );
}

function EventCard({
  name,
  date,
  location,
  image,
  status,
  matches,
}: {
  name: string;
  date: string;
  location: string;
  image: string;
  status: 'looking' | 'found';
  matches: number;
}) {
  return (
    <Link
      href="/events"
      className="glass glass-hover flex gap-4 overflow-hidden rounded-2xl p-3"
    >
      <img
        src={image}
        alt={name}
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <p className="text-sm text-white/50">{date}</p>
          <p className="text-sm text-white/40">{location}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              status === 'looking'
                ? 'bg-instagram-orange/20 text-instagram-orange'
                : 'bg-green-500/20 text-green-400'
            }`}
          >
            {status === 'looking' ? 'Looking' : 'Found'}
          </span>
          <span className="text-xs text-white/40">{matches} matches</span>
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
        <img
          src={image}
          alt={name}
          className="h-16 w-16 rounded-full"
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
