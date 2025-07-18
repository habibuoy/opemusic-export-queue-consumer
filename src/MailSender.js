require('dotenv').config();
const { createTransport } = require('nodemailer');

class MailSender {
  constructor() {
    this._mailer = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, subject, content, filename = 'your-playlists.json') {
    const email = {
      from: '"Open Music Exporter" <export-no-reply@openmusic.com>',
      to: targetEmail,
      subject,
      text: 'Enjoy your playlists',
      attachments: [
        {
          filename,
          content,
        },
      ],
    };
    return this._mailer.sendMail(email);
  }
}

module.exports = MailSender;
