import axiosInstance from './axios';

interface GenerateTweetPayload {
  prompt: string;
}

interface GenerateTweetResponse {
  tweet: string;
  // Add other expected fields from the API response if any
}

export const generateAiTweetAPI = async (prompt: string): Promise<GenerateTweetResponse> => {
  const payload: GenerateTweetPayload = { prompt };
  try {
    // The backend route is /api/ai/generate-tweet.
    // axiosInstance is configured with a baseURL like /api
    const response = await axiosInstance.post<GenerateTweetResponse>('/ai/generate-tweet', payload);
    return response.data;
  } catch (error) {
    // Handle or transform error as needed, or let React Query handle it
    console.error('Error generating AI tweet:', error);
    throw error; // Re-throw to be caught by React Query's onError
  }
};

export interface ChatHistoryItem {
  _id: string;
  userId: string;
  prompt: string;
  response: string; // This is the AI-generated tweet
  timestamp: string; // Or Date, adjust as per actual API response
}

export const getAiTweetHistoryAPI = async (): Promise<ChatHistoryItem[]> => {
  try {
    // The backend route is /api/chatbot/history.
    // Assuming axiosInstance is configured with a baseURL like /api
    const response = await axiosInstance.get<{ data: ChatHistoryItem[] }>('/chatbot/history');
    // The actual history data seems to be nested under a `data` property in the ApiResponse
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching AI tweet history:', error);
    throw error;
  }
};
