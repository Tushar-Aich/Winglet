import { z } from "zod";

export const verifySchema = z.object({
    email: z.string().email("Invalid email"),
    code: z.string().min(6, "Code must be 6 characters")
})