import { Resend } from 'resend';
import { EmailProvider, EmailParams, EmailResponse } from '../EmailService.interface';

export class ResendProvider implements EmailProvider {
    private readonly resend: Resend;
    private readonly defaultFrom: string;

    constructor(apiKey: string, defaultFrom: string) {
        if (!apiKey) {
            throw new Error('Resend API key is required');
        }
        this.resend = new Resend(apiKey);
        this.defaultFrom = defaultFrom;
    }

    async sendEmail(params: EmailParams): Promise<EmailResponse> {
        try {
            const { data, error } = await this.resend.emails.send({
                from: params.from || this.defaultFrom,
                to: params.to,
                subject: params.subject,
                html: params.html,
                replyTo: params.replyTo,
            });

            if (error) {
                console.error('❌ Resend error:', error);
                return {
                    success: false,
                    error: error.message || 'Failed to send email',
                };
            }

            return {
                success: true,
                messageId: data?.id,
            };
        } catch (error: any) {
            console.error('❌ Resend exception:', error);
            return {
                success: false,
                error: error.message || 'Email sending failed',
            };
        }
    }
}
