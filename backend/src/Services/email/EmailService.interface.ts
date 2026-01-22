export interface EmailProvider {
    sendEmail(params: EmailParams): Promise<EmailResponse>;
}

export interface EmailParams {
    to: string;
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}