import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TweetSchema } from "@/schemas/tweetSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heart, Image, Loader2, SmilePlus, Trash2 } from "lucide-react"
import { useState, useRef, useEffect, useCallback, JSX } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { createTweet, dislikeTweet, getAllTweets, likeTweet } from "@/services/tweet"
import { toast } from "sonner"
import useThrottle from "../Hooks/useThrottle"
import { useNavigate } from "react-router-dom"
import { IconBubble } from "@tabler/icons-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { requestPermission } from "@/lib/requestPermission"
import { likeNotification } from "@/services/notification"

type tweet = {
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

  const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);

  const [preview, setPreview] = useState<string | null>(null)

  const [page, setPage] = useState<number>(1)  

  const [loading, setLoading] = useState<boolean>(false)

  const [hasMore, setHasMore] = useState<boolean>(true)

  const [tweet, setTweet] = useState<tweet[]>([])

  const fileRef = useRef<HTMLInputElement | null>(null)

  const hasFetched = useRef<boolean>(false)
  
  const { theme } = useTheme()

  const navigate = useNavigate()

  const user = useSelector((state: RootState) => state.user?.user);

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
      data.content = text; // Update content with the text state
      
      // Log with JSON.stringify to properly display emojis in console
      console.log("Tweet data:", data);
      console.log("Content with emojis:", JSON.stringify(data.content));
      
      const res = await createTweet(data);
      console.log("Response:", res.data);
      
      // Don't add the new tweet to the UI
      // Let the user refresh to see new tweets
      
      // Clear the form
      setText("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setValue("media", undefined);
      
      toast("Tweet Posted successfully", {
        description: "Refresh to see your new tweet",
        action: {
          label: "Refresh Now",
          onClick: () => {
            setTweet([]);
            setPage(1);
            setHasMore(true);
            hasFetched.current = false;
            fetchTweets();
          },
        },
      });
    } catch (error) {
      console.error("Error creating tweet:", error);
      toast("Error occurred while creating tweet❌", {
        description: "Please try again",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fetchTweets = useCallback(async () => {
    if(!hasMore || loading) return;
    
    setLoading(true)
    try {
      const newTweets = await getAllTweets(page)
      const data = newTweets.data.data

      console.log('Fetched tweets:', data)
      
      // Make sure likes is a number for all tweets
      const processedTweets = data.map((tweet: any) => ({
        ...tweet,
        likes: typeof tweet.likes === 'number' ? tweet.likes : parseInt(tweet.likes) || 0
      }));
      
      setTweet(prev => [...prev, ...processedTweets])
      setPage(prev => prev + 1)

      if(data.length === 0) setHasMore(false);
    } catch (error) {
      console.error("Error fetching tweets:", error)
      toast("Error loading tweets", {
        description: "Please try again",
      });
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  const handleScroll = useCallback(() => {
    if (
      !loading && 
      hasMore && 
      (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 300)
    ) {
      fetchTweets();
    }
  }, [fetchTweets, loading, hasMore])

  //prevents invalid hook call problem
  const throttled = useThrottle(handleScroll, 500)

  useEffect(() => {
    // Call fetchTweets only once when the component mounts
    if(!hasFetched.current) {
      hasFetched.current = true
      fetchTweets()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTweets])

  useEffect(() => {
    const scrollHandler = throttled();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [throttled])

  const handleTweetLike = async (tweetId: string) => {
    try {
      // Call the API to like the tweet on the server
      await likeTweet(tweetId);
      
      // Optimistic UI update - this gives immediate feedback to the user
      setTweet(prevTweets => 
        prevTweets.map(tweet => {
          if (tweet._id === tweetId) {
            console.log('Liking tweet:', tweet._id);
            console.log('Before like - likes:', tweet.likes, 'isLiked:', tweet.isLiked);
            
            const updatedLikes = (typeof tweet.likes === 'number' ? tweet.likes : 0) + 1;
            
            console.log('After like - likes:', updatedLikes, 'isLiked: true');
            
            return { 
              ...tweet, 
              isLiked: true, 
              likes: updatedLikes
            };
          }
          return tweet;
        })
      );

      if(user?._id !== undefined) {
        const userId = user?._id as string
        await likeNotification(userId, tweetId)
      }
    } catch (error) {
      console.error("Error liking tweet:", error);
      toast("Error liking tweet", {
        description: "Please try again",
      });
    }
  };

  const handleTweetDislike = async (tweetId: string) => {
    try {
      // Call the API to dislike the tweet on the server
      await dislikeTweet(tweetId);
      
      // Optimistic UI update - this gives immediate feedback to the user
      setTweet(prevTweets => 
        prevTweets.map(tweet => {
          if (tweet._id === tweetId) {
            console.log('Disliking tweet:', tweet._id);
            console.log('Before dislike - likes:', tweet.likes, 'isLiked:', tweet.isLiked);
            
            const updatedLikes = Math.max(0, (typeof tweet.likes === 'number' ? tweet.likes : 0) - 1);
            
            console.log('After dislike - likes:', updatedLikes, 'isLiked: false');
            
            return { 
              ...tweet, 
              isLiked: false, 
              likes: updatedLikes
            };
          }
          return tweet;
        })
      );
    } catch (error) {
      console.error("Error disliking tweet:", error);
      toast("Error disliking tweet", {
        description: "Please try again",
      });
    }
  };

  useEffect(() => {
    if(user?.isFirstLogin) {
      requestPermission()
    }
  }, [user])

  return (
    <div className="h-full w-full">
      <Card className="w-full p-4 relative top-0 left-0">
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

      <div className="flex justify-end mt-4 mb-2 px-4">
        <Button 
          variant="outline" 
          onClick={() => {
            // Reset to page 1 and reload tweets
            setTweet([]);
            setPage(1);
            setHasMore(true);
            hasFetched.current = false;
            fetchTweets();
            toast("Timeline refreshed", {
              description: "Latest tweets loaded",
            });
          }}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4" />
          Refresh Timeline
        </Button>
      </div>

      <div className="h-full w-full">
        {tweet.map((tweetComp) => (
          <div
            key={tweetComp._id}
            className="w-full p-4 border-b-1 border-black dark:border-neutral-700 cursor-pointer"
            onClick={() => navigate(`/home/tweets/${tweetComp._id}`)}
          >
            <div className="flex items-start">
              <img
                src={tweetComp.User?.avatar || "https://via.placeholder.com/150"}
                alt="DP"
                className="h-10 w-10 object-cover rounded-full"
              />
              <div className="flex items-center">
                <div
                  className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>{
                    e.stopPropagation()
                    navigate(`/home/profile/${tweetComp.User?._id || ''}`);
                  }}
                >
                  {tweetComp.User?.userName || "Unknown User"}
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
                alt="IMAGE"
                className="h-64 w-full object-cover mt-2 rounded-lg"
              />
            ) : null}

            <div className="flex items-center mt-2">
              {tweetComp.isLiked ? (
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  handleTweetDislike(tweetComp._id)
                }}>
                  <Heart
                  className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                  fill="#fb2c36"
                />
                </button>
              ) : (
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  handleTweetLike(tweetComp._id)
                }}>
                  <Heart
                    className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                  />
                </button>
              )}
              <div className="ml-1">
                {isNaN(parseInt(String(tweetComp.likes))) ? 0 : tweetComp.likes}
              </div>
              <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation()
                  navigate(`/home/tweets/${tweetComp._id}`)
                }}>
                <IconBubble
                  className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8"
                />
              </button>
              <div className="ml-1">{tweetComp.commentCount}</div>
              {tweetComp.User?._id === user?._id ? (
                <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8" />
              ) : null}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        
        {!hasMore && tweet.length > 0 && (
          <div className="text-center p-4">
            No more tweets to load
          </div>
        )}
      </div>
    </div>
  )
}

export default Home