import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

type EmailType = "welcome" | "verification" | "password-reset" | "alert" | "generic" | "suspension" | "unsuspension";

// --------------------------- Reusable transporter ---------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (
  email: string,
  subject: string,
  name: string | null,
  message: string,
  html?: string,
  type: EmailType = "generic"
): Promise<string> => {
  try {
    // --------------------------- Modern Theme Palette ---------------------------
    const themes = {
      welcome: {
        color: "#2563EB",
        gradient: "linear-gradient(90deg, #60A5FA, #2563EB)",
        emoji: "🎉",
        title: "Welcome to PerlMe!",
      },
      verification: {
        color: "#10B981",
        gradient: "linear-gradient(90deg, #6EE7B7, #10B981)",
        emoji: "💌",
        title: "Verify Your Account",
      },
      "password-reset": {
        color: "#F59E0B",
        gradient: "linear-gradient(90deg, #FCD34D, #F59E0B)",
        emoji: "🔐",
        title: "Reset Your Password",
      },
      alert: {
        color: "#DC2626",
        gradient: "linear-gradient(90deg, #F87171, #DC2626)",
        emoji: "⚠️",
        title: "Security Alert",
      },
      suspension: {
        color: "#B91C1C",
        gradient: "linear-gradient(90deg, #EF4444, #B91C1C)",
        emoji: "🚫",
        title: "Account Suspension Notice",
      },
      unsuspension: {
        color: "#16A34A",
        gradient: "linear-gradient(90deg, #4ADE80, #16A34A)",
        emoji: "✅",
        title: "Account Reinstated",
      },
      generic: {
        color: "#7C3AED",
        gradient: "linear-gradient(90deg, #C084FC, #7C3AED)",
        emoji: "💫",
        title: "Message from PerlMe",
      },
    };

    const theme = themes[type] || themes.generic;

    // --------------------------- Updated Modern Email Template ---------------------------
    const defaultHtml = `
      <html>
        <head>
          <style>
            body { font-family: 'Inter', 'Poppins', Arial, sans-serif; background-color: #F9FAFB; color: #111827; margin:0; padding:0; }
            .container { max-width:640px; margin:40px auto; background:#fff; border-radius:18px; box-shadow:0 6px 18px rgba(0,0,0,0.08); overflow:hidden; border:1px solid #E5E7EB; }
            .header { background: ${theme.gradient}; color:#fff; padding:26px; text-align:center; }
            .header h1 { margin:0; font-size:26px; font-weight:600; letter-spacing:0.4px; }
            .content { padding:30px 35px; text-align:left; }
            .content h2 { color:${theme.color}; margin-top:0; font-size:21px; font-weight:600; }
            .content p { line-height:1.7; color:#374151; font-size:15px; margin-bottom:14px; }
            .footer { background:#F3F4F6; color:#6B7280; text-align:center; padding:25px 20px; font-size:14px; border-top:1px solid #E5E7EB; }
            .footer strong { color:${theme.color}; }
            .footer a { color:${theme.color}; text-decoration:none; font-weight:500; transition:0.3s; }
            .footer a:hover { text-decoration:underline; }
            .social { margin:10px 0; }
            .social a { display:inline-block; margin:0 6px; text-decoration:none; color:${theme.color}; font-size:18px; }
            @media (max-width: 600px) { .container { width:90%; margin:20px auto; } .content { padding:20px; } }
          </style>
        </head>
        <body>
          <div class="container">
            
            <div class="content">
              <p>${message}</p>
            </div>
            <div class="footer">
              <div class="social">
                🌐 <a href="https://www.perlme.com">Website</a> • 💬 <a href="mailto:support@perlme.com">Support</a>
              </div>
              <p> You’re receiving this email from <strong>PerlMe</strong>.<br> © ${new Date().getFullYear()} PerlMe — All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // --------------------------- Mail Options ---------------------------
    const mailOptions = {
      from: `"PerlMe Notifications" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject,
      text: message,
      html: html || defaultHtml,
    };

    // --------------------------- Send Email ---------------------------
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted?.length) {
      console.log(`✅ Email sent to ${email}`);
      return "Notification email sent successfully";
    } else if (info.rejected?.length) {
      console.warn(`⚠️ Email rejected: ${info.rejected}`);
      return "Notification email not sent, please try again";
    } else {
      console.error("❌ Unknown email server response", info);
      return "Email server error";
    }
  } catch (error: any) {
    console.error("💥 Email sending error:", error);
    return `Email server error: ${error.message || error}`;
  }
};
