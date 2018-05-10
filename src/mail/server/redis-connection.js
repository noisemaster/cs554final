const node_redis_pubsub = require("node-redis-pubsub");
const config = {
  port: 6379,
  scope: "mail"
};

const node_redis_pubsub_instance = new node_redis_pubsub(config); 
module.exports = node_redis_pubsub_instance;