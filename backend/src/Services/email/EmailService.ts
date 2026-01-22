import { EmailServiceFactory } from './EmailServiceFactory';
import { EmailParams } from './EmailService.interface';

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
    const provider = EmailServiceFactory.getProvider();
    const result = await provider.sendEmail(params);

    if (!result.success) {
        console.error('Failed to send email:', result.error);
        // You might want to implement retry logic here
    }

    return result.success;
};

// Helper function to maintain backward compatibility
export const sendNotificationEmailV2 = async (
    to: string,
    subject: string,
    html: string,
    from?: string
): Promise<boolean> => {
    return sendEmail({ to, subject, html, from });
};
