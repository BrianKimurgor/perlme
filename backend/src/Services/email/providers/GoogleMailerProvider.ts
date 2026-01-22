import { EmailProvider, EmailParams, EmailResponse } from '../EmailService.interface';
import { sendNotificationEmail } from '../../../Middlewares/GoogleMailer';

export class GoogleMailerProvider implements EmailProvider {
    async sendEmail(params: EmailParams): Promise<EmailResponse> {
        try {
            // Extract username from email if needed (adjust based on your implementation)
            const username = params.to.split('@')[0];

            await sendNotificationEmail(
                params.to,
                params.subject,
                username,
                params.html
            );

            return {
                success: true,
            };
        } catch (error: any) {
            console.error('❌ GoogleMailer error:', error);
            return {
                success: false,
                error: error.message || 'Email sending failed',
            };
        }
    }
}
