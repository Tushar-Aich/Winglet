import { Button } from "@/components/ui/button";
import { useGetLikedTweets } from "@/Hooks/useInfiniteQuery";
import { useDisikeTweet, useLikeTweet } from "@/Hooks/useLikeTweet";
import { likedTweet } from "@/Interfaces/tweet.interface";
import { likeNotification } from "@/services/notification";
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { JSX, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UserLikes = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '0px 0px 200px 0px'
  });

  // Set up infinite query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError,
    error,
    refetch
  } = useGetLikedTweets(userId as string);

  // Setup tweet like/dislike mutations
  const tweetLikeMutation = useLikeTweet();
  const tweetDislikeMutation = useDisikeTweet();

  // Process data for rendering - flatten the nested structure for easier rendering
  const likedTweetsData = data?.pages.flat() as likedTweet[] || []

  // Load more tweets when user scrolls to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const parseMentions = (
    content: string,
    mentions: string[]
  ): (string | JSX.Element)[] => {
    const words = content.split(/(\s+)/);
    let mentionIndex = 0;

    return words.map((word, idx) => {
      if (word.startsWith("@") && word.length > 1) {
        const userId = mentions[mentionIndex];
        mentionIndex++;
        return (
          <span
            key={idx}
            className="bg-blue-500 font-medium text-white hover:bg-blue-700 cursor-pointer"
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              e.stopPropagation()
              navigate(`/home/profile/${userId}`)
            }}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const handleTweetLike = async (tweetId: string) => {
    tweetLikeMutation.mutate(tweetId, {
      onSuccess: async () => {
        // Optimistic UI updates are handled by React Query refetch
        refetch();

        if(user?._id !== undefined) {
          const userId = user?._id as string;
          await likeNotification(userId, tweetId);
        }
      },
      onError: (error: any) => {
        toast(error.message || "Error liking tweet", {
          description: "Please try again"
        });
      }
    });
  };

  const handleTweetDislike = async (tweetId: string) => {
    tweetDislikeMutation.mutate(tweetId, {
      onSuccess: async () => {
        refetch();
      },
      onError: (error: any) => {
        toast(error.message || "Error disliking tweet", {
          description: "Please try again",
        });
      }
    });
  };

  return (
    <div className="h-full w-full">
      {likedTweetsData.length > 0 && likedTweetsData.map((tweet, idx) => (
        <div
          key={idx}
          className="w-full p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          onClick={() => navigate(`/home/tweets/${tweet.LikedTweet?._id}`)}
        >
          <div className="flex items-start">
            <img
              src={tweet?.LikedTweet?.tweetOwner?.avatar || "https://via.placeholder.com/150"}
              alt="DP"
              className="h-10 w-10 object-cover rounded-full"
            />
            <div className="flex items-center">
              <div
                className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation()
                  navigate(`/home/profile/${tweet?.LikedTweet?.tweetOwner?._id || ''}`)
                }}
              >
                {tweet?.LikedTweet?.tweetOwner?.userName || "Unknown User"}
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                {formatDate(tweet?.LikedTweet?.createdAt)}
              </div>
            </div>
          </div>

          <div className="text-md font-medium mt-2">
            {parseMentions(tweet?.LikedTweet?.content, tweet?.LikedTweet?.mentions)}
          </div>

          {tweet?.LikedTweet?.media ? (
            <img
              src={tweet?.LikedTweet?.media}
              alt="IMAGE"
              className="h-64 w-full object-cover mt-2 rounded-lg"
            />
          ) : null}

          <div className="flex items-center mt-2">
            {tweet?.LikedTweet?.isLiked ? (
              <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                handleTweetDislike(tweet?.LikedTweet?._id)
              }}>
                <Heart
                  className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                  fill="#fb2c36"
                />
              </button>
            ) : (
              <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                handleTweetLike(tweet?.LikedTweet?._id)
              }}>
                <Heart
                  className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                />
              </button>
            )}
            <div className="ml-1">
              {isNaN(parseInt(String(tweet?.LikedTweet?.likes))) ? 0 : tweet?.LikedTweet?.likes}
            </div>
            <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                navigate(`/home/tweets/${tweet?.LikedTweet?._id}`)
              }}>
              <IconBubble
                className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8"
              />
            </button>
            <div className="ml-1">{tweet?.LikedTweet?.commentCount}</div>
            {tweet?.LikedTweet?.tweetOwner?._id === user?._id ? (
              <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8" />
            ) : null}
          </div>
        </div>
      ))}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      
      {/* Infinite Scroll Loader - This is where the intersection observer is attached */}
      {!isLoading && hasNextPage && (
        <div 
          ref={ref} 
          className="flex justify-center p-4"
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <p className="text-sm text-muted-foreground">Scroll for more</p>
          )}
        </div>
      )}
      
      {/* No More Tweets Message */}
      {!hasNextPage && likedTweetsData.length > 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No more liked tweets to load
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && likedTweetsData.length === 0 && !isError && (
        <div className="text-center p-8">
          <p className="text-lg font-medium">No liked tweets yet</p>
          <p className="text-muted-foreground mt-1">Like some tweets to see them here!</p>
        </div>
      )}
      
      {/* Error State */}
      {isError && (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mx-4">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Error loading liked tweets: {(error as Error)?.message || "Something went wrong"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserLikes;
