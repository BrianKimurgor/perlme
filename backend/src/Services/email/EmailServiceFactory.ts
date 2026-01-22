// src/services/email/EmailServiceFactory.ts
import { EmailProvider } from './EmailService.interface';
import { ResendProvider } from './providers/ResendProvider';
import { GoogleMailerProvider } from './providers/GoogleMailerProvider';

export type EmailProviderType = 'resend' | 'google';

export class EmailServiceFactory {
    private static provider: EmailProvider;

    static initialize(providerType: EmailProviderType = 'resend'): void {
        switch (providerType) {
            case 'resend':
                const resendApiKey = process.env.RESEND_API_KEY;
                const fromEmail = process.env.EMAIL_FROM || 'PerlMe <noreply@perlme.com>';

                if (!resendApiKey) {
                    throw new Error('RESEND_API_KEY environment variable is required');
                }

                this.provider = new ResendProvider(resendApiKey, fromEmail);
                console.log('✅ Email service initialized with Resend');
                break;

            case 'google':
                this.provider = new GoogleMailerProvider();
                console.log('✅ Email service initialized with Google Mailer');
                break;

            default:
                throw new Error(`Unknown email provider: ${providerType}`);
        }
    }

    static getProvider(): EmailProvider {
        if (!this.provider) {
            // Auto-initialize with default provider if not already done
            const defaultProvider = (process.env.EMAIL_PROVIDER as EmailProviderType) || 'resend';
            this.initialize(defaultProvider);
        }
        return this.provider;
    }
}
