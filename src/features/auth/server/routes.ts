import {
  createUser,
  getUserByExternalId,
} from "@/features/users/server/user.service";
import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const app = new Hono().post("/sync", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ is_synced: false });
  }

  let user = await getUserByExternalId(auth.userId);

  if (!user) {
    const clerkClient = c.get("clerk");
    const userData = await clerkClient.users.getUser(auth.userId);

    user = await createUser({
      external_id: auth.userId,
      email: userData.emailAddresses[0].emailAddress,
      quota_limit: 100,
    });
  }

  return c.json({ is_synced: true });
});

export default app;
