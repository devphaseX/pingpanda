import { z } from "zod";

export const setDiscordIdSchema = z.object({
  discord_id: z.string().min(1).max(50),
});
