// utils/email.js

const nodemailer = require('nodemailer');
const { emailUsername, emailPassword, emailHost, emailPort } = require('../config/vars');

/**
 * Function for sending an email using the nodemailer library and SMTP
 * configuration.
 */
const sendEmail = async options => {
  // 1) Create a transporter with SMTP configuration from vars.js
  const transporter = nodemailer.createTransport({
    host: emailHost, // Email host (e.g., SMTP server) from vars.js
    port: emailPort, // Email port (e.g., 587 for TLS) from vars.js
    auth: {
      user: emailUsername, // Email username (sender) from vars.js
      pass: emailPassword // Email password (sender's password) from vars.js
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Elyahu Anavi <hello@ely.io>', // Customize sender's name and email
    to: options.email, // Recipient's email address
    subject: options.subject, // Email subject
    text: options.message // Plain text message content
    // html: Optional HTML content for the email
  };

  // 3) Actually send the email using the configured transporter
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
