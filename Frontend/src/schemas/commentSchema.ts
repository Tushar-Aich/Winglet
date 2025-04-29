import { z } from 'zod'

export const commentSchema = z.object({
    content: z.string().max(150, 'Comment cannot be more than 150 characters') 
})