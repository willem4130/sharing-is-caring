import { createCallerFactory, createTRPCRouter } from './trpc';
import { authRouter } from './routers/auth';
import { usersRouter } from './routers/users';
import { eventsRouter } from './routers/events';
import { matchesRouter } from './routers/matches';
import { messagesRouter } from './routers/messages';
import { accommodationsRouter } from './routers/accommodations';
import { reviewsRouter } from './routers/reviews';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  events: eventsRouter,
  matches: matchesRouter,
  messages: messagesRouter,
  accommodations: accommodationsRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
