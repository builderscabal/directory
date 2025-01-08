"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import nodemailer from "nodemailer";

const smtpConfig = {
  email: "",
  host: "",
  port: 465,
  secure: true,
  auth: {
    user: "",
    pass: "",
  },
};

const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: smtpConfig.auth.user,
    pass: smtpConfig.auth.pass,
  },
});

export const sendEmail = action({
  args: {
    startupName: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const mailOptions = {
        from: {
          name: "Directory | BuildersCabal",
          address: smtpConfig.email,
        },
        to: "shola@builderscabal.com",
        subject: `New startup listed: ${args.startupName}`,
        html: "A new startup has been listed on the BuildersCabal Directory, login to approve listing status.",
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
      return {
        success: true,
        message: `Email sent successfully: ${info.response}`,
      };
    } catch (error) {
      console.error(`Failed to send email: ${error}`);
      throw new Error(`Failed to send email: ${error}`);
    }
  },
});