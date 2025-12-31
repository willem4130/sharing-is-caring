'use client';

import Link from 'next/link';

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Nina Petrov',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    lastMessage: 'Hey! Are you still looking for a roommate for Tomorrowland?',
    time: '2m ago',
    unread: true,
    event: 'Tomorrowland',
  },
  {
    id: '2',
    name: 'James Chen',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    lastMessage: 'That sounds great! Let me know when you want to discuss details.',
    time: '1h ago',
    unread: true,
    event: 'Web Summit',
  },
  {
    id: '3',
    name: 'Tom Brown',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    lastMessage: 'The camper van has space for 2 more people if you are interested',
    time: '3h ago',
    unread: false,
    event: 'Glastonbury',
  },
  {
    id: '4',
    name: 'Max Müller',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=max',
    lastMessage: 'See you at Gamescom then! 🎮',
    time: '1d ago',
    unread: false,
    event: 'Gamescom',
  },
  {
    id: '5',
    name: 'Lisa Andersson',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    lastMessage: 'Thanks for the info about the festival!',
    time: '2d ago',
    unread: false,
    event: 'Tomorrowland',
  },
];

export default function MessagesPage() {
  const unreadCount = CONVERSATIONS.filter((c) => c.unread).length;

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-white/50">{unreadCount} unread messages</p>
          )}
        </div>
        <button className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Conversations */}
      <div className="space-y-2">
        {CONVERSATIONS.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </div>

      {CONVERSATIONS.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl">💬</div>
          <h3 className="mb-2 font-semibold text-white">No messages yet</h3>
          <p className="text-sm text-white/50">
            Start matching with people to begin conversations
          </p>
          <Link
            href="/matches"
            className="mt-4 inline-block rounded-full gradient-primary px-6 py-2 text-sm font-medium text-white"
          >
            Find Matches
          </Link>
        </div>
      )}
    </div>
  );
}

function ConversationItem({ conversation }: { conversation: (typeof CONVERSATIONS)[0] }) {
  return (
    <Link
      href={`/messages/${conversation.id}`}
      className="glass glass-hover flex items-center gap-4 rounded-xl p-4"
    >
      <div className="relative">
        <img
          src={conversation.image}
          alt={conversation.name}
          className="h-14 w-14 rounded-full"
        />
        {conversation.unread && (
          <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-black bg-instagram-pink" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`truncate font-medium ${conversation.unread ? 'text-white' : 'text-white/80'}`}>
            {conversation.name}
          </h3>
          <span className="flex-shrink-0 text-xs text-white/40">{conversation.time}</span>
        </div>
        <p className="text-xs text-instagram-pink">{conversation.event}</p>
        <p className={`mt-1 truncate text-sm ${conversation.unread ? 'text-white/70' : 'text-white/50'}`}>
          {conversation.lastMessage}
        </p>
      </div>
    </Link>
  );
}
