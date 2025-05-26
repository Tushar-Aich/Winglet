import { getUser, suggestedUsers } from "@/services/auth"
import { getUsersForSideBar } from "@/services/chat"
import { trendingTweets } from "@/services/tweet"
import { useQuery } from "@tanstack/react-query"


export const useTrending = () => {
    return useQuery({
        queryKey: ['trending'],
        queryFn: trendingTweets,
        staleTime: 1000 * 60 * 5
    })
}

export const useSuggestedUsers = () => {
    return useQuery({
        queryKey: ['suggested-users'],
        queryFn: suggestedUsers,
        staleTime: 1000 * 60 * 5
    })
}

export const useGetUser = (userId: string) => {
    return useQuery({
        queryKey: ['user', { userId: userId }],
        queryFn: () => getUser(userId),
        staleTime: 1000 * 60 * 5
    })
}

export const useGetUsersForSideBar = () => {
    return useQuery({
        queryKey: ['chat-users'],
        queryFn: () => getUsersForSideBar(),
        staleTime: 1000 * 60 * 5
    })
}