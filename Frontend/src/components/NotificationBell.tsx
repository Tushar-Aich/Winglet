import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getNotifications, getUnreadCount, markAsRead } from "@/services/notification";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationProps {
  _id: string;
  sender: {
    _id: string;
    userName: string;
    OGName: string;
    avatar: string;
  };
  type: 'like' | 'message' | 'reply' | 'follow';
  tweet?: {
    _id: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  
  return date.toLocaleDateString();
}

const NotificationItem = ({ notification, onNotificationClick }: { 
  notification: NotificationProps, 
  onNotificationClick: (notification: NotificationProps) => void 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onNotificationClick(notification);
    
    if (notification.type === 'follow') {
      navigate(`/home/profile/${notification.sender._id}`);
    } else if (notification.tweet) {
      navigate(`/home/tweets/${notification.tweet._id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "flex items-start space-x-3 p-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors",
        !notification.isRead && "bg-accent/30"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.sender.avatar} alt={notification.sender.userName} />
        <AvatarFallback>{notification.sender.userName.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm">{notification.content}</p>
        <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
      )}
    </div>
  );
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling for unread count every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const handleNotificationClick = async (notification: NotificationProps) => {
    // Only mark as read if not already read
    if (!notification.isRead) {
      try {
        await markAsRead([notification._id]);
        
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        
        // Decrease unread count
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAsRead(); // No IDs means mark all as read
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-5 w-5 cursor-pointer">
          <Bell className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200 cursor-pointer" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification._id} 
                  notification={notification} 
                  onNotificationClick={handleNotificationClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-32">
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}