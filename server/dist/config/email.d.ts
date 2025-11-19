import nodemailer from 'nodemailer';
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
    attachments?: any[];
}
export declare const sendEmail: (options: EmailOptions) => Promise<void>;
export declare const sendWelcomeEmail: (to: string, name: string) => Promise<void>;
export declare const sendEmployeeCredentials: (to: string, name: string, password: string) => Promise<void>;
export declare const sendOrderConfirmation: (to: string, orderNumber: string, total: number, attachments?: any[]) => Promise<void>;
export default transporter;
//# sourceMappingURL=email.d.ts.map