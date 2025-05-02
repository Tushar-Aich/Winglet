import axios from "axios";

const getUserTweets = async (userId: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/tweets/${userId}`,
    { withCredentials: true }
  );
  return res;
};

const likeTweet = async (tweetId: string) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/likes/${tweetId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const dislikeTweet = async (tweetId: string) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/likes/dislike/${tweetId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const getTweetById = async (tweetId: string) => {
  const res = axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/tweets/tweet/${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const postComment = async (tweetId: string | undefined, content: string) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/comments/post?tweetId=${tweetId}`,
    { content },
    { withCredentials: true }
  );
  return res;
};

const allCommentsOnAPost = async (tweetId: string | undefined) => {
  const res = axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/comments/get?tweetId=${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const likeComment = async (commentId: string | undefined) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/likes/comment/${commentId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const dislikeComment = async (commentId: string | undefined) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/likes/comment/dislike/${commentId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

const deleteComment = async (commentId: string) => {
  const res = axios.delete(
    `${
      import.meta.env.VITE_BACKEND_URL
    }/comments/delete?commentId=${commentId}`,
    { withCredentials: true }
  );
  return res;
};

const deleteTweet = async (tweetId: string | undefined) => {
  const res = axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/tweets/delete/${tweetId}`,
    { withCredentials: true }
  );
  return res;
};

const getLikedTweets = async (userId: string | undefined) => {
  const res = axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/likes/likedTweets?userId=${userId}`,
    { withCredentials: true }
  );
  return res;
};

const trendingTweets = async () => {
  const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}/tweets/get/tweet/trending`, {
    withCredentials: true,
  });
  return res;
};

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
};
