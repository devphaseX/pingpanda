import { requiredAuth } from "@/server/__internals/middleware/required_auth";
import { AppEnv } from "@/server/__internals/types";
import { successResponse } from "@/utils/response";
import { Hono } from "hono";
import { updateUser } from "./user.service";
import { zValidator } from "@hono/zod-validator";
import { setDiscordIdSchema } from "../schemas/set_discord_id_schema";
import { validateErrorHook } from "@/lib/zod_validator_response_formatter";

const app = new Hono<AppEnv>()
  .use(requiredAuth)
  .get("/current", async (c) => {
    const user = c.get("user");
    return successResponse(c, { user });
  })
  .get("/plan", async (c) => {
    const user = c.get("user");
    return successResponse(c, { plan: user.plan });
  })
  .patch(
    "/discord",
    zValidator(
      "json",
      setDiscordIdSchema,
      validateErrorHook("invalid request body"),
    ),
    async (c) => {
      const user = c.get("user");

      const { discord_id } = c.req.valid("json");

      const updatedUser = await updateUser(user.id, { discord_id });

      return successResponse(c, { data: { id: updatedUser.id } });
    },
  );

export default app;
