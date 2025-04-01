import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

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
  password: z.string().min(8, "password cannot be shorter than 8 characters"),
  OGName: z.string().max(20, "OGName cannot be shorter than 20 characters"),
  avatar: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Invalid file type",
  }).refine((file) => file.size <= 5000000, {message: "Avatar must be less than 5MB"})
});