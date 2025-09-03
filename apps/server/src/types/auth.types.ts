import { z } from "zod";

export const UserAuthSchema = z.object({
  email: z.email(),
})

