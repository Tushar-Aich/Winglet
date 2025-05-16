import { getAllTweets, getLikedTweets, getUserTweets } from "@/services/tweet";
import { useInfiniteQuery } from "@tanstack/react-query";


export const useGetAllTweets = () => {
    return useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: getAllTweets,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined
        }
    })
}

export const useGetUserTweets = (userId: string) => {
    return useInfiniteQuery({
        queryKey: ['user-tweets', { userId: userId }],
        queryFn: ({ pageParam }) => getUserTweets(userId, { pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined
        }
    })
}

export const useGetLikedTweets = (userId: string) => {
    return useInfiniteQuery({
        queryKey: ['liked-tweets', { userId: userId }],
        queryFn: ({ pageParam }) => getLikedTweets(userId, { pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined
        }
    })
}