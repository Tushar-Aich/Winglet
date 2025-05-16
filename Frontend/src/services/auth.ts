import { emailSchema } from "@/schemas/EmailVerification";
import { otpSchema } from "@/schemas/OTPSchema";
import { SignUpSchema } from "@/schemas/signUpSchema";
import { z } from "zod";
import api from "./axios";
import { emailResponse, FCMTokenResponse, GetUserResponse, LoginResponse, OTPresponse, SearchUser, SignUpResponse, SuggestedUser } from "@/Interfaces";
import { AvatarSchema } from "@/schemas/avatarSchema";


export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post("/users/login", { email, password }, { headers: { "Content-Type": "application/json" } })
  return res.data.data
};

export const sendEmail = async (data: z.infer<typeof emailSchema>): Promise<emailResponse> => {
  const res = await api.post(
    `/users/sendMail`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data.data;
};

export const verifyOtp = async (data: z.infer<typeof otpSchema>, email: string | null): Promise<OTPresponse> => {
  const { code } = data
  const res = await api.post(
    `/users/verifyOTP`,
    { code, email },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data.data;
};
export const signUp = async (data: z.infer<typeof SignUpSchema>, email: string): Promise<SignUpResponse> => {
  const { userName, OGName, password, avatar } = data
  const formData = new FormData()
  formData.append('userName', userName);
  formData.append('OGName', OGName);
  formData.append('password', password);
  formData.append('avatar', avatar);
  formData.append('email', email);

  const res = await api.post(
    `/users/signUp`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data;
};

export const getUser = async (userId: string): Promise<GetUserResponse> => {
  const res = await api.get(`/users/?userId=${userId}`, { withCredentials: true })
  return res.data.data[0]
}

export const suggestedUsers = async (): Promise<SuggestedUser[]> => {
  const res = await api.get(`/users/suggested-users`, { withCredentials: true })
  return res.data.data
}

export const followUser = async (userId: string) => {
  const res = await api.post(`/followers/follow/${userId}`, {}, {withCredentials: true})
  return res
}

export const unFollowUser = async (userId: string) => {
  const res = await api.post(`/followers/unfollow/${userId}`, {}, {withCredentials: true})
  return res
}

export const searchUser = async (search: string): Promise<SearchUser[]> => {
  const res = await api.post(`/users/search`,{search}, { withCredentials: true })
  return res.data.data
}

export const saveFCM = async (token: string): Promise<FCMTokenResponse> => {
  const res = await api.post(`/users/save-token`,{token}, { withCredentials: true })
  return res.data.data
}

export const updateAvatar = async (data: z.infer<typeof AvatarSchema>) => {
  const { avatar } = data
  const formData = new FormData()
  formData.append('avatar', avatar)
  
  const res = await api.post(`/users/update-avatar`, formData, { withCredentials: true })
  return res.data.data
}