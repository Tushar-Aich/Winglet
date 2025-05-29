import { useGetUsersForSideBar } from "@/Hooks/useQueries"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Inbox = () => {
  const { data, isFetching, isError } = useGetUsersForSideBar()
  const navigate = useNavigate()

  // Format time from ISO string to readable time
  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    
    const date = new Date(isoString);
    const now = new Date();
    
    // If today, show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Function to create a loading skeleton
  const renderLoadingSkeleton = () => {
    return Array(3).fill(0).map((_, i) => (
      <div key={i} className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-3 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="h-3 w-10 bg-muted animate-pulse rounded"></div>
      </div>
    ));
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        
        {/* Loading State */}
        {isFetching && (
          <div className="divide-y">
            {renderLoadingSkeleton()}
          </div>
        )}
        
        {/* Error State */}
        {isError && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Couldn't load conversations</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isFetching && !isError && (!data || data.length === 0) && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-muted-foreground">When you connect with others, your conversations will appear here</p>
            </div>
          </div>
        )}
        
        {/* User List */}
        <div className="divide-y">
          {data?.map((user, idx) => (
            <div 
              key={idx} 
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/home/chat/${user._id}`)}
            >
              <div className="flex items-start gap-4">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="font-medium">{user.name}</div>
                  {user.lastMessage?.text && (
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {user.lastMessage.text[0] || ""}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {user.lastMessageAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatTime(user.lastMessageAt)}
                  </span>
                )}
                {user.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground h-5 w-5 rounded-full flex items-center justify-center text-xs">
                    {user.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Inbox