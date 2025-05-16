import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TweetSchema } from "@/schemas/tweetSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heart, Image, Loader2, SmilePlus, Trash2 } from "lucide-react"
import { useState, useRef, useEffect, JSX } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { createTweet } from "@/services/tweet"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { IconBubble } from "@tabler/icons-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { requestPermission } from "@/lib/requestPermission"
import { likeNotification } from "@/services/notification"
import { useInView } from "react-intersection-observer"
import { useGetAllTweets } from "@/Hooks/useInfiniteQuery"
import { useDisikeTweet, useLikeTweet } from "@/Hooks/useLikeTweet"

type Tweet = {
  User?: {
    avatar: string,
    userName: string,
    _id: string
  }
  commentCount: number
  content: string
  createdAt: string
  isLiked: boolean
  likes: number
  media?: string
  mentions: string[]
  _id: string
}

const Home = () => {
  const [text, setText] = useState<string>("")
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false)
  const [preview, setPreview] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement | null>(null)
  
  const { theme } = useTheme()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user?.user)

  // Set up infinite query with React Query
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllTweets()

  // Set up intersection observer for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: '0px 0px 200px 0px'
  })

  // Flatten tweets from all pages
  const tweets = data?.pages.flat() as Tweet[] || []

  const tweetLikeMutation = useLikeTweet()

  const tweetDislikeMutation = useDisikeTweet()

  // Load more tweets when user scrolls to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof TweetSchema>>({
    resolver: zodResolver(TweetSchema),
    defaultValues: {
      content: ""
    }
  })

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const parseMentions = (
      content: string,
      mentions: string[] = []
    ): (string | JSX.Element)[] => {
      const words = content.split(/(\s+)/);
      let mentionIndex = 0;
  
      return words.map((word, idx) => {
        if (word.startsWith("@") && word.length > 1 && mentionIndex < mentions.length) {
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
 
  const handleEmojiSelect = (emoji: any) => {
    setText(prev => prev + emoji.emoji)
  }

  const handleIconClick = () => {
    fileRef.current?.click()
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      setValue("media", file)
      const imgURL = URL.createObjectURL(file)
      setPreview(imgURL)
    }
  }

  const HandleSubmit = async (data: z.infer<typeof TweetSchema>) => {
    setIsSubmitting(true)
    try {
      // Ensure text is properly set as content
      data.content = text
      
      await createTweet(data)
      
      // Clear the form
      setText("")
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ""
      setValue("media", undefined)
      
      toast("Tweet Posted successfully", {
        description: "Your tweet has been published",
        action: {
          label: "Refresh",
          onClick: () => refetch(),
        },
      })
    } catch (error) {
      console.error("Error creating tweet:", error)
      toast("Error occurred while creating tweet❌", {
        description: "Please try again",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  useEffect(() => {
    if(user?.isFirstLogin) {
      requestPermission()
    }
  }, [user])

  return (
    <div className="h-full w-full">
      <Card className="w-full p-4 relative top-0 left-0 mb-4">
        <CardContent>
            <form onSubmit={handleSubmit(HandleSubmit)}>
              <Textarea
                {...register("content")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind today"
                className="h-32 w-full resize-none text-lg md:text-xl font-bold"
              />
              {errors.content && <p className="text-red-500 font-bold text-sm md:text-lg">{errors.content.message}</p>}
              <div className="flex justify-between items-center mt-4">
                <div  className="flex gap-6 ml-2">
                  <div>
                    <Image className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={handleIconClick}/>
                    <Input
                      type="file"
                      accept="image/jpg image/jpeg image/png"
                      {...register("media")}
                      ref={(e) => {
                        fileRef.current = e
                      }}
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    {preview && (
                      <img src={preview} alt="image" className="h-32 w-32 rounded-lg object-cover" onClick={() => {
                        setPreview(null)
                        if(fileRef.current) fileRef.current.value = "";
                        setValue("media", undefined)
                      }}/>
                    )}
                  </div>
                  <div>
                    <SmilePlus className="h-6 w-6 text-black dark:text-white cursor-pointer" onClick={() => setShowPicker(prev => !prev)}/>
                    {showPicker && (
                      <div className="absolute z-10">
                        <EmojiPicker 
                          onEmojiClick={handleEmojiSelect}
                          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4 mr-2">
                  {text.length > 150 ? (
                    <div>
                      <h1 className="text-red-500 font-bold text-xl">
                        {text.length}
                      </h1>
                      <p className="text-red-500 font-bold text-sm md:text-lg">
                        Can't post more than 150 characters
                      </p>
                    </div>
                  ) : (
                    <h1 className=" font-bold text-xl">{text.length}</h1>
                  )}
                  {isSubmitting ? (
                    <Button
                      type="submit"
                      className="font-bold text-lg px-6 py-4"
                      disabled
                    >
                      Posting
                      <Loader2 className="animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="font-bold text-lg px-6 py-4 cursor-pointer"
                    >
                      Post
                    </Button>
                  )}
                </div>
              </div>
            </form>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end mt-4 mb-2 px-4">
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4" />
          Refresh Timeline
        </Button>
      </div>

      {/* Tweet List */}
      <div className="h-full w-full">
        {tweets.map((tweetItem) => (
          <div
            key={tweetItem._id}
            className="w-full p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            onClick={() => navigate(`/home/tweets/${tweetItem._id}`)}
          >
            <div className="flex items-start">
              <img
                src={tweetItem.User?.avatar || "https://via.placeholder.com/150"}
                alt="DP"
                className="h-10 w-10 object-cover rounded-full"
              />
              <div className="flex items-center">
                <div
                  className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation()
                    navigate(`/home/profile/${tweetItem.User?._id || ''}`)
                  }}
                >
                  {tweetItem.User?.userName || "Unknown User"}
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {formatDate(tweetItem.createdAt)}
                </div>
              </div>
            </div>

            <div className="text-md font-medium mt-2">
              {parseMentions(tweetItem.content, tweetItem.mentions)}
            </div>

            {tweetItem.media ? (
              <img
                src={tweetItem.media}
                alt="IMAGE"
                className="h-64 w-full object-cover mt-2 rounded-lg"
              />
            ) : null}

            <div className="flex items-center mt-2">
              {tweetItem.isLiked ? (
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  handleTweetDislike(tweetItem._id)
                }}>
                  <Heart
                    className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                    fill="#fb2c36"
                  />
                </button>
              ) : (
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  handleTweetLike(tweetItem._id)
                }}>
                  <Heart
                    className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                  />
                </button>
              )}
              <div className="ml-1">
                {isNaN(parseInt(String(tweetItem.likes))) ? 0 : tweetItem.likes}
              </div>
              <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  navigate(`/home/tweets/${tweetItem._id}`)
                }}>
                <IconBubble
                  className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8"
                />
              </button>
              <div className="ml-1">{tweetItem.commentCount}</div>
              {tweetItem.User?._id === user?._id ? (
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
    </div>
  )
}

export default Home