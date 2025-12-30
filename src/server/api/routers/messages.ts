import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const messagesRouter = createTRPCRouter({
  send: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        content: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify user is part of the thread
      const thread = await ctx.db.messageThread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
      }

      if (thread.user1Id !== userId && thread.user2Id !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a participant' });
      }

      // Create message and update thread
      const [message] = await ctx.db.$transaction([
        ctx.db.message.create({
          data: {
            threadId: input.threadId,
            senderId: userId,
            content: input.content,
          },
        }),
        ctx.db.messageThread.update({
          where: { id: input.threadId },
          data: { lastMessageAt: new Date() },
        }),
      ]);

      return message;
    }),

  getConversation: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const thread = await ctx.db.messageThread.findUnique({
        where: { id: input.threadId },
        include: {
          user1: { select: { id: true, name: true, image: true } },
          user2: { select: { id: true, name: true, image: true } },
        },
      });

      if (!thread) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Thread not found' });
      }

      if (thread.user1Id !== userId && thread.user2Id !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a participant' });
      }

      const skip = (input.page - 1) * input.limit;

      const [messages, total] = await Promise.all([
        ctx.db.message.findMany({
          where: { threadId: input.threadId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: input.limit,
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
        }),
        ctx.db.message.count({ where: { threadId: input.threadId } }),
      ]);

      return {
        thread,
        messages: messages.reverse(),
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const threads = await ctx.db.messageThread.findMany({
      where: {
        isActive: true,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, name: true, image: true } },
        user2: { select: { id: true, name: true, image: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        match: {
          include: { event: { select: { id: true, name: true } } },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Add unread count
    const threadsWithUnread = await Promise.all(
      threads.map(async (thread) => {
        const unreadCount = await ctx.db.message.count({
          where: {
            threadId: thread.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        const otherUser = thread.user1Id === userId ? thread.user2 : thread.user1;

        return {
          ...thread,
          otherUser,
          unreadCount,
          lastMessage: thread.messages[0] ?? null,
        };
      })
    );

    return threadsWithUnread;
  }),

  markRead: protectedProcedure
    .input(z.object({ threadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify participation
      const thread = await ctx.db.messageThread.findUnique({
        where: { id: input.threadId },
      });

      if (!thread || (thread.user1Id !== userId && thread.user2Id !== userId)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a participant' });
      }

      // Mark all unread messages from the other user as read
      await ctx.db.message.updateMany({
        where: {
          threadId: input.threadId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return { success: true };
    }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const count = await ctx.db.message.count({
      where: {
        senderId: { not: userId },
        isRead: false,
        thread: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      },
    });

    return { count };
  }),
});
