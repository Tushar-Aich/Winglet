import { z } from "zod";

export const otpSchema = z.object({
    code: z.string().max(6, "OTP isn't longer than 6 characters")
})