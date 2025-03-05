import { resend } from "../lib/resend.js";
import VerificationEmailTemplate from "../emails/VerificationEmail.js";
import { ApiResponse } from "./ApiResponse.js";

export async function sendVerificationEmail(
  email: string,
  verifyCode: string
): Promise<ApiResponse<string>> {
  try {
    await resend.emails.send({
      from: "Winglet <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message | Verification code",
      html: VerificationEmailTemplate(verifyCode),
    });

    return new ApiResponse(200, email, "Code sent successfully");
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return new ApiResponse(400, email, "Code sending failed");
  }
}
