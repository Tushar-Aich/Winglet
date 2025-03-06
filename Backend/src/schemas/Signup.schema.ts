import { z } from "zod";

export const SignUpSchema = z.object({
  userName: z
    .string()
    .min(3, "username cannot be shorter than 3 characters")
    .max(20, "username cannot be longer than 20 characters")
    .toLowerCase()
    .trim()
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "UserNames can only contain letters, numbers or underscores"
    ),
  email: z.string().email(),
  password: z.string().min(8, "password cannot be shorter than 8 characters"),
  OGName: z.string().max(20, "OGName cannot be shorter than 20 characters"),
});

export const BioSchema = z
  .string()
  .max(200, "bio cannot be greater than 200 characters");
