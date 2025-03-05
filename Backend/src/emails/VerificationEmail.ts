const verificationEmailTemplate = (verifyCode: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
        <table width="100%" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background-color: #0073e6; padding: 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                                    Welcome to Winglet!
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px; text-align: left;">
                                <p style="margin: 0 0 10px; font-size: 16px;">
                                    Hey there,
                                </p>
                                <p style="margin: 0 0 20px; font-size: 16px;">
                                    Thank you for signing up! Please use the following verification code to complete your registration:
                                </p>
                                <p style="margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; color: #0073e6;">
                                    ${verifyCode}
                                </p>
                                <p style="margin: 20px 0; font-size: 14px; color: #555;">
                                    This code will expire in 3 minutes. If you did not request for this, please ignore this email.
                                </p>
                                <p style="margin: 0 0 20px; font-size: 16px;">
                                    If you have any questions, feel free to contact our support team.
                                </p>
                                <p style="margin: 0; font-size: 16px;">
                                    Cheers,<br>The Winglet Team</br>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f4f4f4; padding: 10px 20px; text-align: center; font-size: 12px; color: #999;">
                                <p style="margin: 0;">
                                    Winglet, All rights reserved.
                                </p>
                                <p style="margin: 0;">
                                    Tinsukia, Assam, India.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
    </body>
    </html>`
}

export default verificationEmailTemplate