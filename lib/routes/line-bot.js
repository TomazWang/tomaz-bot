const line = require('@line/bot-sdk');
const express = require("express");
const logger = require("../../logger");
const {handleEvent} = require("./line-bot/event-handler");
const config = require('../config/line-config');

const router = express.Router();


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

        Promise
            .all(events
                .map(ev => handleEvent(ev)))
            .then((result) => res.json(result))
            .catch((err) => {
                logger.error('An error occurs:');
                logger.error(`req.body = ${JSON.stringify(req.body)}`);
                logger.error(`${err.stack}`);
            });
    }
);

function toConsole(event) {
    logger.info(`toConsole: receive event = ${event}`);
}


module.exports = router;