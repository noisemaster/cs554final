const redisConnection = require('./redis-connection');

async function init()
{
    redisConnection.on('generateContent:request:*', async (message,channel) => {
        console.log(message);

        if (!message || !message.requestID) {
            console.log('Bad Request: Incapable of Sending a Response');
        }
        
        try
        {
            if (!message.data)
            {
                redisConnection.emit('generateContent:response:' + message.requestID, {error: 'No user to generate content for.'});
                return;           
            }
            const tempPerson = addPerson(message.data);
            redisConnection.emit('generateContent:response:' + message.requestID, {data: tempPerson});
        }
        catch (e)
        {
            redisConnection.emit('generateContent:response:' + message.requestID, {error: 'Unable to generate content: ' + e});
        }
    });
}


// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

init();