// require dotenv config.
require('dotenv').config();

function lineConfigFactory() {
  return {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  };
}


module.exports = lineConfigFactory();
