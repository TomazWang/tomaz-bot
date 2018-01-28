const line = require('@line/bot-sdk');
const express = require('express');
const router = express.Router();

const logger = require('../logger');


// require dotenv config.
if (process.env.NODE_ENV !== 'production') require('dotenv').config();


// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

// create LINE SDK client
const client = new line.Client(config);

// register a webhook handler with middleware
// about the middleware, please refer to doc
router.post('/',
    // logging post
    (req, res, next) => {
        logger.debug('a post recieved');
        logger.debug(`req.body = ${JSON.stringify(req.body)}`);
        next();
    },
    // line middleware
    line.middleware(config),
    // handle response
    (req, res) => {
        const events = req.body.events;
        logger.debug(`line-bot.js::24/post: event = ${JSON.stringify(events)}`);

        // console.log('get a post');
        // console.log(`line-bot.js::24/post: event = ${JSON.stringify(event)}`);
        Promise
            .all(events.map(handleEvent))
            .then((result) => res.json(result));
    }
);

// event handler
function handleEvent(event) {
    logger.debug(`line-bot.js::32/handleEvent: event.type = ${event.type}`);
    // console.log(`line-bot.js::32/handleEvent: event.type = ${event.type}`);

    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event for now.
        logger.debug('ignored!  not message.');
        // console.log('ignored!  not message.');
        return Promise.resolve(null);
    }


    const messageTxt = event.message.text;

    if (!messageTxt.startsWith('機器人')) {
        // ignore non-mention message
        logger.log('info', 'ignored! not mentioned.');
        return Promise.resolve(null);
    }

    // create a echoing text message
    const echo = {type: 'text', text: messageTxt};

    return client.replyMessage(event.replyToken, echo);
}

module.exports = router;