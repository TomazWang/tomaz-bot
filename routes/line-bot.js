const line = require('@line/bot-sdk');
const express = require("express");
const logger = require("../logger");
const {handleEvent} = require("./line-bot/event-handler");
const config = require('../lib/line/lineconfigs');

const router = express.Router();


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


module.exports = router;