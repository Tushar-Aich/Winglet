import { getUserSForSideBar } from '@/Interfaces'
import api from './axios'

export interface Message {
    _id: string;
    content: string;
    images?: string;
    sender: string;
    receipent: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getUsersForSideBar = async (): Promise<getUserSForSideBar[]> => {
    const res = await api.get('/chats/users')
    return res.data?.data
}

export const getMessages = async (userId: string, page = 1): Promise<Message[]> => {
    try {
        console.log(`API call: Getting messages for ${userId}, page ${page}`);
        const res = await api.get(`/chats/messages?id=${userId}&page=${page}`);
        console.log('API response for messages:', res.data);
        return res.data?.data || [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

export const sendMessage = async (recipientId: string, content: string, images?: string) => {
    try {
        console.log('API call: Sending message via HTTP');
        // Using the correct endpoint from your backend routes
        const res = await api.post('/chats/messages', { recipientId, content, images });
        console.log('Send message response:', res.data);
        return res.data?.data;
    } catch (error) {
        console.error('Error sending message via API:', error);
        throw error;
    }
}