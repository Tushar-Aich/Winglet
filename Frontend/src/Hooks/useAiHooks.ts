import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { generateAiTweetAPI } from '../services/aiService'; // Adjust path as needed

interface GenerateTweetResponse {
  tweet: string;
}

interface GenerateTweetError {
  message: string; // Or a more specific error type from your API
}

export const useGenerateAiTweet = (): UseMutationResult<
  GenerateTweetResponse,
  GenerateTweetError, // Type for error
  string // Type for variables (the prompt string)
> => {
  return useMutation<GenerateTweetResponse, GenerateTweetError, string>({
    mutationFn: (prompt: string) => generateAiTweetAPI(prompt),
    // Optional: onSuccess, onError, onSettled can be defined here or
    // when calling mutate in the component
  });
};

import { useQuery, UseQueryResult } from '@tanstack/react-query'; // Add useQuery
import { getAiTweetHistoryAPI, ChatHistoryItem } from '../services/aiService'; // Adjust path

interface AiTweetHistoryError {
  message: string; // Or a more specific error type
}

export const useGetAiTweetHistory = (): UseQueryResult<
  ChatHistoryItem[],
  AiTweetHistoryError
> => {
  return useQuery<ChatHistoryItem[], AiTweetHistoryError, ChatHistoryItem[], string[]>({
    queryKey: ['aiTweetHistory'], // Unique key for this query
    queryFn: getAiTweetHistoryAPI,
    // Optional: staleTime, cacheTime, refetchOnWindowFocus, etc.
  });
};
