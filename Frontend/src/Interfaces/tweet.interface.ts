export interface tweet {
    User?: {
    avatar: string,
    userName: string,
    _id: string
  }
  commentCount: number
  content: string
  createdAt: string
  isLiked: boolean
  likes: number
  media?: string
  mentions: string[]
  _id: string
}


export interface trending {
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

export interface userTweets {
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
  media: string;
  mentions: [];
  _id: string;
};

export interface likedTweet {
  _id: string,
  LikedTweet: {
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
  }
};