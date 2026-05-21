/**
 * Email Service — Placeholder
 * Integrate with Nodemailer / SendGrid / Resend in production.
 */
const logger = require('./logger');

/**
 * Send a welcome email after successful registration.
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient's full name
 */
const sendWelcomeEmail = async (to, name) => {
  logger.info(`[EmailService] Welcome email queued for ${to}`);
  // TODO: Integrate with Nodemailer / SendGrid / Resend
  // await transporter.sendMail({ to, subject: 'Welcome to vShield', html: ... });
};

/**
 * Send a verification report ready notification email.
 * @param {string} to
 * @param {string} candidateName
 * @param {string} status - 'VERIFIED' | 'FAILED'
 */
const sendReportReadyEmail = async (to, candidateName, status) => {
  logger.info(`[EmailService] Report-ready email queued for ${to} — ${candidateName} (${status})`);
  // TODO: Integrate with Nodemailer / SendGrid / Resend
};

module.exports = { sendWelcomeEmail, sendReportReadyEmail };
