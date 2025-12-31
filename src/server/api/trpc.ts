import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { auth } from '@/server/auth';
import { db } from '@/server/db';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // Check for mock user ID header (development mode without auth)
  const mockUserId = opts.headers.get('x-mock-user-id');

  let session = await auth();

  // If no real session but we have a mock user ID, create a mock session
  if (!session && mockUserId) {
    session = {
      user: {
        id: mockUserId,
        name: 'Mock User',
        email: `${mockUserId}@mock.com`,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

/**
 * Public procedure - no auth required
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: { ...ctx.session.user, id: ctx.session.user.id },
      },
    },
  });
});

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
