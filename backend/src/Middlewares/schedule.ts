// scheduler.ts
import cron from "node-cron";
import { getAllUsers, unsuspendUser } from "../Services/Users/users.service";
import { sendNotificationEmail } from "./GoogleMailer";
import { TSelectUser } from "../drizzle/schema";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// ---------------------------- Cron Job ----------------------------
// Runs every minute. Adjust schedule as needed.
cron.schedule("* * * * *", async () => {
  console.log("⏱️ Cron job running: checking suspended users...");

  try {
    // Fetch all users
    const users: TSelectUser[] = await getAllUsers();
    const now = new Date();

    for (const user of users) {
      // Check if user is suspended and suspension has expired
      if (user.isSuspended && user.suspendedUntil && new Date(user.suspendedUntil) <= now) {
        console.log(`🔓 Unsuspending user: ${user.username} (id: ${user.id})`);

        try {
          // Unsuspend the user
          const updatedUser: TSelectUser | null = await unsuspendUser(user.id);

          if (updatedUser) {
            // Prepare unsuspension email (same detailed template as controller)
            const subject = "🎉 Welcome Back! Your PerlMe Account Is Active Again";
            const message = `
              <html>
                <body style="font-family:'Poppins',Arial,sans-serif;background-color:#E8EAF6;padding:40px;">
                  <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:18px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                    <h2 style="color:#5E35B1;">🎉 Account Reinstated</h2>
                    <p style="color:#4A148C;">Hey <strong>${updatedUser.username}</strong>,</p>
                    <p style="color:#555;">
                      Great news — your account has been successfully <strong style="color:#43A047;">reinstated</strong> and you can now log in again!
                    </p>
                    <div style="background:#EDE7F6;border-radius:12px;padding:15px;margin:25px 0;">
                      <p style="margin:0;color:#6A1B9A;font-size:15px;">
                        We're so glad to have you back 💜 Please remember to keep our community a positive, respectful space.
                      </p>
                    </div>
                    <p style="color:#555;">We appreciate your patience and cooperation.</p>
                    <a href="https://perlme.app/login" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#7E57C2;color:white;border-radius:10px;text-decoration:none;font-weight:500;">
                      Log In to PerlMe
                    </a>
                    <hr style="margin:30px 0;border:none;border-top:1px solid #D1C4E9;">
                    <p style="font-size:14px;color:#999;">
                      💜 With love,<br><strong>The PerlMe Team</strong><br>
                      &copy; ${new Date().getFullYear()} PerlMe
                    </p>
                  </div>
                </body>
              </html>
            `;

            try {
              await sendNotificationEmail(
                updatedUser.email,
                subject,
                updatedUser.username,
                message,
                message,
                "unsuspension"
              );
              console.log(`✅ Unsuspension email sent to ${updatedUser.email}`);
            } catch (emailError) {
              console.error(`❌ Failed to send unsuspension email to ${updatedUser.email}`, emailError);
            }
          }
        } catch (unsuspendError) {
          console.error(`❌ Failed to unsuspend user ${user.username} (id: ${user.id})`, unsuspendError);
        }
      }
    }
  } catch (error) {
    console.error("💥 Cron job error:", error);
  }
});
