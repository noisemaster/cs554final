const redisMessage = require('./redis-message-wrapper');
const users = require('../../database/users');
const fs = require('fs');
const path = require('path');
const database = require('../../database/index')();
const sgMail = require('@sendgrid/mail');
const cron = require('cron');

let sendGridApiKey;

let sendMail = new cron.CronJob({
    cronTime: '0 * * * *',
    onTick: async function()
    {
        console.log("Starting mail job");

        //Get all users with an email
        let result = await getUsers();
        const users = result.rows;

        let response;

        for(let i = 0; i < users.length; i++)
        {
            response = null;
            console.log("Generating content for user " + users[i].username);
            try
            {
                response = await redisMessage.sendMessage('generateContent', {user: users[i]});

                if(!response)
                {
                    console.log("Could not generate content for user " + users[i].username);
                }
                else
                {
                    sendEmailContent(users[i], response);
                }
            }
            catch(e)
            {
                console.log(e);
            }
        }
    },
    start: false,
    timeZone: 'America/New_York'
});

async function main()
{
    //Get the api key from data folder
    const data = fs.readFileSync(path.join(__dirname, '../../../data/sendGridApi.json'));

    if (!data) {
		console.error('No SendGrid API Key Found');
		process.exit(1);
	}

	const jsonData = JSON.parse(data);
	if (!jsonData.api_key) {
		console.error('Invalid SendGrid API Key Found');
		process.exit(1);
	}

	sendGridApiKey = jsonData.api_key;
    
    sgMail.setApiKey(sendGridApiKey);

    sendMail.start();
}

async function getUsers()
{
    let dbPool = await users.getDatabasePool();
    let allUsers = await database.getAllWithEmails(dbPool, users.TABLE_NAME);
    return allUsers;
}

async function sendEmailContent(user, content)
{
    const msg = {
      to: user.email,
      from: 'info@scrubsoft.com',
      subject: 'ViewIt Frontpage',
      html: content,
    };
    try {
        await sgMail.send(msg);
    } catch (e) {
        console.log(e);
    }
}

main();