import { dislikeTweet, getTweetById, likeTweet } from "@/services/tweet";
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Trash2 } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import noComment from "@/Assets/no-comment.png"
import noCommentWhite from "@/Assets/no-comment-white.png"
import { Input } from "@/components/ui/input";

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

const Tweets = () => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState<tweet[]>([]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

  const theme = localStorage.getItem("theme")

  const formatDate = (date: string) => {
    return date.split("T")[0];
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
  useEffect(() => {
    (async () => {
      if (!tweetId) return <div>Error : TweetId not Found</div>;
      const res = await getTweetById(tweetId);
      console.log(res.data.data[0]);
      setTweet(res.data.data);
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
                className="md:h-10 md:w-10 h-6 w-6 rounded-full"
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
                <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8 md:ml-12" />
              ) : null}
            </div>
          </div>
          {tweetComp.comments.length === 0 ? (
            <div className="h-full w-full flex flex-col justify-center items-center mt-5">
              {theme === "dark" ? (
                <div className="flex flex-col justify-center items-center mt-5">
                  <h1 className=" text-5xl font-bold font-serif italic">No Comments Yet.</h1>
                  <img src={noCommentWhite} className="h-96 w-96 object-cover" />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center mt-5">
                  <h1 className=" text-5xl font-bold font-serif italic">No Comments Yet.</h1>
                  <img src={noComment} className="h-96 w-96 object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center mt-5">
              Hi
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tweets;
