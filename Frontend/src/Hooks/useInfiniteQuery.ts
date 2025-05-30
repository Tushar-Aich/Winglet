import { getAllTweets, getLikedTweets, getUserTweets } from "@/services/tweet";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/services/chat";

// Define Message interface (can be imported if shared)
export interface ChatMessage {
  _id: string;
  sender: { _id: string; name: string; avatar: string; };
  receipent: string;
  content?: string;
  images?: string[];
  createdAt: string;
  read?: boolean;
}

// Define the expected API response structure for a page of messages
export interface ChatMessagesPage {
  messages: ChatMessage[];
}

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

export const useGetChatMessages = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['chat-messages', { id }],
    queryFn: ({ pageParam }) => getMessages(id, { pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined
    }
  })
}