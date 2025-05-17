import { AvatarSchema, CoverImageSchema } from "@/schemas/ImageSchema";
import { updateAvatar, updateBio, updateBirthDate, updateCoverImage } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import * as Sentry from "@sentry/react"


export const useAvatarUpdate = () => {
    return useMutation({
        mutationFn: (data: z.infer<typeof AvatarSchema>) => updateAvatar(data),
        onError: (error: any) => {
            Sentry.captureException(error)
            console.log(error)
        }
    })
}

export const useCoverImage = () => {
    return useMutation({
        mutationFn: (data: z.infer<typeof CoverImageSchema>) => updateCoverImage(data),
        onError: (error: any) => {
            Sentry.captureException(error)
        }
    })
}

export const useUpdateBio = () => {
    return useMutation({
        mutationFn: (bio: string) => updateBio(bio),
        onError: (error: any) => {
            Sentry.captureException(error)
        }
    })
}

export const useUpdateBirthDate = () => {
    return useMutation({
        mutationFn: (birthDate: string) => updateBirthDate(birthDate),
        onError: (error: any) => {
            Sentry.captureException(error)
        }
    })
}