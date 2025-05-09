import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./signUpSchema";


export const TweetSchema = z.object({
    content: z.string().max(150, "Content cannot be more than 150 characters"),
    media: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Invalid file type",
    }).refine((file) => file.size <= 5000000, {message: "Avatar must be less than 5MB"}).optional()
})