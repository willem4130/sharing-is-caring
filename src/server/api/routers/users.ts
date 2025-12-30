import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          profile: true,
          reviewsReceived: {
            where: { isVisible: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return user;
    }),

  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.userProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!profile) {
      return null;
    }

    return profile;
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(2).max(100).optional(),
        bio: z.string().max(500).optional(),
        dateOfBirth: z.date().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
        genderPreference: z
          .enum(['MALE_ONLY', 'FEMALE_ONLY', 'NON_BINARY_ONLY', 'SAME_GENDER', 'ANY'])
          .optional(),
        sleepSchedule: z.enum(['EARLY_BIRD', 'MODERATE', 'NIGHT_OWL', 'FLEXIBLE']).optional(),
        cleanlinessLevel: z.number().min(1).max(5).optional(),
        socialLevel: z.number().min(1).max(5).optional(),
        smokingTolerance: z.number().min(1).max(5).optional(),
        drinkingTolerance: z.number().min(1).max(5).optional(),
        budgetMin: z.number().min(0).optional(),
        budgetMax: z.number().min(0).optional(),
        budgetCurrency: z.string().length(3).optional(),
        interests: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { budgetMin, budgetMax, ...rest } = input;

      return ctx.db.userProfile.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          ...rest,
          budgetMin: budgetMin !== undefined ? budgetMin : undefined,
          budgetMax: budgetMax !== undefined ? budgetMax : undefined,
          updatedAt: new Date(),
        },
        create: {
          userId: ctx.session.user.id,
          ...rest,
          budgetMin: budgetMin !== undefined ? budgetMin : undefined,
          budgetMax: budgetMax !== undefined ? budgetMax : undefined,
        },
      });
    }),

  block: protectedProcedure
    .input(z.object({ userId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.session.user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot block yourself' });
      }

      return ctx.db.blockedUser.create({
        data: {
          blockerId: ctx.session.user.id,
          blockedId: input.userId,
          reason: input.reason,
        },
      });
    }),

  unblock: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.blockedUser.deleteMany({
        where: {
          blockerId: ctx.session.user.id,
          blockedId: input.userId,
        },
      });
    }),

  report: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.enum([
          'HARASSMENT',
          'SPAM',
          'FAKE_PROFILE',
          'INAPPROPRIATE_CONTENT',
          'SCAM',
          'NO_SHOW',
          'SAFETY_CONCERN',
          'OTHER',
        ]),
        description: z.string().min(10).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.report.create({
        data: {
          reporterId: ctx.session.user.id,
          reportedId: input.userId,
          reason: input.reason,
          description: input.description,
        },
      });
    }),
});
