import { emailSchema } from "@/schemas/EmailVerification";
import { loginSchema } from "@/schemas/loginSchema.ts";
import { otpSchema } from "@/schemas/OTPSchema";
import axios from "axios";
import { z } from "zod";

export const login = async (data: z.infer<typeof loginSchema>) => {
  const { email, password } = data;
  const res = axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/users/login`,
    { email, password },
    { headers: { "Content-Type": "application/json" } }
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