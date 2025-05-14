import { suggestedUsers } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"


export const useSuggestedUser = () => {
    return useMutation({
        mutationFn: (xyz: number) => suggestedUsers(),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}