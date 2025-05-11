import { emailSchema } from "@/schemas/EmailVerification";
import { loginSchema } from "@/schemas/loginSchema.ts";
import { otpSchema } from "@/schemas/OTPSchema";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { z } from "zod";


export const login = async (data: z.infer<typeof loginSchema>) => {
  const { email, password } = data;
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );
  return res;
};

export const sendEmail = async (data: z.infer<typeof emailSchema>) => {
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/sendMail`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res;
};

export const verifyOtp = async (data: z.infer<typeof otpSchema>, email: string | null) => {
  const { code } = data
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/verifyOTP`,
    { code, email },
    { headers: { "Content-Type": "application/json" } }
  );
  return res;
};
export const signUp = async (data: z.infer<typeof SignUpSchema>, email: string) => {
  const { userName, OGName, password, avatar } = data
  const formData = new FormData()
  formData.append('userName', userName);
  formData.append('OGName', OGName);
  formData.append('password', password);
  formData.append('avatar', avatar);
  formData.append('email', email);

  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/signUp`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res;
};

export const getUser = async (userId: string) => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users?userId=${userId}`, { withCredentials: true })
  return res.data
}

export const suggestedUsers = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/suggested-users`, { withCredentials: true })
  return res
}

export const followUser = async (userId: string) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/followers/follow/${userId}`, {}, {withCredentials: true})
  return res
}

export const unFollowUser = async (userId: string) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/followers/unfollow/${userId}`, {}, {withCredentials: true})
  return res
}

export const searchUser = async (search: string) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/search`,{search}, { withCredentials: true })
  return res
}