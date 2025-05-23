import { VoiceClone } from "@/services/voice"
import { useMutation } from "@tanstack/react-query"
import * as Sentry from '@sentry/react'


export const useVoiceClone = () => {
    return useMutation({
        mutationFn: (blob: Blob) => VoiceClone(blob),
        onError: (error: unknown) => {
            Sentry.captureException(error)
        }
    })
}