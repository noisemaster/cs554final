const redisMessage = require('./redis-message-wrapper');
const users = require('../../database/users');
const database = require('../../database/index');
const sgMail = require('@sendgrid/mail');

async function main() {
    sgMail.setApiKey();

    let result = await getUsers();
    const users = result.Result.rows;

    for(let i = 0; i < users.length; i++)
    {
        let response = await redisMessage.sendMessage('generateContent', {user: user[i]});
        sendEmailContent(user[i], response);
    }
}

async function getUsers()
{
    let dbPool = await users.getDatabasePool();
    let allUsers = await database.getAllWithEmails(dbPool, users.TABLE_NAME);
    console.log(allUsers);
    return allUsers;
}

async function sendEmailContent(user, content)
{
    const msg = {
      to: user.email,
      from: 'info@scrubsoft.com',
      subject: 'ViewIt Frontpage',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail.send(msg);
}

main();