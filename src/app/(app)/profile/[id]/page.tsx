'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/lib/mock/user-context';
import { api } from '@/trpc/react';
import { useState } from 'react';

const SLEEP_LABELS = {
  EARLY_BIRD: 'Early Bird',
  MODERATE: 'Moderate',
  NIGHT_OWL: 'Night Owl',
  FLEXIBLE: 'Flexible',
} as const;

const VERIFICATION_LABELS = {
  NONE: 'Not Verified',
  EMAIL: 'Email Verified',
  PHONE: 'Phone Verified',
  ID: 'ID Verified',
  BACKGROUND: 'Background Checked',
} as const;

export default function ViewProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const userId = params.id as string;
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: userData, isLoading } = api.users.getById.useQuery(
    { id: userId },
    { enabled: !!userId }
  );

  const isOwnProfile = currentUser?.id === userId;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <div className="text-5xl">👤</div>
        <h2 className="mt-4 font-heading text-xl font-bold text-white">User Not Found</h2>
        <p className="mt-2 text-center text-white/50">
          This user doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-xl bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
        >
          Go Back
        </button>
      </div>
    );
  }

  const profile = userData.profile;
  const reviews = userData.reviewsReceived ?? [];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)
      : null;

  // If viewing own profile, redirect to /profile
  if (isOwnProfile) {
    router.replace('/profile');
    return null;
  }

  return (
    <div className="px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      {/* Profile Header */}
      <div className="mb-6 flex items-start gap-4">
        <div
          className="h-20 w-20 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: userData.image
              ? `url(${userData.image})`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-white">
            {profile?.displayName || userData.name}
          </h1>
          <p className="text-sm text-white/50">
            {profile?.city && profile?.country
              ? `${profile.city}, ${profile.country}`
              : 'Location not set'}
          </p>
          <div className="mt-2 flex items-center gap-3">
            {avgRating && (
              <div className="flex items-center gap-1">
                <span className="text-instagram-yellow">★</span>
                <span className="text-sm text-white">{avgRating}</span>
                <span className="text-sm text-white/40">({reviews.length})</span>
              </div>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                profile?.verificationLevel && profile.verificationLevel !== 'NONE'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {profile?.verificationLevel
                ? VERIFICATION_LABELS[profile.verificationLevel]
                : 'Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="glass mb-6 rounded-xl p-4">
        <p className="text-white/80">{profile?.bio || 'No bio yet.'}</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-white">{profile?.age || '-'}</p>
          <p className="text-xs text-white/50">Age</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold text-white">{reviews.length}</p>
          <p className="text-xs text-white/50">Reviews</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="font-heading text-2xl font-bold gradient-text">{avgRating || '-'}</p>
          <p className="text-xs text-white/50">Rating</p>
        </div>
      </div>

      {/* Preferences */}
      {profile && (
        <section className="mb-6">
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Preferences</h2>
          <div className="glass space-y-3 rounded-xl p-4">
            <PreferenceRow
              label="Sleep Schedule"
              value={SLEEP_LABELS[profile.sleepSchedule]}
              icon="🌙"
            />
            <PreferenceRow
              label="Budget"
              value={
                profile.budgetMin && profile.budgetMax
                  ? `€${Number(profile.budgetMin)}-${Number(profile.budgetMax)}/night`
                  : 'Not set'
              }
              icon="💰"
            />
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
      )}

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
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
      )}

      {/* Languages */}
      {profile?.languages && profile.languages.length > 0 && (
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
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 font-heading text-lg font-semibold text-white">Recent Reviews</h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="glass rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= review.overallRating ? 'text-instagram-yellow' : 'text-white/20'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-white/40">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.content && (
                  <p className="text-sm text-white/70">{review.content}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setShowReportModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-white/60 transition-colors hover:bg-white/10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Report User
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          userId={userId}
          userName={profile?.displayName || userData.name || 'this user'}
          onClose={() => setShowReportModal(false)}
        />
      )}
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
          className={`h-2 w-4 rounded-full ${i <= level ? 'bg-instagram-pink' : 'bg-white/20'}`}
        />
      ))}
    </div>
  );
}

function ReportModal({
  userId,
  userName,
  onClose,
}: {
  userId: string;
  userName: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportMutation = api.users.report.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const reasons = [
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'SPAM', label: 'Spam' },
    { value: 'FAKE_PROFILE', label: 'Fake Profile' },
    { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
    { value: 'SCAM', label: 'Scam' },
    { value: 'SAFETY_CONCERN', label: 'Safety Concern' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!reason || description.length < 10) return;
    setIsSubmitting(true);
    try {
      await reportMutation.mutateAsync({
        userId,
        reason: reason as 'HARASSMENT' | 'SPAM' | 'FAKE_PROFILE' | 'INAPPROPRIATE_CONTENT' | 'SCAM' | 'NO_SHOW' | 'SAFETY_CONCERN' | 'OTHER',
        description,
      });
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="glass w-full max-w-md rounded-2xl p-6 text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h3 className="font-heading text-xl font-bold text-white">Report Submitted</h3>
          <p className="mt-2 text-white/60">Thank you for helping keep our community safe.</p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-instagram-pink py-3 font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-6">
        <h3 className="font-heading text-xl font-bold text-white">Report {userName}</h3>
        <p className="mt-2 text-sm text-white/60">
          Please let us know why you&apos;re reporting this user.
        </p>

        <div className="mt-4 space-y-3">
          <label className="text-sm text-white/70">Reason</label>
          <div className="grid grid-cols-2 gap-2">
            {reasons.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  reason === r.value
                    ? 'bg-instagram-pink text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-white/70">Description (min 10 characters)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about this report..."
            className="mt-2 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-white/30 focus:border-instagram-pink focus:outline-none"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || description.length < 10 || isSubmitting}
            className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
