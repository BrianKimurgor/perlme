/**
 * SMS provider abstraction.
 *
 * To swap providers, just change the `SMS_PROVIDER` env var:
 *   SMS_PROVIDER=africas_talking   → Africa's Talking
 *   SMS_PROVIDER=twilio            → Twilio
 *   SMS_PROVIDER=console (default) → logs to console (dev/test)
 *
 * Install only the SDK you need:
 *   pnpm add africastalking        (Africa's Talking)
 *   pnpm add twilio                (Twilio)
 */

export interface SmsProvider {
    sendOtp(phoneNumber: string, code: string): Promise<void>;
}

// ─── Console provider (dev / test) ────────────────────────────────────────────
class ConsoleSmsProvider implements SmsProvider {
    async sendOtp(phoneNumber: string, code: string) {
        console.log(`[SMS:console] To: ${phoneNumber} | OTP: ${code}`);
    }
}

// ─── Africa's Talking provider ────────────────────────────────────────────────
class AfricasTalkingProvider implements SmsProvider {
    async sendOtp(phoneNumber: string, code: string) {
        // Uncomment after: pnpm add africastalking
        // import AfricasTalking from "africastalking";
        // const at = AfricasTalking({
        //     apiKey: process.env.AT_API_KEY!,
        //     username: process.env.AT_USERNAME!,
        // });
        // await at.SMS.send({
        //     to: [phoneNumber],
        //     message: `Your PearlMe verification code is: ${code}. Expires in 10 minutes.`,
        //     from: process.env.AT_SENDER_ID ?? "PearlMe",
        // });
        throw new Error("Africa's Talking provider not yet configured. Install 'africastalking' and uncomment the code in src/utils/sms.ts");
    }
}

// ─── Twilio provider ──────────────────────────────────────────────────────────
class TwilioProvider implements SmsProvider {
    async sendOtp(phoneNumber: string, code: string) {
        // Uncomment after: pnpm add twilio
        // import twilio from "twilio";
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
        // await client.messages.create({
        //     body: `Your PearlMe verification code is: ${code}. Expires in 10 minutes.`,
        //     from: process.env.TWILIO_FROM!,
        //     to: phoneNumber,
        // });
        throw new Error("Twilio provider not yet configured. Install 'twilio' and uncomment the code in src/utils/sms.ts");
    }
}

// ─── Factory: picks provider from SMS_PROVIDER env var ───────────────────────
function createSmsProvider(): SmsProvider {
    const provider = (process.env.SMS_PROVIDER ?? "console").toLowerCase();
    switch (provider) {
        case "africas_talking":
            return new AfricasTalkingProvider();
        case "twilio":
            return new TwilioProvider();
        default:
            return new ConsoleSmsProvider();
    }
}

export const smsProvider: SmsProvider = createSmsProvider();
