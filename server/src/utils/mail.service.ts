import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    console.log("hej: ", host, port, user, pass);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5">
        <h2>Password reset request</h2>
        <p>Click below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none">Reset password</a>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `;
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@myapp.local',
      to,
      subject: 'Reset your password',
      html,
    });
  }
}
