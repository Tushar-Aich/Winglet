import { useState } from "react"
import { Button } from "./ui/button"
import { followUser, unFollowUser } from "@/services/auth"

const FollowButton = ({ userId, isFollowed }: {userId: string, isFollowed: boolean}) => {
    const [followed, setFollowed] = useState<boolean>(isFollowed)

    const handleFollow = async () => {
      const res = await followUser(userId)
      console.log(res.data)
      if(res.data.success) setFollowed(!followed)
    }

    const handleUnFollow = async () => {
      const res = await unFollowUser(userId)
      console.log(res.data)
      if(res.data.success) setFollowed(!followed)
    }
  return (
    <div className="w-full">
        {followed === true ? (
            <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                    e.stopPropagation()
                    handleUnFollow()
                }}
            >Following</Button>
        ) : (
            <Button
                className="w-full"
                onClick={(e) => {
                    e.stopPropagation()
                    handleFollow()
                }}
            >
                Follow
            </Button>
        )}
    </div>
  )
}

export default FollowButton