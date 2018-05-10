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


init();