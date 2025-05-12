import { useState } from "react"
import { Button } from "./ui/button"
import { followUser, unFollowUser } from "@/services/auth"
import { followNotification } from "@/services/notification"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const FollowButton = ({ userId, isFollowed }: {userId: string, isFollowed: boolean}) => {
    const [followed, setFollowed] = useState<boolean>(isFollowed)
    const currentUser = useSelector((state: RootState) => state.user.user)
    
    const handleFollow = async () => {
      const res = await followUser(userId)
      console.log(res.data)
      if(res.data.success) {
        setFollowed(!followed)
        
        // Send follow notification
        if (currentUser?._id) {
          try {
            await followNotification(userId, currentUser._id.toString())
          } catch (error) {
            console.error("Error sending follow notification:", error)
            // Continue execution even if notification fails
          }
        }
      }
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