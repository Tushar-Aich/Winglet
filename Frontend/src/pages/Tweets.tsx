import {
  allCommentsOnAPost,
  deleteComment,
  deleteTweet,
  dislikeComment,
  dislikeTweet,
  getTweetById,
  likeComment,
  likeTweet,
  postComment,
} from "@/services/tweet";
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import noComment from "@/Assets/no-comment.png";
import noCommentWhite from "@/Assets/no-comment-white.png";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { commentSchema } from "@/schemas/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
  media: [string | undefined];
  mentions: [];
  _id: string;
};

type comment = {
  content: string;
  likes: number;
  owner: [avatar: string, _id: string, userName: string];
  tweetDetails: [];
  _id: string;
  createdAt: string;
  isLiked: boolean;
};

const Tweets = () => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState<tweet[]>([]);
  const [comment, setComment] = useState<comment[]>([]);
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [text, setText] = useState<string>("");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

  const theme = localStorage.getItem("theme");

  const handleCounting = (e: string) => {
    setText(e);
  };

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof commentSchema>) => {
    setSubmitting(true);
    try {
      const res = await postComment(tweetId, data.content);
      console.log(res.data);
      toast("Commented successfully", {
        description: "Successful✅",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      const res2 = await allCommentsOnAPost(tweetId)
      setComment(res2.data.data)
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast("Error occured while Commenting❌", {
        description: "Please try again",
        action: {
          label: "X",
          onClick: () => console.log("dismiss"),
        },
      });
      console.log(error);
    }
  };

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
            className="bg-blue-500 font-medium text-gray-100 hover:bg-blue-700 cursor-pointer"
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
    await likeTweet(tweetId);
    const res = await getTweetById(tweetId);
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };

  const handleTweetDislike = async (tweetId: string) => {
    await dislikeTweet(tweetId);
    const res = await getTweetById(tweetId);
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };

  const handleCommentLike = async (commentId: string | undefined) => {
    if(!commentId) return <div>Error : CommentId not found</div>
    await likeComment(commentId)
    const res = await allCommentsOnAPost(tweetId)
    setComment(res.data.data)
  }
  
  const handleCommentDisLike = async (commentId: string | undefined) => {
    if(!commentId) return <div>Error : CommentId not found</div>
    await dislikeComment(commentId)
    const res = await allCommentsOnAPost(tweetId)
    setComment(res.data.data)
  }
  
  const handleDeleteComment = async (commentId: string | undefined) => {
    if(!commentId) return <div>Error : CommentId not found</div>
    await deleteComment(commentId)
    const res = await allCommentsOnAPost(tweetId)
    setComment(res.data.data)
  }

  const handleDeleteTweet = async (tweetId: string | undefined) => {
    if(!tweetId) return <div>Error: TweetId not Found</div>
    await deleteTweet(tweetId)
    const res = await getTweetById(tweetId)
    setTweet(res.data.data)
  }

  useEffect(() => {
    (async () => {
      if (!tweetId) return <div>Error : TweetId not Found</div>;
      const res = await getTweetById(tweetId);
      console.log(res.data.data[0]);
      const res2 = await allCommentsOnAPost(tweetId);
      console.log(res2.data.data[0]);
      setTweet(res.data.data);
      setComment(res2.data.data);
    })();
  }, [tweetId]);

  return (
    <div className="h-full w-full">
      {tweet.map((tweetComp, idx) => (
        <div key={idx}>
          <div className="w-full p-4 border-b-1 border-black dark:border-white">
            <div className="flex items-start">
              <img
                src={tweetComp.User.avatar}
                alt="DP"
                className="md:h-10 md:w-10 h-6 w-6 rounded-full object-cover"
              />
              <div className="flex items-center">
                <div
                  className="font-semibold md:text-sm text-xs ml-2 text-black dark:text-white cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/home/profile/${tweetComp.User._id}`)
                  }
                >
                  {tweetComp.User.userName}
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {formatDate(tweetComp.createdAt)}
                </div>
              </div>
            </div>
            <div className="text-xs font-medium md:text-[16px] mt-2">
              {parseMentions(tweetComp.content, tweetComp.mentions)}
            </div>
            {tweetComp.media && tweetComp.media.length > 0 ? (
              <img
                src={tweetComp.media[0]}
                alt=""
                className="md:h-64 h-40 w-full mt-2 rounded-lg"
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

              <IconBubble className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8 md:ml-12" />
              <div className="ml-1">{tweetComp.comments.length}</div>

              {tweetComp.User._id === user?._id ? (
                <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8 md:ml-12" onClick={() => handleDeleteTweet(tweetComp._id)}/>
              ) : null}
            </div>
          </div>
          <div className="w-full border-b-1 border-b-black dark:border-b-white py-3">
            <p className="mb-2">
              Replying to{" "}
              <span
                className="text-blue-300"
                onClick={() => navigate(`/home/profile/${tweetComp.User._id}`)}
              >
                @{tweetComp.User.userName}
              </span>
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Comment here"
                          onChangeCapture={(e) =>
                            handleCounting(e.currentTarget.value)
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-4">
                  {submitting ? (
                    <Button className="relative right-0">
                      Replying
                      <Loader2 className="animate-spin" />
                    </Button>
                  ) : (
                    <Button className="cursor-pointer">Reply</Button>
                  )}
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
                </div>
              </form>
            </Form>
          </div>
          {tweetComp.comments.length === 0 ? (
            <div className="h-full w-full flex flex-col justify-center items-center mt-5">
              {theme === "dark" ? (
                <div className="flex flex-col justify-center items-center mt-5">
                  <h1 className=" text-3xl md:text-5xl font-bold font-serif italic">
                    No Comments Yet.
                  </h1>
                  <img
                    src={noCommentWhite}
                    className="h-96 w-96 object-cover"
                    alt="No-comment"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center mt-5">
                  <h1 className=" text-3xl md:text-5xl font-bold font-serif italic">
                    No Comments Yet.
                  </h1>
                  <img
                    src={noComment}
                    className="h-96 w-96 object-cover"
                    alt="No-comment"
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              {comment.map((com, idx) => (
                <div key={idx}>
                  <div className="w-full p-4 border-b-1 border-black dark:border-white">
                    <div className="flex items-start">
                      {com.owner.map((user, idx) => (
                        <div key={idx}>
                          <div className="flex items-start">
                            <img
                              src={user.avatar}
                              alt="DP"
                              className="md:h-10 md:w-10 h-6 w-6 rounded-full object-cover"
                            />
                            <div className="flex items-center">
                              <div
                                className="font-semibold md:text-sm text-xs ml-2 text-black dark:text-white cursor-pointer hover:underline"
                                onClick={() =>
                                  navigate(`/home/profile/${user._id}`)
                                }
                              >
                                {user.userName}
                              </div>
                              <div className="text-xs text-muted-foreground ml-2">
                                {formatDate(com.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs font-medium md:text-[16px] mt-2">
                      {com.content}
                    </div>
                    <div className="flex items-center mt-2">
                      {com.isLiked ? (
                        <Heart
                          className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                          fill="#fb2c36"
                          onClick={() => handleCommentDisLike(com._id)}
                        />
                      ) : (
                        <Heart className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer" onClick={() => handleCommentLike(com._id)}/>
                      )}
                      <div className="ml-1">{com.likes}</div>
                      {com.owner[0]._id === user?._id ? (
                        <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8 md:ml-12" onClick={() => handleDeleteComment(com._id)}/>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tweets;
