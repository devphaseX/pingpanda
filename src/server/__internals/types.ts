import { Env } from "hono";
import { User } from "./db/schemas";

export interface AppEnv extends Env {
  Variables: {
    user: User;
  };
}
