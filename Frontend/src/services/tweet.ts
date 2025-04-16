import axios from 'axios'


const getUserTweets = async (userId: string) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tweets/${userId}`, { withCredentials: true })
    return res
}

export {getUserTweets}