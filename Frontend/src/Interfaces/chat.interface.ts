export interface getUserSForSideBar {
    _id: string;
    name: string;
    avatar: string;
    lastMessage: {
        text: string[];
        sender: string[];
    };
    unreadCount: number;
    lastMessageAt: string
}