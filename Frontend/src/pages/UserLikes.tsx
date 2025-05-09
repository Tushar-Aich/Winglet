import { getLikedTweets, dislikeTweet, likeTweet } from "@/services/tweet";
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Trash2 } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

type userData = {
  likedTweets: LikedTweets[];
};

type LikedTweets = {
  tweetOwner: {
    avatar: string;
    userName: string;
    _id: string;
  };
  isLiked: boolean;
  commentCount: number;
  content: string;
  createdAt: string;
  likes: number;
  media: string;
  mentions: [];
  _id: string;
};

const UserLikes = () => {
  const { userId } = useParams();
  const [tweet, setTweet] = useState<userData[]>([]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

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
    await likeTweet(tweetId);
    const res = await getLikedTweets(userId as string);
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };

  const handleTweetDislike = async (tweetId: string) => {
    await dislikeTweet(tweetId);
    const res = await getLikedTweets(userId as string);
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };
  useEffect(() => {
    (async () => {
      const res = await getLikedTweets(userId);
      console.log(res.data.data);
      setTweet(res.data?.data);
    })();

    return () => setTweet([]);
  }, [userId]);
  return (
    <div className="h-full w-full">
      {tweet.map((tweet, idx) => (
        <div key={idx}>
          {tweet.likedTweets.length > 0 &&
            tweet.likedTweets.map((likedTweet, idx) => (
              <div
                key={idx}
                className="w-full p-4 border-b-1 border-black dark:border-white cursor-pointer"
                onClick={() => navigate(`/home/tweets/${likedTweet._id}`)}
              >
                <div className="flex items-start">
                  <img
                    src={likedTweet.tweetOwner.avatar}
                    alt="DP"
                    className="h-10 w-10 object-cover rounded-full"
                  />
                  <div className="flex items-center">
                    <div
                      className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline"
                      onClick={(e: React.MouseEvent<HTMLDivElement>) =>{
                        e.stopPropagation()
                        navigate(`/home/profile/${likedTweet.tweetOwner._id}`)
                      }}
                    >
                      {likedTweet.tweetOwner.userName}
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {formatDate(likedTweet.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-md font-medium">
                  {parseMentions(likedTweet.content, likedTweet.mentions)}
                </div>
                {likedTweet.media ? (
                  <img
                    src={likedTweet.media}
                    alt="IMAGE"
                    className="h-64 w-full object-cover mt-2 rounded-lg"
                  />
                ) : null}
                <div className="flex items-center mt-2">
                  {likedTweet.isLiked ? (
                    <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      handleTweetDislike(likedTweet._id)
                    }}>
                      <Heart
                      className="h-4 w-4 shrink-0 text-red-500 cursor-pointer"
                      fill="#fb2c36"
                    />
                    </button>
                  ) : (
                    <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      handleTweetLike(likedTweet._id)
                    }}>
                      <Heart
                        className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                      />
                    </button>
                  )}
                  <div className="ml-1">{likedTweet.likes}</div>

                  <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      navigate(`/home/tweets/${likedTweet._id}`)
                    }}>
                    <IconBubble
                      className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8"
                    />
                  </button>
                  <div className="ml-1">{likedTweet.commentCount}</div>

                  {likedTweet.tweetOwner._id === user?._id ? (
                    <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8" />
                  ) : null}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default UserLikes;
