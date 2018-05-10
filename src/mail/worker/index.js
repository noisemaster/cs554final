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

            let content = message.data.user.username + ", here are some posts you might have missed!</br>";
            content += "<ul>"

            const frontPage = ["post1", "post2", "post3"];

            for(let i = 0; i < frontPage.length; i++)
            {
                content += "<li>" + frontPage[i] + "</li>"
            }

            content += "</ul>"

            console.log(content);

            redisConnection.emit('generateContent:response:' + message.requestID, {data: content});
        }
        catch (e)
        {
            redisConnection.emit('generateContent:response:' + message.requestID, {error: 'Unable to generate content: ' + e});
        }
    });
}


init();