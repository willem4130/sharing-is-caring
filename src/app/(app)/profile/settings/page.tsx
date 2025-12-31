'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/mock/user-context';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, isLoading: userLoading, setCurrentUser } = useUser();
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get blocked users (we'd need a proper endpoint for this)
  // For now, this is a placeholder

  if (userLoading) {
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

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-heading text-xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
            Account
          </h2>
          <div className="glass overflow-hidden rounded-xl">
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              label="Email"
              value={currentUser.email}
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              }
              label="Password"
              value="••••••••"
              onClick={() => {}}
              disabled
              hint="Coming soon"
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              label="Verification"
              value="Email Verified"
              onClick={() => {}}
              disabled
              hint="Get verified"
            />
          </div>
        </section>

        {/* Privacy Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
            Privacy
          </h2>
          <div className="glass overflow-hidden rounded-xl">
            <SettingsToggle
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
              label="Profile Visible"
              description="Show your profile in match searches"
              enabled={true}
              onChange={() => {}}
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              }
              label="Blocked Users"
              value="0 blocked"
              onClick={() => setShowBlockedUsers(true)}
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Data & Privacy"
              value=""
              onClick={() => {}}
              disabled
              hint="Coming soon"
            />
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
            Notifications
          </h2>
          <div className="glass overflow-hidden rounded-xl">
            <SettingsToggle
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              label="New Messages"
              description="Get notified when you receive messages"
              enabled={true}
              onChange={() => {}}
            />
            <SettingsToggle
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
              label="Match Requests"
              description="Get notified about new match requests"
              enabled={true}
              onChange={() => {}}
            />
            <SettingsToggle
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              label="Event Updates"
              description="Updates about events you&apos;re attending"
              enabled={true}
              onChange={() => {}}
            />
          </div>
        </section>

        {/* Support Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
            Support
          </h2>
          <div className="glass overflow-hidden rounded-xl">
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Help Center"
              value=""
              onClick={() => {}}
              disabled
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              label="Contact Us"
              value=""
              onClick={() => {}}
              disabled
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              label="Terms of Service"
              value=""
              onClick={() => {}}
              disabled
            />
            <SettingsRow
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              label="Privacy Policy"
              value=""
              onClick={() => {}}
              disabled
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400/70">
            Danger Zone
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-4 text-white transition-colors hover:bg-white/10"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 py-4 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Account
            </button>
          </div>
        </section>

        {/* App Info */}
        <div className="pt-4 text-center">
          <p className="text-sm text-white/30">Sharing Is Caring v1.0.0</p>
          <p className="text-xs text-white/20">Made with love for festival-goers everywhere</p>
        </div>
      </div>

      {/* Blocked Users Modal */}
      {showBlockedUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <h3 className="font-heading text-xl font-bold text-white">Blocked Users</h3>
            <div className="mt-4 py-8 text-center">
              <p className="text-white/50">You haven&apos;t blocked anyone yet.</p>
            </div>
            <button
              onClick={() => setShowBlockedUsers(false)}
              className="mt-4 w-full rounded-xl bg-white/10 py-3 text-white transition-colors hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <h3 className="font-heading text-xl font-bold text-white">Delete Account?</h3>
            <p className="mt-2 text-white/60">
              This action cannot be undone. All your data, matches, and messages will be permanently deleted.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-white transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In a real app, this would call a delete API
                  setShowDeleteConfirm(false);
                  handleLogout();
                }}
                className="flex-1 rounded-xl bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  disabled,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  const content = (
    <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="text-white/50">{icon}</span>
        <span className="text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {hint && <span className="text-xs text-white/30">{hint}</span>}
        <span className="text-white/50">{value}</span>
        {onClick && !disabled && (
          <svg className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </div>
  );

  if (onClick && !disabled) {
    return (
      <button onClick={onClick} className="w-full text-left transition-colors hover:bg-white/5">
        {content}
      </button>
    );
  }

  return <div className={disabled ? 'opacity-50' : ''}>{content}</div>;
}

function SettingsToggle({
  icon,
  label,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex w-full items-center justify-between border-b border-white/5 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-white/5"
    >
      <div className="flex items-center gap-3">
        <span className="text-white/50">{icon}</span>
        <div>
          <p className="text-white">{label}</p>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
      <div
        className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
          enabled ? 'bg-instagram-pink' : 'bg-white/20'
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
