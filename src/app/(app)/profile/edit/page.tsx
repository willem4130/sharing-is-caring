'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/mock/user-context';
import { api } from '@/trpc/react';
import { useState, useEffect } from 'react';

const SLEEP_OPTIONS = [
  { value: 'EARLY_BIRD', label: 'Early Bird', description: 'Up with the sun' },
  { value: 'MODERATE', label: 'Moderate', description: 'Regular schedule' },
  { value: 'NIGHT_OWL', label: 'Night Owl', description: 'Late nights' },
  { value: 'FLEXIBLE', label: 'Flexible', description: 'Adaptable' },
] as const;

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
] as const;

const GENDER_PREF_OPTIONS = [
  { value: 'ANY', label: 'Anyone' },
  { value: 'MALE_ONLY', label: 'Men only' },
  { value: 'FEMALE_ONLY', label: 'Women only' },
  { value: 'NON_BINARY_ONLY', label: 'Non-binary only' },
  { value: 'SAME_GENDER', label: 'Same gender' },
] as const;

const INTEREST_OPTIONS = [
  'photography', 'electronic music', 'dancing', 'yoga', 'technology', 'startups',
  'traveling', 'architecture', 'art', 'design', 'indie music', 'gaming', 'esports',
  'anime', 'house music', 'meditation', 'travel', 'sustainability', 'rock music',
  'drums', 'festivals', 'camping', 'programming', 'japanese culture', 'formula 1',
  'racing', 'luxury travel', 'wine', 'k-pop', 'fitness', 'djing', 'production',
  'investing', 'networking', 'wellness', 'nature', 'folk music', 'hiking',
  'community', 'desert camping', 'classical music', 'culture', 'videography',
  'pop music', 'reading', 'comics', 'cosplay', 'movies', 'cooking', 'mixology',
];

const LANGUAGE_OPTIONS = [
  'English', 'Spanish', 'French', 'German', 'Dutch', 'Portuguese', 'Italian',
  'Mandarin', 'Japanese', 'Korean', 'Russian', 'Swedish', 'Norwegian', 'Finnish',
  'Irish', 'Polish', 'Greek', 'Turkish', 'Arabic', 'Hindi',
];

type SleepSchedule = 'EARLY_BIRD' | 'MODERATE' | 'NIGHT_OWL' | 'FLEXIBLE';
type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
type GenderPreference = 'MALE_ONLY' | 'FEMALE_ONLY' | 'NON_BINARY_ONLY' | 'SAME_GENDER' | 'ANY';

export default function EditProfilePage() {
  const router = useRouter();
  const { currentUser, isLoading: userLoading } = useUser();

  const { data: userData, isLoading: dataLoading } = api.users.getById.useQuery(
    { id: currentUser?.id ?? '' },
    { enabled: !!currentUser?.id }
  );

  const updateMutation = api.users.updatePreferences.useMutation({
    onSuccess: () => {
      router.push('/profile');
    },
  });

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<Gender>('PREFER_NOT_TO_SAY');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('ANY');
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule>('FLEXIBLE');
  const [cleanlinessLevel, setCleanlinessLevel] = useState(3);
  const [socialLevel, setSocialLevel] = useState(3);
  const [smokingTolerance, setSmokingTolerance] = useState(3);
  const [drinkingTolerance, setDrinkingTolerance] = useState(3);
  const [budgetMin, setBudgetMin] = useState<number>(50);
  const [budgetMax, setBudgetMax] = useState<number>(150);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // Initialize form with existing data
  useEffect(() => {
    if (userData?.profile) {
      const p = userData.profile;
      setDisplayName(p.displayName || '');
      setBio(p.bio || '');
      setGender(p.gender as Gender);
      setGenderPreference(p.genderPreference as GenderPreference);
      setSleepSchedule(p.sleepSchedule as SleepSchedule);
      setCleanlinessLevel(p.cleanlinessLevel);
      setSocialLevel(p.socialLevel);
      setSmokingTolerance(p.smokingTolerance);
      setDrinkingTolerance(p.drinkingTolerance);
      setBudgetMin(Number(p.budgetMin) || 50);
      setBudgetMax(Number(p.budgetMax) || 150);
      setInterests(p.interests || []);
      setLanguages(p.languages || []);
      setCity(p.city || '');
      setCountry(p.country || '');
    }
  }, [userData]);

  const isLoading = userLoading || dataLoading;

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      displayName,
      bio,
      gender,
      genderPreference,
      sleepSchedule,
      cleanlinessLevel,
      socialLevel,
      smokingTolerance,
      drinkingTolerance,
      budgetMin,
      budgetMax,
      interests,
      languages,
      city,
      country,
    });
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleLanguage = (language: string) => {
    setLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <div className="text-5xl">👤</div>
        <h2 className="mt-4 font-heading text-xl font-bold text-white">No User Selected</h2>
        <p className="mt-2 text-center text-white/50">
          Use the user switcher in the header to select a test user
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Cancel</span>
        </button>
        <h1 className="font-heading text-xl font-bold text-white">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="font-semibold text-instagram-pink transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/70">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-instagram-pink focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-instagram-pink focus:outline-none"
              />
              <p className="mt-1 text-xs text-white/40">{bio.length}/500 characters</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-white/70">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-instagram-pink focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-white/70">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Your country"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-instagram-pink focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gender */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Gender</h2>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setGender(option.value)}
                className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                  gender === option.value
                    ? 'bg-instagram-pink text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Roommate Preference */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Roommate Preference</h2>
          <div className="grid grid-cols-2 gap-2">
            {GENDER_PREF_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setGenderPreference(option.value)}
                className={`rounded-xl px-4 py-3 text-sm transition-colors ${
                  genderPreference === option.value
                    ? 'bg-instagram-pink text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Sleep Schedule */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Sleep Schedule</h2>
          <div className="grid grid-cols-2 gap-2">
            {SLEEP_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSleepSchedule(option.value)}
                className={`rounded-xl px-4 py-3 text-left transition-colors ${
                  sleepSchedule === option.value
                    ? 'bg-instagram-pink text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Lifestyle Preferences */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Lifestyle</h2>
          <div className="glass space-y-4 rounded-xl p-4">
            <LevelSlider
              label="Cleanliness"
              icon="✨"
              value={cleanlinessLevel}
              onChange={setCleanlinessLevel}
              lowLabel="Relaxed"
              highLabel="Very tidy"
            />
            <LevelSlider
              label="Social Level"
              icon="🎉"
              value={socialLevel}
              onChange={setSocialLevel}
              lowLabel="Quiet"
              highLabel="Party mode"
            />
            <LevelSlider
              label="Smoking Tolerance"
              icon="🚬"
              value={smokingTolerance}
              onChange={setSmokingTolerance}
              lowLabel="No smoking"
              highLabel="Smoker-friendly"
            />
            <LevelSlider
              label="Drinking Tolerance"
              icon="🍺"
              value={drinkingTolerance}
              onChange={setDrinkingTolerance}
              lowLabel="Sober"
              highLabel="Party-ready"
            />
          </div>
        </section>

        {/* Budget */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Budget per Night (EUR)</h2>
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-white/50">Min</label>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white focus:border-instagram-pink focus:outline-none"
                />
              </div>
              <span className="text-white/40">—</span>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-white/50">Max</label>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white focus:border-instagram-pink focus:outline-none"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-white/60">
              €{budgetMin} - €{budgetMax} per night
            </p>
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">
            Interests <span className="font-normal text-white/50">({interests.length} selected)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  interests.includes(interest)
                    ? 'bg-instagram-pink text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">
            Languages <span className="font-normal text-white/50">({languages.length} selected)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((language) => (
              <button
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  languages.includes(language)
                    ? 'bg-gradient-to-r from-instagram-purple to-instagram-pink text-white'
                    : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center bg-gradient-to-t from-black to-transparent px-4 pb-4 pt-8">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full max-w-md rounded-xl bg-gradient-to-r from-instagram-purple to-instagram-pink py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function LevelSlider({
  label,
  icon,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`h-3 flex-1 rounded-full transition-colors ${
              level <= value ? 'bg-instagram-pink' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-white/40">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
