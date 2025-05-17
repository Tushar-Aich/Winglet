import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./signUpSchema";


export const AvatarSchema = z.object({
    avatar: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type",
    }).refine((file) => file.size <= 5000000, {message: "Avatar must be less than 5MB"})
})


export const CoverImageSchema = z.object({
    coverImage: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type",
    }).refine((file) => file.size <= 5000000, {message: "Cover Image must be less than 5MB"})
})