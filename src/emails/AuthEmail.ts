import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
}


export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Please confirm your email address',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; color: #2c3e50;">
                    <h2 style="margin-bottom: 10px;">Hi ${user.name},</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">
                    Welcome to <strong>CashTrackr</strong> — where your finances meet finesse 💸
                    </p>
                    <p style="font-size: 16px;">
                    To confirm your email, please click the button below. You’ll be taken to a page where you’ll need to enter your unique token:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                    <a href="[Confirmation Link]" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Confirm My Email
                    </a>
                    </div>
                    <p style="font-size: 14px; color: #555;">
                    Your token:
                    </p>
                    <p style="font-size: 20px; font-weight: bold; color: #e67e22; text-align: center; letter-spacing: 1px;">
                    ${user.token}
                    </p>
                    <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #999;">
                    If you didn’t sign up for CashTrackr, feel free to ignore this message. No action will be taken.
                    </p>
                </div>
`
        });

        console.log('Confirmation email sent:', email.messageId);
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrackr.com>',
            to: user.email,
            subject: 'Password Reset Instructions',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; color: #2c3e50;">
                    <h2 style="margin-bottom: 10px;">Hi ${user.name},</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">
                    It seems like you requested a password reset. To proceed, please visit the link below:
                    </p>
                    <a href="[Password Reset Link]" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Reset My Password
                    </a>
                    <p style="font-size: 20px; font-weight: bold; color: #e67e22; text-align: center; letter-spacing: 1px;">
                    and enter the token: ${user.token}
                    </p>
                </div>
`
        });

        console.log('Confirmation email sent:', email.messageId);
    }
}