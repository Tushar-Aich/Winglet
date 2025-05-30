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

export interface Message {
    _id: string;
    content: string;
    images?: string;
    sender: {
        _id: string;
        avatar: string;
        OGName: string
    };
    receipent: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}