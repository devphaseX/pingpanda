import { createMiddleware } from "hono/factory";
import StatusCodes from "http-status";
import { getUserByApiKey } from "@/features/users/server/user.service";
import { Context } from "hono";
import { User } from "../db/schemas";
import { AppEnv } from "../types";
import { errorResponse } from "@/utils/response";

const userContextKey = "user";

export const withApiKeyMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (authHeader) {
      const [apiKeyHeader, apiKey] = authHeader.split(" ");

      if (apiKeyHeader !== "Bearer") {
        c.status(StatusCodes.UNAUTHORIZED);
        return errorResponse(c, `Invalid API key type. Expected Bearer`);
      }

      const user = await getUserByApiKey(apiKey);

      if (!user) {
        c.status(StatusCodes.UNAUTHORIZED);
        return errorResponse(c, `Invalid API key`);
      }

      setAuthUser(c, user);
    }

    return next();
  },
);

export function setAuthUser(c: Context<AppEnv>, user: User) {
  c.set(userContextKey, user);
}

export function getAuthUser(c: Context<AppEnv>) {
  return c.get(userContextKey);
}
