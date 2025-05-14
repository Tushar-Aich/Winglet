import { searchUser } from "@/services/auth"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"


export const useSearchUser = () => {
    return useMutation({
        mutationFn: (search: string) => searchUser(search),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}