import { type TypeOf, z } from "zod";
import dotenv from "dotenv";

dotenv.config();
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string(),
  APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors: any[],
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

const _serverEnv = envSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ...formatErrors(_serverEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}

export const env = _serverEnv.data;
Object.assign(process.env, env);

export type ServerEnv = TypeOf<typeof envSchema>;
declare global {
  namespace NodeJS {
    interface ProcessEnv extends ServerEnv, Dict<any> {}
  }
}

export function getEnv<Key extends keyof ServerEnv>(key: Key): ServerEnv[Key] {
  return env[key];
}
