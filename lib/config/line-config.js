// require dotenv config.
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

module.exports = config;