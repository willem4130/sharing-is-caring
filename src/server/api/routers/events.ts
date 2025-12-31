import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const eventsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        upcoming: z.boolean().default(true),
        country: z.string().optional(),
        eventType: z
          .enum([
            'MUSIC_FESTIVAL',
            'CONFERENCE',
            'CONCERT',
            'SPORTS_EVENT',
            'CONVENTION',
            'TRADE_SHOW',
            'CULTURAL_EVENT',
            'OTHER',
          ])
          .optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        isActive: true,
        ...(input.upcoming && { startDate: { gte: new Date() } }),
        ...(input.country && { country: input.country }),
        ...(input.eventType && { eventType: input.eventType }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' as const } },
            { description: { contains: input.search, mode: 'insensitive' as const } },
            { city: { contains: input.search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [events, total] = await Promise.all([
        ctx.db.event.findMany({
          where,
          orderBy: { startDate: 'asc' },
          skip,
          take: input.limit,
          include: {
            _count: { select: { attendances: true } },
          },
        }),
        ctx.db.event.count({ where }),
      ]);

      return {
        events,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { id: input.id },
        include: {
          attendances: {
            take: 10,
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          accommodations: {
            where: { isActive: true, availableSpots: { gt: 0 } },
            take: 5,
            include: {
              owner: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          _count: { select: { attendances: true, accommodations: true } },
        },
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      return event;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { slug: input.slug },
        include: {
          attendances: {
            take: 10,
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          accommodations: {
            where: { isActive: true, availableSpots: { gt: 0 } },
            take: 5,
            include: {
              owner: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          _count: { select: { attendances: true, accommodations: true } },
        },
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      return event;
    }),

  attend: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        accommodationStatus: z.enum(['LOOKING', 'HAVE_ROOM', 'NOT_NEEDED']).default('LOOKING'),
        arrivalDate: z.date().optional(),
        departureDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.eventAttendance.upsert({
        where: {
          userId_eventId: {
            userId: ctx.session.user.id,
            eventId: input.eventId,
          },
        },
        update: {
          accommodationStatus: input.accommodationStatus,
          arrivalDate: input.arrivalDate,
          departureDate: input.departureDate,
        },
        create: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
          accommodationStatus: input.accommodationStatus,
          arrivalDate: input.arrivalDate,
          departureDate: input.departureDate,
        },
      });
    }),

  unattend: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.eventAttendance.deleteMany({
        where: {
          userId: ctx.session.user.id,
          eventId: input.eventId,
        },
      });
    }),

  getAttendees: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        accommodationStatus: z.enum(['LOOKING', 'HAVE_ROOM', 'NOT_NEEDED']).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        eventId: input.eventId,
        ...(input.accommodationStatus && { accommodationStatus: input.accommodationStatus }),
      };

      const [attendances, total] = await Promise.all([
        ctx.db.eventAttendance.findMany({
          where,
          skip,
          take: input.limit,
          include: {
            user: {
              select: { id: true, name: true, image: true },
              include: { profile: true },
            },
          },
        }),
        ctx.db.eventAttendance.count({ where }),
      ]);

      return {
        attendees: attendances,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  getMyEvents: protectedProcedure
    .input(z.object({ upcoming: z.boolean().default(true) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.eventAttendance.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.upcoming && { event: { startDate: { gte: new Date() } } }),
        },
        include: {
          event: true,
        },
        orderBy: { event: { startDate: 'asc' } },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3).max(200),
        slug: z.string().min(3).max(100),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        websiteUrl: z.string().url().optional(),
        eventType: z.enum([
          'MUSIC_FESTIVAL',
          'CONFERENCE',
          'CONCERT',
          'SPORTS_EVENT',
          'CONVENTION',
          'TRADE_SHOW',
          'CULTURAL_EVENT',
          'OTHER',
        ]),
        tags: z.array(z.string()).optional(),
        startDate: z.date(),
        endDate: z.date(),
        venueName: z.string().optional(),
        address: z.string().optional(),
        city: z.string(),
        country: z.string(),
        expectedAttendance: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.event.create({ data: input });
    }),
});
