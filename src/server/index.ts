import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import StatusCodes from "http-status";

import authRouter from "@/features/auth/server/routes";
import eventCategoriesRouter from "@/features/event_categories/server/routes";
import eventsRouter from "@/features/events/v1/server/routes";
import paymentsRouter from "@/features/payments/server/routes";
import quotasRouter from "@/features/quotas/server/routes";
import { withApiKeyMiddleware } from "./__internals/middleware/with_api_key";
import { errorResponse } from "@/utils/response";

const app = new Hono().basePath("/api").use(cors()).use(clerkMiddleware());
/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */

const v1 = new Hono()
  .basePath("/v1")
  .use(withApiKeyMiddleware)
  .route("/events", eventsRouter);

const appRouter = app
  .route("/", v1)
  .route("/auth", authRouter)
  .route("/event-categories", eventCategoriesRouter)
  .route("/payments", paymentsRouter)
  .route("/quotas", quotasRouter);

app.onError((error, c) => {
  c.status(StatusCodes.INTERNAL_SERVER_ERROR);
  console.log(`Error: ${error.message}`);
  return errorResponse(c, "we are experiencing issues");
});

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

export default app;

// export type definition of API
export type AppType = typeof appRouter;
