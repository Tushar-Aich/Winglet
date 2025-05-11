import { suggestedUsers } from "@/services/auth";
import { dislikeTweet, likeTweet, trendingTweets } from "@/services/tweet"
import { RootState } from "@/store/store";
import { IconBubble } from "@tabler/icons-react";
import { Heart, Trash2 } from "lucide-react";
import React, { useEffect, useState, JSX } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import FollowButton from "./FollowButton";

type tweet = {
  commentCount: number;
  content: string;
  createdAt: string;
  isLiked: boolean;
  likeCount: number;
  mentions: [];
  media: string;
  owner: {
    avatar: string,
    userName: string,
    _id: string
  };
  _id: string
}

type user = {
  OGName: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  isFollowed: boolean;
  userName: string;
  _id: string
}

const Container = ({children}: {children: React.ReactNode}) => {
  const [tweet, setTweet] = useState<tweet[]>([]);
  const [backendUser, setBackendUser] = useState<user[]>([])

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.user);

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
    const res = await trendingTweets();
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };
  
  const handleTweetDislike = async (tweetId: string) => {
    await dislikeTweet(tweetId);
    const res = await trendingTweets();
    console.log(res.data?.data);
    setTweet(res.data?.data);
  };

  useEffect(() => {
    ;(async () => {
      const res = await trendingTweets()
      setTweet(res.data.data)

      const res2 = await suggestedUsers()
      console.log("Users : \n", res2.data.data)
      setBackendUser(res2.data.data)
    })()

    return () => setTweet([]);
  }, [])
  return (
    <div className="w-full border-2 rounded-lg px-4 py-2 my-2 mx-3 bg-white dark:bg-black border-neutral-200 dark:border-neutral-950 grid grid-cols-1 gap-4 lg:grid-cols-3 overflow-y-hidden h-[calc(100vh-2rem)]">
        <div className="col-span-2 h-full overflow-y-auto">
          <div className="p-4">
            {children}
          </div>
        </div>
        <div className="hidden lg:flex lg:col-span-1 lg:flex-col h-full">
          <div className="grid grid-cols-1 grid-rows-2 gap-2 h-full w-full">
            <div className="h-full p-2 overflow-y-auto max-h-[calc(50vh-2rem)]">
              <h1 className="font-bold text-lg text-black dark:text-white text-center pb-3 border-b-2 border-b-black dark:border-b-gray-600 sticky top-0 bg-transparent backdrop-blur-sm z-10">Trending Tweets</h1>
            {tweet.map((tweetComp, idx) => (
        <div
          className="w-full p-4 border-b-1 border-black dark:border-neutral-700 cursor-pointer"
          key={idx}
          onClick={() => navigate(`/home/tweets/${tweetComp._id}`)}
        >
          <div className="flex items-start">
            <img
              src={tweetComp.owner.avatar}
              alt="DP"
              className="h-10 w-10 object-cover rounded-full"
            />
            <div className="flex items-center">
              <div className="font-semibold text-sm ml-2 text-black dark:text-white cursor-pointer hover:underline" 
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>{
                e.stopPropagation()
                navigate(`/home/profile/${tweetComp.owner._id}`)
              }}>
                {tweetComp.owner.userName}
              </div>
              <div className="text-xs text-muted-foreground ml-2">
                {formatDate(tweetComp.createdAt)}
              </div>
            </div>
          </div>
          <div className="text-md font-medium">
            {parseMentions(tweetComp.content, tweetComp.mentions)}
          </div>
          {tweetComp.media && tweetComp.media.length > 0 ? (
            <img
              src={tweetComp.media}
              alt=""
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
            <div className="ml-1">{tweetComp.likeCount}</div>

            <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation()
                navigate(`/home/tweets/${tweetComp._id}`)
              }}>
              <IconBubble
                className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8"
              />
            </button>
            <div className="ml-1">{tweetComp.commentCount}</div>

            {tweetComp.owner._id === user?._id ? (
              <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer ml-8" />
            ) : null}
          </div>
        </div>
      ))}
            </div>
            <div className="overflow-y-auto p-2 max-h-[calc(50vh-2rem)]">
              <h1 className="font-bold text-lg text-black dark:text-white text-center pb-3 border-b-2 border-b-black dark:border-b-gray-600 sticky top-0 bg-transparent backdrop-blur-sm z-10">Suggested Users</h1>
              {backendUser.map((userComp, idx) => (
                <Card
                  className="w-full p-4 border-b-1 border-b-black dark:border-b-neutral-700 rounded-none"
                  key={idx}
                  onClick={() => navigate(`/home/profile/${userComp._id}`)}
                >
                  <CardTitle className="flex gap-4">
                    <img src={userComp.avatar} alt="profile" className="h-16 w-16 rounded-full object-cover" />
                    <CardHeader className="w-full flex flex-col gap-0">
                      <h1 className="font-bold text-xl">{userComp.OGName}</h1>
                      <h1 className="text-muted-foreground font-semibold text-sm">{userComp.userName}</h1>
                    </CardHeader>
                  </CardTitle>
                  <CardContent className="flex justify-between">
                    <div className="flex gap-2">
                      <h1 className="font-bold text-xl">{userComp.followersCount}</h1>
                      <h1 className="font-bold text-xl">Followers</h1>
                    </div>
                    <div className="flex gap-2">
                      <h1 className="font-bold text-xl">{userComp.followingCount}</h1>
                      <h1 className="font-bold text-xl">Following</h1>
                    </div>
                  </CardContent>
                  <CardFooter className="w-full">
                    {userComp._id !== user?._id && (
                      <div className="w-full">
                        <FollowButton userId={userComp._id} isFollowed={userComp.isFollowed} />
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Container