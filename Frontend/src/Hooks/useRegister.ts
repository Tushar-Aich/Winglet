import { signUp } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"
import { z } from "zod"
import { SignUpSchema } from "@/schemas/signUpSchema"


export const useRegister = () => {
    return useMutation({
        mutationFn: ({ data, email }: { data: z.infer<typeof SignUpSchema>, email: string }) => signUp(data, email),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}