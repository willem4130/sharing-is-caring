'use client';

import Link from 'next/link';
import { api } from '@/trpc/react';

export default function MessagesPage() {
  const { data: conversations, isLoading } = api.messages.getConversations.useQuery();

  const unreadCount = conversations?.filter((c) => c.unreadCount > 0).length ?? 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
        <p className="mt-4 text-white/50">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-white/50">{unreadCount} unread conversation{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {/* Conversations */}
      {conversations && conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((thread) => (
            <ConversationItem key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl">💬</div>
          <h3 className="mb-2 font-semibold text-white">No messages yet</h3>
          <p className="text-sm text-white/50">
            Start matching with people to begin conversations
          </p>
          <Link
            href="/matches"
            className="gradient-primary mt-4 inline-block rounded-full px-6 py-2 text-sm font-medium text-white"
          >
            Find Matches
          </Link>
        </div>
      )}
    </div>
  );
}

type ConversationThread = {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null };
  unreadCount: number;
  lastMessage: { content: string; createdAt: Date } | null;
  match?: { event?: { name: string } | null } | null;
};

function ConversationItem({ thread }: { thread: ConversationThread }) {
  const otherUser = thread.otherUser;
  const avatarUrl = otherUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`;
  const hasUnread = thread.unreadCount > 0;
  const eventName = thread.match?.event?.name;

  return (
    <Link
      href={`/messages/${thread.id}`}
      className="glass glass-hover flex items-center gap-4 rounded-xl p-4"
    >
      <div className="relative">
        <div
          className="h-14 w-14 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
        {hasUnread && (
          <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-black bg-instagram-pink" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`truncate font-medium ${hasUnread ? 'text-white' : 'text-white/80'}`}>
            {otherUser.name || 'Anonymous'}
          </h3>
          <span className="flex-shrink-0 text-xs text-white/40">
            {thread.lastMessage ? formatTime(new Date(thread.lastMessage.createdAt)) : ''}
          </span>
        </div>
        {eventName && <p className="text-xs text-instagram-pink">{eventName}</p>}
        <p className={`mt-1 truncate text-sm ${hasUnread ? 'text-white/70' : 'text-white/50'}`}>
          {thread.lastMessage?.content || 'No messages yet'}
        </p>
      </div>
    </Link>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
