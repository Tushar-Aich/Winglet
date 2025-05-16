import { likedTweet, trending, tweet, userTweets } from "@/Interfaces/tweet.interface";
import { TweetSchema } from "@/schemas/tweetSchema";
import { z } from "zod";
import api from "./axios";

const getUserTweets = async (userId: string, {pageParam = 1}): Promise<userTweets[]> => {
  const res = await api.get(
    `/tweets/user?userId=${userId}&page=${pageParam}`,
    { withCredentials: true }
  );
  return res.data.data;
};

const likeTweet = async (tweetId: string) => {
  const res = await api.post(
    `/likes/${tweetId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const dislikeTweet = async (tweetId: string) => {
  const res = await api.post(
    `/likes/dislike/${tweetId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const getTweetById = async (tweetId: string) => {
  const res = api.get(
    `/tweets/tweet/${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const postComment = async (tweetId: string | undefined, content: string) => {
  const res = api.post(
    `/comments/post?tweetId=${tweetId}`,
    { content },
    { withCredentials: true }
  );
  
  try {
    // Import and call the comment notification function
    if (tweetId) {
      const { commentNotification } = await import("./notification");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?._id) {
        await commentNotification(tweetId, user._id, content);
      }
    }
  } catch (error) {
    console.error("Error sending comment notification:", error);
    // Continue execution even if notification fails
  }
  
  return res;
};

const allCommentsOnAPost = async (tweetId: string | undefined) => {
  const res = api.get(
    `/comments/get?tweetId=${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const likeComment = async (commentId: string | undefined) => {
  const res = api.post(
    `/likes/comment/${commentId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const dislikeComment = async (commentId: string | undefined) => {
  const res = api.post(
    `/likes/comment/dislike/${commentId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const deleteComment = async (commentId: string) => {
  const res = api.delete(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/comments/delete?commentId=${commentId}`,
    { withCredentials: true }
  );
  return res;
};

const deleteTweet = async (tweetId: string | undefined) => {
  const res = api.delete(
    `/tweets/delete/${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const getLikedTweets = async (userId: string | undefined, { pageParam = 1 }): Promise<likedTweet[]> => {
  const res = await api.get(
    `/likes/likedTweets?userId=${userId}&page=${pageParam}`,
    { withCredentials: true }
  );
  return res.data.data;
};

const trendingTweets = async (): Promise<trending[]> => {
  const res = await api.get(`/tweets/get/tweet/trending`, {
    withCredentials: true,
  });
  return res.data.data;
};

const createTweet = async (data:z.infer<typeof TweetSchema>) => {
  const { content, media } = data

  // Ensure content is properly handled for emojis
  if(!media) {
    const res = await api.post(
      `/tweets/create`, 
      {content}, 
      {withCredentials: true}
    )
    return res
  }

  const formData = new FormData()
  formData.append("content", content)
  formData.append("media", media)

  const res = await api.post(`/tweets/create`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
    }
  )

  return res
}

const getAllTweets = async ({pageParam = 1}): Promise<tweet[]> => {
  const res = await api.get(`/tweets?page=${pageParam}`, {withCredentials: true})
  return res.data.data
}

export {
  getUserTweets,
  likeTweet,
  dislikeTweet,
  getTweetById,
  postComment,
  allCommentsOnAPost,
  likeComment,
  dislikeComment,
  deleteComment,
  deleteTweet,
  getLikedTweets,
  trendingTweets,
  createTweet,
  getAllTweets
};
