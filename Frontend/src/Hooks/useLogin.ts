import { login } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"


export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) => login(email, password),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}