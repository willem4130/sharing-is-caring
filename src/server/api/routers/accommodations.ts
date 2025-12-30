import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const accommodationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        title: z.string().min(5).max(200),
        description: z.string().max(2000).optional(),
        accommodationType: z.enum([
          'TENT',
          'CAMPER_VAN',
          'CABIN',
          'HOTEL_ROOM',
          'HOSTEL',
          'AIRBNB',
          'OTHER',
        ]),
        totalSpots: z.number().min(1).max(50),
        costPerNight: z.number().min(0).optional(),
        costTotal: z.number().min(0).optional(),
        currency: z.string().length(3).default('EUR'),
        isCostSplit: z.boolean().default(true),
        amenities: z.array(z.string()).optional(),
        distanceToVenue: z.string().optional(),
        address: z.string().optional(),
        photoUrls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.accommodation.create({
        data: {
          ...input,
          ownerId: ctx.session.user.id,
          availableSpots: input.totalSpots - 1, // Owner takes one spot
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(5).max(200).optional(),
        description: z.string().max(2000).optional(),
        totalSpots: z.number().min(1).max(50).optional(),
        availableSpots: z.number().min(0).optional(),
        costPerNight: z.number().min(0).optional(),
        costTotal: z.number().min(0).optional(),
        amenities: z.array(z.string()).optional(),
        distanceToVenue: z.string().optional(),
        address: z.string().optional(),
        photoUrls: z.array(z.string().url()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const accommodation = await ctx.db.accommodation.findUnique({ where: { id } });

      if (!accommodation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Accommodation not found' });
      }

      if (accommodation.ownerId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not the owner' });
      }

      return ctx.db.accommodation.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const accommodation = await ctx.db.accommodation.findUnique({ where: { id: input.id } });

      if (!accommodation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Accommodation not found' });
      }

      if (accommodation.ownerId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not the owner' });
      }

      await ctx.db.accommodation.delete({ where: { id: input.id } });
      return { success: true };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const accommodation = await ctx.db.accommodation.findUnique({
        where: { id: input.id },
        include: {
          owner: { select: { id: true, name: true, image: true } },
          event: true,
          attendances: {
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
          },
        },
      });

      if (!accommodation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Accommodation not found' });
      }

      return accommodation;
    }),

  getByEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        type: z
          .enum(['TENT', 'CAMPER_VAN', 'CABIN', 'HOTEL_ROOM', 'HOSTEL', 'AIRBNB', 'OTHER'])
          .optional(),
        hasSpots: z.boolean().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        eventId: input.eventId,
        isActive: true,
        ...(input.hasSpots && { availableSpots: { gt: 0 } }),
        ...(input.type && { accommodationType: input.type }),
      };

      const [accommodations, total] = await Promise.all([
        ctx.db.accommodation.findMany({
          where,
          skip,
          take: input.limit,
          include: {
            owner: { select: { id: true, name: true, image: true } },
            _count: { select: { attendances: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        ctx.db.accommodation.count({ where }),
      ]);

      return {
        accommodations,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  getMine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.accommodation.findMany({
      where: { ownerId: ctx.session.user.id },
      include: {
        event: true,
        _count: { select: { attendances: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  join: protectedProcedure
    .input(
      z.object({
        accommodationId: z.string(),
        notes: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const accommodation = await ctx.db.accommodation.findUnique({
        where: { id: input.accommodationId },
      });

      if (!accommodation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Accommodation not found' });
      }

      if (accommodation.availableSpots <= 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'No spots available' });
      }

      // Update attendance to link to this accommodation
      await ctx.db.eventAttendance.upsert({
        where: {
          userId_eventId: { userId, eventId: accommodation.eventId },
        },
        update: {
          accommodationId: input.accommodationId,
          notes: input.notes,
        },
        create: {
          userId,
          eventId: accommodation.eventId,
          accommodationId: input.accommodationId,
          accommodationStatus: 'HAVE_ROOM',
          notes: input.notes,
        },
      });

      // Decrease available spots
      await ctx.db.accommodation.update({
        where: { id: input.accommodationId },
        data: { availableSpots: { decrement: 1 } },
      });

      return { success: true };
    }),

  leave: protectedProcedure
    .input(z.object({ accommodationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const accommodation = await ctx.db.accommodation.findUnique({
        where: { id: input.accommodationId },
      });

      if (!accommodation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Accommodation not found' });
      }

      if (accommodation.ownerId === userId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Owner cannot leave' });
      }

      // Remove accommodation link from attendance
      await ctx.db.eventAttendance.updateMany({
        where: {
          userId,
          accommodationId: input.accommodationId,
        },
        data: {
          accommodationId: null,
          accommodationStatus: 'LOOKING',
        },
      });

      // Increase available spots
      await ctx.db.accommodation.update({
        where: { id: input.accommodationId },
        data: { availableSpots: { increment: 1 } },
      });

      return { success: true };
    }),
});
