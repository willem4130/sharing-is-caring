'use client';

import { use, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import { useUser } from '@/lib/mock/user-context';

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const { currentUser } = useUser();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedRead = useRef(false);

  const utils = api.useUtils();

  const { data, isLoading, error } = api.messages.getConversation.useQuery({
    threadId,
    page: 1,
    limit: 50,
  });

  const sendMutation = api.messages.send.useMutation({
    onSuccess: () => {
      setMessage('');
      utils.messages.getConversation.invalidate({ threadId });
    },
  });

  const markReadMutation = api.messages.markRead.useMutation({
    onSuccess: () => {
      utils.messages.getConversations.invalidate();
      utils.messages.getUnreadCount.invalidate();
    },
  });

  // Mark messages as read when viewing the conversation
  useEffect(() => {
    if (data && threadId && !hasMarkedRead.current) {
      hasMarkedRead.current = true;
      markReadMutation.mutate({ threadId });
    }
  }, [threadId, data, markReadMutation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      threadId,
      content: message.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-instagram-pink" />
        <p className="mt-4 text-white/50">Loading conversation...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="text-6xl">💬</div>
        <h2 className="mt-4 font-heading text-xl font-bold text-white">Conversation Not Found</h2>
        <p className="mt-2 text-white/50">This conversation doesn&apos;t exist or you don&apos;t have access.</p>
        <Link
          href="/messages"
          className="gradient-primary mt-6 rounded-full px-6 py-3 font-semibold text-white"
        >
          Back to Messages
        </Link>
      </div>
    );
  }

  const { thread, messages } = data;
  const otherUser = thread.user1Id === currentUser?.id ? thread.user2 : thread.user1;
  const otherAvatarUrl =
    otherUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`;

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-white/10 px-4 py-3 md:px-6">
        <Link
          href="/messages"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${otherAvatarUrl})` }}
        />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-white">{otherUser.name || 'Anonymous'}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-5xl">👋</div>
            <p className="mt-4 text-white/50">No messages yet</p>
            <p className="mt-1 text-sm text-white/30">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender.id === currentUser?.id;
              const senderAvatarUrl =
                msg.sender.image ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender.id}`;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {!isMe && (
                    <div
                      className="h-8 w-8 flex-shrink-0 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${senderAvatarUrl})` }}
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe
                        ? 'gradient-primary text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isMe ? 'text-white/60' : 'text-white/40'
                      }`}
                    >
                      {formatTime(new Date(msg.createdAt))}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4 md:px-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-instagram-pink"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMutation.isPending}
            className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-white disabled:opacity-50"
          >
            {sendMutation.isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        {sendMutation.error && (
          <p className="mt-2 text-center text-sm text-red-400">
            {sendMutation.error.message}
          </p>
        )}
      </div>
    </div>
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
