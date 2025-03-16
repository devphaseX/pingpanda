import { createCheckoutSession } from "@/lib/stripe";
import { Plan } from "@/server/__internals/constants/enums";
import { getEnv } from "@/server/__internals/env";
import { requiredAuth } from "@/server/__internals/middleware/required_auth";
import { AppEnv } from "@/server/__internals/types";
import { errorResponse, successResponse } from "@/utils/response";
import { Hono } from "hono";
import StatusCodes from "http-status";

const app = new Hono<AppEnv>()
  .use(requiredAuth)
  .post("/checkout", async (c) => {
    const user = c.get("user");

    if (user.plan === Plan.PRO) {
      return errorResponse(c, "Already subscribed", StatusCodes.FORBIDDEN);
    }

    const successUrl = `${getEnv("NEXT_PUBLIC_APP_URL")}/dashboard?success=true`;
    const cancelUrl = `${getEnv("NEXT_PUBLIC_APP_URL")}/pricing`;
    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: user.email,
      successUrl,
      cancelUrl,
    });

    return successResponse(c, { url: session.url }, StatusCodes.CREATED);
  });

export default app;
