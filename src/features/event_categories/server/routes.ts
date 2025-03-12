import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { DatabaseError } from "pg";
import StatusCodes from "http-status";
import { startOfMonth } from "date-fns";
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
} from "@/utils/response";

import { validateErrorHook } from "@/lib/zod_validator_response_formatter";
import { requiredAuth } from "@/server/__internals/middleware/required_auth";
import { AppEnv } from "@/server/__internals/types";
import {
  bulkCreateEventCategory,
  createEventCategory,
  CreateEventCategoryData,
  deleteEventCategory,
  getCategoriesWithEventCounts,
  getEventCategories,
} from "./event_categories.service";
import tryit from "@/lib/tryit";
import { ErrorCode } from "@/server/__internals/constants/response_code";
import { parseColour } from "@/lib/utils";
import createEventCategorySchema from "../schemas/create_event_categories";

const app = new Hono<AppEnv>()
  .use(requiredAuth)
  .get("/", async (c) => {
    const user = c.get("user");

    const eventCategories = await getEventCategories(user.id);

    const eventCategoryIds = eventCategories.map((category) => category.id);
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);

    const categoriesWithCounts = await getCategoriesWithEventCounts(
      eventCategoryIds,
      { startDate: firstDayOfMonth, endDate: now },
    );

    const categoriesWithFieldCounts = categoriesWithCounts.map(
      ({ fields, ...rest }) => {
        const fieldNames = new Set<string>();
        Object.keys(fields).forEach((field) => fieldNames.add(field));

        return {
          ...rest,
          tracking_field_counts: fieldNames.size,
        };
      },
    );

    return successResponse(c, { categories: categoriesWithFieldCounts });
  })
  .post(
    "/",
    zValidator(
      "json",
      createEventCategorySchema,
      validateErrorHook("invalid request body"),
    ),
    async (c) => {
      const user = c.get("user");
      const payload = c.req.valid("json");

      const [eventCategory, createEventCategoryErr] = await tryit(
        createEventCategory({
          name: payload.name,
          emoji: payload.emoji ?? "",
          user_id: user.id,
          colour: parseColour(payload.colour),
        }),
      );

      if (createEventCategoryErr) {
        if (createEventCategoryErr instanceof DatabaseError) {
          if (
            createEventCategoryErr.constraint ===
            "event_categories_user_id_users_id_fk"
          ) {
            return errorResponse(c, "user not found", StatusCodes.NOT_FOUND, {
              error_code: ErrorCode.NOT_FOUND,
            });
          }

          if (createEventCategoryErr.constraint === "user_event_unique") {
            return errorResponse(
              c,
              "event category already exists",
              StatusCodes.CONFLICT,
              {
                error_code: ErrorCode.CONFLICT,
              },
            );
          }
        }
        return internalServerErrorResponse(c, {
          errors: createEventCategoryErr,
        });
      }

      return successResponse(c, { eventCategory }, StatusCodes.CREATED);
    },
  )
  .delete("/:categoryName", async (c) => {
    const categoryName = c.req.param("categoryName");
    const user = c.get("user");

    const [deletedCategory, deleteCategoryErr] = await tryit(
      deleteEventCategory(categoryName, user.id),
    );

    if (deleteCategoryErr) {
      return internalServerErrorResponse(c, {
        errors: deleteCategoryErr,
      });
    }

    if (!deletedCategory) {
      return errorResponse(
        c,
        "event category not found",
        StatusCodes.NOT_FOUND,
        {
          error_code: ErrorCode.NOT_FOUND,
        },
      );
    }

    return successResponse(
      c,
      { data: { id: deletedCategory.id } },
      StatusCodes.OK,
    );
  })
  .post("/quick-start", async (c) => {
    const { id } = c.get("user");
    let quickStartEventCategories: Array<CreateEventCategoryData> = [
      {
        name: "Bug",
        emoji: "🚀️",
        colour: 0xff6b6b,
        user_id: "",
      },
      { name: "Sale", emoji: "💰️", colour: 0xffeb3b, user_id: "" },
      { name: "Question", emoji: "🤔️", colour: 0x6c5ce7, user_id: "" },
    ];

    quickStartEventCategories = quickStartEventCategories.map((category) => ({
      ...category,
      user_id: id,
    }));

    const eventCategories = await bulkCreateEventCategory(
      quickStartEventCategories,
    );

    return successResponse(c, {
      data: { eventCategories },
      message: "quick event categories setup",
    });
  });

export default app;
