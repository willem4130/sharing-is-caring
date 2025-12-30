import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { calculateScoreBreakdown, calculateTotalScore } from '@/lib/matching/algorithm';
import { SCORE_THRESHOLDS } from '@/lib/matching/weights';

export const matchesRouter = createTRPCRouter({
  findPotential: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        minScore: z.number().min(0).max(100).default(SCORE_THRESHOLDS.minimum),
        accommodationStatus: z.enum(['LOOKING', 'HAVE_ROOM']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get current user with profile
      const currentUser = await ctx.db.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!currentUser?.profile) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Profile required for matching' });
      }

      // Get blocked user IDs (both directions)
      const blockedRelations = await ctx.db.blockedUser.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      });

      const blockedUserIds = new Set<string>();
      blockedRelations.forEach((r) => {
        blockedUserIds.add(r.blockerId === userId ? r.blockedId : r.blockerId);
      });

      // Get existing matches for this event
      const existingMatches = await ctx.db.match.findMany({
        where: {
          eventId: input.eventId,
          OR: [{ initiatorId: userId }, { receiverId: userId }],
        },
        select: { initiatorId: true, receiverId: true },
      });

      const alreadyMatchedIds = new Set<string>();
      existingMatches.forEach((m) => {
        alreadyMatchedIds.add(m.initiatorId === userId ? m.receiverId : m.initiatorId);
      });

      // Get candidates
      const candidates = await ctx.db.eventAttendance.findMany({
        where: {
          eventId: input.eventId,
          userId: { notIn: [userId, ...blockedUserIds, ...alreadyMatchedIds] },
          ...(input.accommodationStatus && { accommodationStatus: input.accommodationStatus }),
          user: { profile: { isVisible: true } },
        },
        include: {
          user: {
            include: {
              profile: true,
              reviewsReceived: { select: { overallRating: true } },
            },
          },
          accommodation: true,
        },
        take: 100,
      });

      // Calculate scores and filter
      const results = candidates
        .filter((c) => c.user.profile)
        .map((candidate) => {
          const breakdown = calculateScoreBreakdown(currentUser.profile!, candidate.user.profile!);
          const totalScore = calculateTotalScore(breakdown);

          return {
            user: candidate.user,
            attendance: candidate,
            accommodation: candidate.accommodation,
            score: totalScore,
            breakdown,
          };
        })
        .filter((r) => r.score >= input.minScore)
        .sort((a, b) => b.score - a.score);

      const skip = (input.page - 1) * input.limit;
      const paginatedResults = results.slice(skip, skip + input.limit);

      return {
        matches: paginatedResults,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: results.length,
          totalPages: Math.ceil(results.length / input.limit),
        },
      };
    }),

  sendRequest: protectedProcedure
    .input(
      z.object({
        receiverId: z.string(),
        eventId: z.string(),
        accommodationId: z.string().optional(),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;

      if (initiatorId === input.receiverId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot match with yourself' });
      }

      // Check for existing match
      const existingMatch = await ctx.db.match.findFirst({
        where: {
          eventId: input.eventId,
          OR: [
            { initiatorId, receiverId: input.receiverId },
            { initiatorId: input.receiverId, receiverId: initiatorId },
          ],
        },
      });

      if (existingMatch) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Match already exists' });
      }

      // Get profiles for score calculation
      const [initiator, receiver] = await Promise.all([
        ctx.db.user.findUnique({ where: { id: initiatorId }, include: { profile: true } }),
        ctx.db.user.findUnique({ where: { id: input.receiverId }, include: { profile: true } }),
      ]);

      if (!initiator?.profile || !receiver?.profile) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Both users must have profiles' });
      }

      const breakdown = calculateScoreBreakdown(initiator.profile, receiver.profile);
      const totalScore = calculateTotalScore(breakdown);

      // 72-hour expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 72);

      return ctx.db.match.create({
        data: {
          initiatorId,
          receiverId: input.receiverId,
          eventId: input.eventId,
          accommodationId: input.accommodationId,
          compatibilityScore: totalScore,
          scoreBreakdown: breakdown,
          initiatorMessage: input.message,
          expiresAt,
        },
        include: {
          initiator: { include: { profile: true } },
          receiver: { include: { profile: true } },
          event: true,
        },
      });
    }),

  getRequests: protectedProcedure
    .input(z.object({ type: z.enum(['sent', 'received']) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.match.findMany({
        where: {
          status: 'PENDING',
          ...(input.type === 'sent' ? { initiatorId: userId } : { receiverId: userId }),
        },
        include: {
          initiator: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
          event: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  accept: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const match = await ctx.db.match.findUnique({ where: { id: input.matchId } });

      if (!match) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Match not found' });
      }

      if (match.receiverId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
      }

      if (match.status !== 'PENDING') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Match already responded to' });
      }

      // Update match and create message thread
      const [updatedMatch] = await ctx.db.$transaction([
        ctx.db.match.update({
          where: { id: input.matchId },
          data: {
            status: 'ACCEPTED',
            receiverAccepted: true,
            respondedAt: new Date(),
          },
        }),
        ctx.db.messageThread.create({
          data: {
            user1Id: match.initiatorId,
            user2Id: match.receiverId,
            matchId: match.id,
          },
        }),
      ]);

      return updatedMatch;
    }),

  reject: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const match = await ctx.db.match.findUnique({ where: { id: input.matchId } });

      if (!match) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Match not found' });
      }

      if (match.receiverId !== userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' });
      }

      return ctx.db.match.update({
        where: { id: input.matchId },
        data: {
          status: 'REJECTED',
          receiverAccepted: false,
          respondedAt: new Date(),
        },
      });
    }),

  getMatches: protectedProcedure
    .input(z.object({ eventId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.match.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [{ initiatorId: userId }, { receiverId: userId }],
          ...(input.eventId && { eventId: input.eventId }),
        },
        include: {
          initiator: { select: { id: true, name: true, image: true } },
          receiver: { select: { id: true, name: true, image: true } },
          event: true,
          messageThread: true,
        },
        orderBy: { updatedAt: 'desc' },
      });
    }),
});
