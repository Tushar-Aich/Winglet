import { z } from "zod";


export const BioSchema = z.object({
    bio: z.string().max(200, "Bio cannot be more than 200 characters")
})