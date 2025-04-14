import { emailSchema } from "@/schemas/EmailVerification";
import { loginSchema } from "@/schemas/loginSchema.ts";
import { otpSchema } from "@/schemas/OTPSchema";
import { SignUpSchema } from "@/schemas/signUpSchema";
import { RootState } from "@/store/store";
import axios from "axios";
import { useSelector } from "react-redux";
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

export const getUser = async () => {
  const user = useSelector((state: RootState) => state.user.user)
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/:${user?._id}`, { withCredentials: true })
  return res.data?.data
}