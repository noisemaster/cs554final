/* 
 * 
 * Matthew Mahoney
 * CS-554 Assignment 5
 * I pledge my Honor that I have Abided by the Stevens Honor System - Matthew Mahoney
 * 
 */
const uuid = require('uuid');
const redisConnection = require('./redis-connection');

const messageSender = module.exports;

messageSender.sendMessage = (eventName, data) => {
    // Make a new Promise
    return new Promise((fulfill, reject) => {
        const requestID = uuid.v4(); // Create UUId for Request
        redisConnection.emit(eventName + ':request:' + requestID, {requestID, data}); // Emit on Redis Pub/Sub
        const responder = redisConnection.on(eventName + ':response:' + requestID, (response, channel) => { // Wait for Response
            if (response && response.error) { // If Invalid Reject and Cleanup
                reject(response.error);
                killResponder();
                return;
            }
            if (response) { // If valid, Fulfill and cleanup
                fulfill(response.data);
                killResponder();
            } else { // Otherwise a response was sent but there was just nothing in it... 
                reject('Empty Response');
                killResponder();
            }
        });

        // Timeout in case Worker isn't running
        let timeout = setTimeout(() => {
            reject('Request Timed Out');
            killResponder();
        }, 2000);

        // Cleanup
        let killResponder = () => {
            responder();
            clearTimeout(timeout);
        }
    });
}