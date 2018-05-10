// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'info@scrubsoft.com',
  from: 'amassenzz@stevens.edu',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);