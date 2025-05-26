import { getUserSForSideBar } from "@/Interfaces";
import api from "./axios";

export const getUsersForSideBar = async (): Promise<getUserSForSideBar[]> => {
    const res = await api.get('/chats/users')
    return res.data.data
}