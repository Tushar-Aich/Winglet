import { Button } from "@/components/ui/button";
import { useGetUserTweets } from "@/Hooks/useInfiniteQuery";
import { useDisikeTweet, useLikeTweet } from "@/Hooks/useLikeTweet";
import { likeNotification } from "@/services/notification";
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { JSX, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type tweet = {
  User: {
    avatar: string;
    userName: string;
    _id: string;
  };
  isLiked: boolean;
  comments: [];
  content: string;
  createdAt: string;
  likes: number;
  media: string;
  mentions: [];
  _id: string;
};

const UserChats = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '0px 0px 200px 0px'
  })

  const { 
      data, 
      fetchNextPage, 
      hasNextPage, 
      isFetchingNextPage, 
      isLoading,
      isError,
      error,
      refetch
    } = useGetUserTweets(userId as string)

  const tweets = data?.pages.flat() as tweet[] || []

  const tweetLikeMutation = useLikeTweet()
  
  const tweetDislikeMutation = useDisikeTweet()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const parseMentions = (
    content: string,
    mentions: []
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
            onClick={() => navigate(`/home/profile/${userId}`)}
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
        refetch()

        if(user?._id !== undefined) {
          const userId = user?._id as string
          await likeNotification(userId, tweetId)
        }
      },
      onError: (error: any) => {
        toast(error.message || "Error liking tweet", {
          description: "Please try again"
        })
      }
    })
  }

  const handleTweetDislike = async (tweetId: string) => {
    tweetDislikeMutation.mutate(tweetId, {
      onSuccess: async () => {
        refetch()
      },
      onError: (error: any) => {
        toast(error.message || "Error disliking tweet", {
          description: "Please try again",
        })
      }
    })
  }


  return (
    <div className="w-full">
      {tweets.map((tweetComp, idx) => (
        <div
          className="w-full p-4 border-b-1 border-black dark:border-neutral-700"
          key={idx}
        >
          <div className="flex items-start">
            <img
              src={tweetComp.User.avatar}
              alt="DP"
              className="h-10 w-10 object-cover rounded-full"
            />
            <div className="flex items-center">
              <div className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline" onClick={() => navigate(`/home/profile/${tweetComp.User._id}`)}>
                {tweetComp.User.userName}
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                {formatDate(tweetComp.createdAt)}
              </div>
            </div>
          </div>
          <div className="text-md font-medium">
            {parseMentions(tweetComp.content, tweetComp.mentions)}
          </div>
          {tweetComp.media ? (
            <img
              src={tweetComp.media}
              alt=""
              className="h-64 w-full object-cover mt-2 rounded-lg"
            />
          ) : null}
          <div className="flex items-center mt-2">
            {tweetComp.isLiked ? (
              <Heart
                className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                fill="#fb2c36"
                onClick={() => handleTweetDislike(tweetComp._id)}
              />
            ) : (
              <Heart
                className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                onClick={() => handleTweetLike(tweetComp._id)}
              />
            )}
            <div className="ml-1">{tweetComp.likes}</div>

            <IconBubble className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8" onClick={() => navigate(`/home/tweets/${tweetComp._id}`)}/>
            <div className="ml-1">{tweetComp.comments.length}</div>

            {tweetComp.User._id === user?._id ? (
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
        {!hasNextPage && tweets.length > 0 && (
          <div className="text-center p-4 text-muted-foreground">
            No more tweets to load
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && tweets.length === 0 && !isError && (
          <div className="text-center p-8">
            <p className="text-lg font-medium">No tweets yet</p>
            <p className="text-muted-foreground mt-1">Be the first to share something!</p>
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mx-4">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Error loading tweets: {(error as Error)?.message || "Something went wrong"}
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

export default UserChats;
