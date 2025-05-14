import { getUser } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"


export const useGetUser = () => {
    return useMutation({
        mutationFn: (userId: string) => getUser(userId),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}