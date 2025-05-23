import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react'; // For loading spinner
import { useGenerateAiTweet, useGetAiTweetHistory, ChatHistoryItem } from '@/Hooks/useAiHooks'; // Adjust path
import { toast } from 'sonner';

const AITweetGeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const { mutate: generateTweet, data: generatedTweetData, isPending: isLoading, error: generationError } = useGenerateAiTweet();
  const { 
    data: historyData, 
    isLoading: isHistoryLoading, 
    error: historyError 
  } = useGetAiTweetHistory();

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }

    generateTweet(prompt.trim(), {
      onSuccess: () => {
        // data directly contains { tweet: "..." }
        toast.success("Tweet generated successfully!");
        // setPrompt(''); // Optionally clear prompt
      },
      onError: (err) => {
        // err is of type GenerateTweetError
        toast.error(err.message || "Failed to generate tweet. Please try again.");
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Tweet Generator</CardTitle>
          <CardDescription>
            Enter a prompt below and let AI generate a tweet for you. You can also view your past generated tweets and prompts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Prompt
              </label>
              <Textarea
                id="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., What are the benefits of learning a new programming language?"
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleSubmitPrompt}
              disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Tweet'
              )}
            </Button>

            {/* Display generation error */}
            {generationError && !isLoading && ( // Only show if not loading and error exists
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-semibold">Error generating tweet:</span> {generationError.message || "An unexpected error occurred. Please try again."}
                </p>
              </div>
            )}

            {/* Display generated tweet */}
            {generatedTweetData?.tweet && !isLoading && !generationError && ( 
              <Card className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-lg">Generated Tweet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 dark:text-blue-300">{generatedTweetData.tweet}</p>
                </CardContent>
              </Card>
            )}

            {/* Display error from hook - This was the old location, it's now handled above or by toast */}
            {/* {generationError && (
              <Card className="mt-6 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-600 dark:text-red-500">{generationError.message}</p>
                </CardContent>
              </Card>
            )} */}
            
            {/* Chat/Tweet History section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Generation History</h2>
              
              {isHistoryLoading && (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
                  <p className="ml-2 text-gray-500 dark:text-gray-400">Loading history...</p>
                </div>
              )}

              {historyError && !isHistoryLoading && (
                <div className="text-center py-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Error loading history: {historyError.message || "Something went wrong"}
                  </p>
                  {/* Optional: Add a refetch button here if desired */}
                </div>
              )}

              {!isHistoryLoading && !historyError && (!historyData || historyData.length === 0) && (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">No generation history found.</p>
                </div>
              )}

              {!isHistoryLoading && !historyError && historyData && historyData.length > 0 && (
                <div className="space-y-4">
                  {historyData.map((item: ChatHistoryItem) => ( // Make sure ChatHistoryItem is imported
                    <Card key={item._id}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Prompt:</p>
                        <p className="mb-2 text-gray-800 dark:text-gray-200">{item.prompt}</p>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">AI Generated Tweet:</p>
                        <p className="text-green-700 dark:text-green-300">{item.response}</p>
                        {item.timestamp && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITweetGeneratorPage;
