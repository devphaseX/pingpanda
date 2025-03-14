import { User, users } from "@/server/__internals/db/schemas";
import { db } from "@/server/__internals/db/setup";
import { eq } from "drizzle-orm";

export const getUserByExternalId = async (externalId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.external_id, externalId));

  return user;
};

export const getUserByApiKey = async (apiKey: string) => {
  const [user] = await db.select().from(users).where(eq(users.api_key, apiKey));

  return user;
};

type CreateUserData = Pick<
  User,
  "quota_limit" | "external_id" | "email" | "api_key"
>;
export const createUser = async (data: CreateUserData) => {
  const [user] = await db.insert(users).values(data).returning();

  return user;
};
