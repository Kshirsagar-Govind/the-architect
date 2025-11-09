import { mailTransporter } from "../config/mail.config";
import Logger from "../utils/logger";

export async function sendMail(to: string, cc: string, subject: string, html: string) {
  const mailOptions = {
    from: `"System Architect" <${process.env.EMAIL_USER}>`,
    to,
    cc,
    subject,
    html,
  };

  let mailSent = await mailTransporter.sendMail(mailOptions);
  Logger.INFO(`Email sent to ${to} with subject: ${subject}`);
  return mailSent;
}
