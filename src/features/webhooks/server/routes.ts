import { updateUser } from "@/features/users/server/user.service";
import { stripe } from "@/lib/stripe";
import { Plan } from "@/server/__internals/constants/enums";
import { getEnv } from "@/server/__internals/env";
import { AppEnv } from "@/server/__internals/types";
import { errorResponse, successResponse } from "@/utils/response";
import { Hono } from "hono";
import StatusCodes from "http-status";
import Stripe from "stripe";

const app = new Hono<AppEnv>().post("/stripe", async (c) => {
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    return errorResponse(
      c,
      "Missing Stripe signature",
      StatusCodes.BAD_REQUEST,
    );
  }

  const event = stripe.webhooks.constructEvent(
    await c.req.text(),
    signature,
    getEnv("STRIPE_WEBHOOK_SECRET"),
  );

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const { user_id } = <{ user_id: string }>session.metadata ?? {
        user_id: "",
      };

      if (!user_id) {
        return errorResponse(c, "Invalid metadata", StatusCodes.BAD_REQUEST);
      }

      await updateUser(user_id, { plan: Plan.PRO });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return successResponse(c, { recieved: true });
});

export default app;
