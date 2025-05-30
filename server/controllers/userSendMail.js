import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const userSendMail = (to, otp, titleTxt, res) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config)

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "Todo Team OTP Verification",
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #004ac2;">${titleTxt}</h2>
                        <p style="font-size: 16px;">Use the following OTP to complete your action. This code is valid for 10 minutes:</p>
                        <h1 style="font-size: 32px; color: #004ac2; letter-spacing: 4px;">${otp}</h1>
                        <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
                        <p style="font-size: 14px; color: #666;">-- Todo Support Team</p>
                    </div>
                </body>
            </html>
        `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return err
        return info
    })
}
