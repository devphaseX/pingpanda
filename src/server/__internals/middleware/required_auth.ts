import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

import StatusCodes from "http-status";
import { getAuthUser, setAuthUser } from "./with_api_key";
import { getUserByExternalId } from "@/features/users/server/user.service";
import { errorResponse } from "@/utils/response";

export const requiredAuth = createMiddleware(async (c, next) => {
  let user = getAuthUser(c);

  if (!user) {
    const auth = getAuth(c);

    if (!auth?.userId) {
      c.status(StatusCodes.UNAUTHORIZED);
      return errorResponse(c, "unauthorized");
    }
    user = await getUserByExternalId(auth.userId);
  }

  if (!user) {
    c.status(StatusCodes.UNAUTHORIZED);
    return errorResponse(c, "unauthorized");
  }

  setAuthUser(c, user);
  return next();
});
