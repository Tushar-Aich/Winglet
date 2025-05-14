import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"
import { z } from "zod"
import { emailSchema } from "@/schemas/EmailVerification"
import { sendEmail } from "@/services/auth"



export const useSendEmail = () => {
    return useMutation({
        mutationFn: (data: z.infer<typeof emailSchema>) => sendEmail(data),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}