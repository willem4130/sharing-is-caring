'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';

type RequestTab = 'received' | 'sent';

export default function MatchRequestsPage() {
  const [activeTab, setActiveTab] = useState<RequestTab>('received');

  const { data: receivedRequests, isLoading: receivedLoading } =
    api.matches.getRequests.useQuery({ type: 'received' });

  const { data: sentRequests, isLoading: sentLoading } =
    api.matches.getRequests.useQuery({ type: 'sent' });

  const utils = api.useUtils();

  const acceptMutation = api.matches.accept.useMutation({
    onSuccess: () => {
      utils.matches.getRequests.invalidate();
    },
  });

  const rejectMutation = api.matches.reject.useMutation({
    onSuccess: () => {
      utils.matches.getRequests.invalidate();
    },
  });

  const requests = activeTab === 'received' ? receivedRequests : sentRequests;
  const isLoading = activeTab === 'received' ? receivedLoading : sentLoading;

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/matches"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">Match Requests</h1>
          <p className="text-sm text-white/50">Manage your connection requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
            activeTab === 'received'
              ? 'gradient-primary text-white'
              : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Received
          {receivedRequests && receivedRequests.length > 0 && (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {receivedRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
            activeTab === 'sent'
              ? 'gradient-primary text-white'
              : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          Sent
          {sentRequests && sentRequests.length > 0 && (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {sentRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
          <p className="mt-4 text-white/50">Loading requests...</p>
        </div>
      )}

      {/* Requests List */}
      {!isLoading && requests && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => {
            const otherUser =
              activeTab === 'received' ? request.initiator : request.receiver;
            const avatarUrl =
              otherUser.image ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`;

            return (
              <div key={request.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-14 w-14 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${avatarUrl})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">
                      {otherUser.name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-instagram-pink">{request.event.name}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {Number(request.compatibilityScore)}% match
                    </p>
                  </div>
                  {activeTab === 'received' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectMutation.mutate({ matchId: request.id })}
                        disabled={rejectMutation.isPending}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => acceptMutation.mutate({ matchId: request.id })}
                        disabled={acceptMutation.isPending}
                        className="gradient-primary rounded-full p-2 text-white"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {activeTab === 'sent' && (
                    <span className="rounded-full bg-instagram-orange/20 px-3 py-1 text-xs font-medium text-instagram-orange">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && requests && requests.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl">
            {activeTab === 'received' ? '📬' : '📤'}
          </div>
          <h3 className="mb-2 font-semibold text-white">
            {activeTab === 'received' ? 'No requests yet' : 'No sent requests'}
          </h3>
          <p className="text-sm text-white/50">
            {activeTab === 'received'
              ? 'When someone wants to connect with you, it will appear here'
              : 'Requests you send to other users will appear here'}
          </p>
          {activeTab === 'sent' && (
            <Link
              href="/matches"
              className="gradient-primary mt-4 inline-block rounded-full px-6 py-2 text-sm font-medium text-white"
            >
              Find People
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
