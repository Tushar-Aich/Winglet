import { dislikeTweet, likeTweet } from "@/services/tweet"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from "@sentry/react"


export const useLikeTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => likeTweet(tweetId),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}

export const useDisikeTweet = () => {
    return useMutation({
        mutationFn: (tweetId: string) => dislikeTweet(tweetId),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}