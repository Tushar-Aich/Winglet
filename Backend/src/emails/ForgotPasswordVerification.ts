const FrogotPasswordVerificationEmailTemplate = (verifyCode: string) => {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset OTP</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; padding: 0; width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 20px 0; text-align: center; background-color: #4A6FE3;">
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0; padding: 0;">Winglet</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #ffffff;">
                            <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px 0;">Password Reset Code</h2>
                            <p style="margin: 0 0 20px 0; line-height: 1.5;">Hello,</p>
                            <p style="margin: 0 0 20px 0; line-height: 1.5;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                            <p style="margin: 0 0 20px 0; line-height: 1.5;">Please use the following One-Time Password (OTP) to reset your password:</p>
                            <div style="margin: 30px 0; text-align: center;">
                                <div style="display: inline-block; background-color: #f9f9f9; border: 1px solid #dddddd; padding: 15px 30px; border-radius: 4px; letter-spacing: 5px;">
                                    <span style="font-size: 24px; font-weight: bold; color: #333333;">${verifyCode}</span>
                                </div>
                            </div>
                            <p style="margin: 0 0 20px 0; line-height: 1.5;">This code will expire in 3 minutes for security reasons. Please do not share this code with anyone.</p>
                            <p style="margin: 0 0 5px 0; line-height: 1.5;">Best regards,</p>
                            <p style="margin: 0; line-height: 1.5;">The Winglet Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f4f4f4; color: #777777; font-size: 12px;">
                            <p style="margin: 0 0 10px 0;">© 2025 Winglet. All rights reserved.</p>
                            <p style="margin: 0 0 10px 0;">Assam, India</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`
}

export default FrogotPasswordVerificationEmailTemplate