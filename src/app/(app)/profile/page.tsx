'use client';

import { useUser } from '@/lib/mock/user-context';
import Link from 'next/link';

const PROFILE_DATA = {
  'emma.wilson@test.com': {
    displayName: 'Emma',
    bio: 'Festival lover & photographer. Always looking for good vibes and new friends! 📸✨',
    age: 28,
    location: 'London, UK',
    sleepSchedule: 'Night Owl',
    cleanlinessLevel: 4,
    socialLevel: 5,
    smokingTolerance: 2,
    drinkingTolerance: 4,
    budgetRange: '€50-150/night',
    interests: ['photography', 'electronic music', 'dancing', 'yoga'],
    languages: ['English', 'Spanish'],
    verificationLevel: 'Email Verified',
    eventsAttending: 3,
    reviewScore: 4.8,
    reviewCount: 12,
  },
  default: {
    displayName: 'User',
    bio: 'Festival enthusiast looking for roommates',
    age: 25,
    location: 'Unknown',
    sleepSchedule: 'Flexible',
    cleanlinessLevel: 3,
    socialLevel: 3,
    smokingTolerance: 3,
    drinkingTolerance: 3,
    budgetRange: '€50-150/night',
    interests: ['music', 'travel'],
    languages: ['English'],
    verificationLevel: 'None',
    eventsAttending: 0,
    reviewScore: 0,
    reviewCount: 0,
  },
};

export default function ProfilePage() {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
      </div>
    );
  }

  const profile =
    PROFILE_DATA[currentUser?.email as keyof typeof PROFILE_DATA] || PROFILE_DATA.default;

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="mb-6 flex items-start gap-4">
        <img
          src={currentUser?.image || ''}
          alt={currentUser?.name || ''}
          className="h-20 w-20 rounded-full"
        />
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-white">{currentUser?.name}</h1>
          <p className="text-sm text-white/50">{profile.location}</p>
          <div className="mt-2 flex items-center gap-3">
            {profile.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-instagram-yellow">★</span>
                <span className="text-sm text-white">{profile.reviewScore}</span>
                <span className="text-sm text-white/40">({profile.reviewCount})</span>
              </div>
            )}
            <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
              {profile.verificationLevel}
            </span>
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </Link>
      </div>

      {/* Bio */}
      <div className="glass mb-6 rounded-xl p-4">
        <p className="text-white/80">{profile.bio}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-white">{profile.eventsAttending}</p>
          <p className="text-xs text-white/50">Events</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-white">{profile.reviewCount}</p>
          <p className="text-xs text-white/50">Reviews</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold gradient-text">{profile.reviewScore || '-'}</p>
          <p className="text-xs text-white/50">Rating</p>
        </div>
      </div>

      {/* Preferences */}
      <section className="mb-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-white">Preferences</h2>
        <div className="glass space-y-3 rounded-xl p-4">
          <PreferenceRow label="Sleep Schedule" value={profile.sleepSchedule} icon="🌙" />
          <PreferenceRow label="Budget" value={profile.budgetRange} icon="💰" />
          <PreferenceRow
            label="Cleanliness"
            value={<LevelIndicator level={profile.cleanlinessLevel} />}
            icon="✨"
          />
          <PreferenceRow
            label="Social Level"
            value={<LevelIndicator level={profile.socialLevel} />}
            icon="🎉"
          />
          <PreferenceRow
            label="Smoking"
            value={<LevelIndicator level={profile.smokingTolerance} />}
            icon="🚬"
          />
          <PreferenceRow
            label="Drinking"
            value={<LevelIndicator level={profile.drinkingTolerance} />}
            icon="🍺"
          />
        </div>
      </section>

      {/* Interests */}
      <section className="mb-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-white">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/70"
            >
              {interest}
            </span>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="mb-6">
        <h2 className="mb-3 font-heading text-lg font-semibold text-white">Languages</h2>
        <div className="flex flex-wrap gap-2">
          {profile.languages.map((language) => (
            <span
              key={language}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70"
            >
              {language}
            </span>
          ))}
        </div>
      </section>

      {/* Settings Link */}
      <Link
        href="/profile/settings"
        className="glass glass-hover flex items-center justify-between rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-white">Settings</span>
        </div>
        <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function PreferenceRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm text-white/60">{label}</span>
      </div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}

function LevelIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-2 w-4 rounded-full ${
            i <= level ? 'bg-instagram-pink' : 'bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}
