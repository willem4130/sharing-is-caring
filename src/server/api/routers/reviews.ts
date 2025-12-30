import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const reviewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        reviewedId: z.string(),
        overallRating: z.number().min(1).max(5),
        communicationRating: z.number().min(1).max(5).optional(),
        cleanlinessRating: z.number().min(1).max(5).optional(),
        respectfulnessRating: z.number().min(1).max(5).optional(),
        content: z.string().max(1000).optional(),
        eventContext: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reviewerId = ctx.session.user.id;

      if (reviewerId === input.reviewedId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot review yourself' });
      }

      // Check if already reviewed
      const existing = await ctx.db.review.findUnique({
        where: {
          reviewerId_reviewedId: { reviewerId, reviewedId: input.reviewedId },
        },
      });

      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Already reviewed this user' });
      }

      return ctx.db.review.create({
        data: {
          reviewerId,
          ...input,
        },
      });
    }),

  getByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const [reviews, total, stats] = await Promise.all([
        ctx.db.review.findMany({
          where: { reviewedId: input.userId, isVisible: true },
          skip,
          take: input.limit,
          include: {
            reviewer: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        ctx.db.review.count({ where: { reviewedId: input.userId, isVisible: true } }),
        ctx.db.review.aggregate({
          where: { reviewedId: input.userId, isVisible: true },
          _avg: {
            overallRating: true,
            communicationRating: true,
            cleanlinessRating: true,
            respectfulnessRating: true,
          },
          _count: true,
        }),
      ]);

      return {
        reviews,
        stats: {
          averageRating: stats._avg.overallRating ?? 0,
          averageCommunication: stats._avg.communicationRating ?? 0,
          averageCleanliness: stats._avg.cleanlinessRating ?? 0,
          averageRespectfulness: stats._avg.respectfulnessRating ?? 0,
          totalReviews: stats._count,
        },
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),
});
