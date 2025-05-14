import { verifyOtp } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"
import { z } from "zod"
import { otpSchema } from "@/schemas/OTPSchema"


export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: ({ data, email }: { data: z.infer<typeof otpSchema>, email: string }) => verifyOtp(data, email),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}