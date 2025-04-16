import { getUserTweets } from "@/services/tweet"
import { RootState } from "@/store/store"
import { IconBubble } from "@tabler/icons-react"
import { Heart, Trash2 } from "lucide-react"
import { JSX, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"


type tweet = {
  User: {
    avatar: string,
    userName: string,
    _id: string
  },
  comments: [],
  content: string,
  createdAt: string,
  likes: number,
  media: [string | undefined],
  mentions: [],
  _id: string
}

const UserChats = () => {
  const {userId} = useParams()
  const [tweet, setTweet] = useState<tweet[]>([])
  const navigate= useNavigate()
  const user = useSelector((state: RootState) => state.user?.user)

  const formatDate = (date: string) => {
    return date.split('T')[0]
  }

  const parseMentions = (content: string, mentions: []): (string | JSX.Element)[] => {
    const words = content.split(/(\s+)/);
    let mentionIndex = 0

    return words.map((word, idx) => {
      if(word.startsWith('@') && word.length > 1) {
        const userId = mentions[mentionIndex]
        mentionIndex++
        return (
          <span key={idx} className="bg-blue-500 font-medium text-white hover:bg-blue-700 cursor-pointer" onClick={() => navigate(`/home/profile/${userId}`)}>
            {word}
          </span>
        )
      }
      return word
    })
  }

  useEffect(() => {
    ;(async () => {
      const res = await getUserTweets(userId as string)
      console.log(res.data?.data)
      setTweet(res.data?.data)
    })()

    return () => setTweet([])
  }, [userId])
  return (
    <div className="h-full w-full">
      {tweet.map((tweetComp, idx) => (
        <div className="w-full p-4 border-b-1 border-black dark:border-white" key={idx}>
          <div className="flex items-start">
            <img src={tweetComp.User.avatar} alt="DP" className="h-10 w-10 rounded-full" />
            <div className="flex items-center">
              <div className="font-semibold text-sm ml-2 text-black dark:text-white">{tweetComp.User.userName}</div>
              <div className="text-xs text-muted-foreground ml-2">{formatDate(tweetComp.createdAt)}</div>
            </div>
          </div>
        <div className="text-md font-medium">{parseMentions(tweetComp.content, tweetComp.mentions)}</div>
        {tweetComp.media && tweetComp.media.length > 0 ? (
          <img src={tweetComp.media[0]} alt="" className="h-64 w-full mt-2 rounded-lg"/>
        ) : null}
        <div className="flex items-center mt-2">
          <Heart className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200" />
          <div className="ml-1">{tweetComp.likes}</div>

          <IconBubble className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 ml-8" />
          <div className="ml-1">{tweetComp.comments.length}</div>

          {tweetComp.User._id === user?._id ? (
            <Trash2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 ml-8" />
          ) : null}
        </div>
        </div>
      ))}
    </div>
  )
}

export default UserChats