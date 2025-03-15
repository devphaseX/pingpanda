import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createEventSchema } from "../schemas/create_event_schema";
import { validateErrorHook } from "@/lib/zod_validator_response_formatter";
import { requiredAuth } from "@/server/__internals/middleware/required_auth";
import { AppEnv } from "@/server/__internals/types";
import { errorResponse, successResponse } from "@/utils/response";
import StatusCodes from "http-status";
import { getMonth } from "date-fns";
import {
  getCurrentQuota,
  upsertQuota,
} from "@/features/quotas/server/quota.service";
import { DeliverStatus, PlanQuota } from "@/server/__internals/constants/enums";
import { DiscordClient } from "@/lib/discord_client";
import { getEnv } from "@/server/__internals/env";
import { getEventCategoryByName } from "@/features/event_categories/queries/get_event_category_by_name";
import { APIEmbed } from "discord-api-types/v10";
import {
  createEvent,
  getEventByCategoryName,
  updateEvent,
} from "./events.service";
import tryit from "@/lib/tryit";
import {
  getEventsByCategoryNameQuerySchema,
  getEventsByCategoryNameSchema,
} from "../schemas/get_events_by_category_name_schema";

const app = new Hono<AppEnv>()
  .use(requiredAuth)
  .post(
    "/",
    zValidator(
      "json",
      createEventSchema,
      validateErrorHook("invalid request body"),
    ),
    async (c) => {
      const user = c.get("user");
      const payload = c.req.valid("json");

      if (!user.discord_id) {
        return errorResponse(
          c,
          "Please link your Discord ID in your account settings.",
          StatusCodes.FORBIDDEN,
        );
      }
      const quota = await getCurrentQuota(user.id);

      const quotaLimit = PlanQuota[user.plan];

      if (quota && quotaLimit && quota.count >= quotaLimit.maxEventsPerMonth) {
        return errorResponse(
          c,
          "You have reached your monthly event limit. Please upgrade your plan to create more events.",
          StatusCodes.PAYMENT_REQUIRED,
        );
      }

      const eventCategory = await getEventCategoryByName(
        payload.category_name,
        user.id,
      );

      if (!eventCategory) {
        return errorResponse(
          c,
          "Event category not found",
          StatusCodes.NOT_FOUND,
        );
      }

      const discord = new DiscordClient(getEnv("DISCORD_TOKEN"));

      const dmChannel = await discord.createDM(user.discord_id);

      const eventData: APIEmbed = {
        title: `${eventCategory.emoji ?? "🛎️"} ${eventCategory.name.charAt(0).toUpperCase() + eventCategory.name.slice(1)}`,
        description:
          payload.description ??
          `A new ${eventCategory.name} event has occurred!`,
        color: eventCategory.colour,
        timestamp: new Date().toISOString(),
        fields: Object.entries(payload.fields ?? {}).map(([key, value]) => ({
          name: key,
          value: String(value),
          inline: true,
        })),
      };

      const event = await createEvent({
        name: eventCategory.name,
        event_category_id: eventCategory.id,
        user_id: user.id,
        formatted_message: `${eventData.title}\n\n${eventData.description}`,
        fields: payload.fields ?? {},
      });

      const [, discordSendMsgErr] = await tryit(
        discord.sendEmbed(dmChannel.id, eventData),
      );

      await updateEvent(event.id, {
        deliver_status: discordSendMsgErr
          ? DeliverStatus.FAILED
          : DeliverStatus.DELIVERED,
      });

      if (discordSendMsgErr) {
        return errorResponse(
          c,
          "Error processing event",
          StatusCodes.INTERNAL_SERVER_ERROR,

          { errors: { event_id: event.id } },
        );
      }

      await upsertQuota(user.id);

      return successResponse(c, {
        message: "Event created successfully",
        event_id: event.id,
      });
    },
  )
  .get(
    "/",
    zValidator(
      "query",
      getEventsByCategoryNameQuerySchema,
      validateErrorHook("invalid request query"),
    ),
    async (c) => {
      const user = c.get("user");

      const { category_name, page, perPage, period } = c.req.valid("query");
      const eventsContent = await getEventByCategoryName(
        category_name,
        user.id,
        { page, perPage, period },
        c.req.url,
      );

      return successResponse(c, {
        events: eventsContent.data,
        metdata: eventsContent.meta,
      });
    },
  );

export default app;
