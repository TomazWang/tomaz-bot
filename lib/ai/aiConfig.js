'use strict';

// require dotenv config.
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

/**
 * @returns {{clientAccessToken: string | undefined}}
 */
function aiConfigFactory() {
  return {
    clientAccessToken: process.env.APIAI_CLIENT_TOKEN
  }
}


module.exports = aiConfigFactory();