// lib/email.ts
import nodemailer from "nodemailer";

// Create transporter (configure for your email provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  secure: process.env.NODE_ENV === "production",
});

export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationUrl: string
) {
  const mailOptions = {
    from: `"TIET-UQ Centre of Excellence" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: linear-gradient(to right, #1E3A8A, #581C87); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">TIET-UQ Centre of Excellence</h1>
        </div>
        
        <h2>Hello ${name},</h2>
        
        <p>Thank you for registering with the TIET-UQ Centre of Excellence. Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        
        <p>This verification link will expire in 24 hours.</p>
        
        <p>If you did not create an account, you can safely ignore this email.</p>
        
        <p>Best regards,<br>TIET-UQ Centre of Excellence Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
          <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const mailOptions = {
    from: `"TIET-UQ Centre of Excellence" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: linear-gradient(to right, #1E3A8A, #581C87); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">TIET-UQ Centre of Excellence</h1>
        </div>
        
        <h2>Hello ${name},</h2>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p>This password reset link will expire in 1 hour.</p>
        
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        
        <p>Best regards,<br>TIET-UQ Centre of Excellence Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
          <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}