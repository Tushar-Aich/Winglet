import axios from 'axios'


const getUserTweets = async (userId: string) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tweets/${userId}`, { withCredentials: true })
    return res
}

const likeTweet = async (tweetId: string) => {
    const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/likes/${tweetId}`, {}, {withCredentials: true})
    return res
}

const dislikeTweet = async (tweetId: string) => {
    const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/likes/dislike/${tweetId}`, {}, {withCredentials: true})
    return res
}

const getTweetById = async (tweetId: string) => {
    const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}/tweets/tweet/${tweetId}`, {withCredentials: true})
    return res
}

export {getUserTweets, likeTweet, dislikeTweet, getTweetById}