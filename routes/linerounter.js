/**
 *
 * Line app should has these ability:
 *
 * - [x] Ability to add line app to route.
 * - [x] Ability to get request from line message api.
 * - [ ] Ability to send response to line message api.
 *
 *
 * // Not sure if these two should be in this component.
 * - [ ] Ability to send request to line message api.
 * - [ ] Ability to handle response from line message api.
 *
 */
const express = require('express');

const router = express.Router();


// Logger
const logger = require('../logger');


const lineSdk = require('@line/bot-sdk');

const lineConfigs = require('../lib/line/lineConfigs');

// init line bot
const LineBot = require('../lib/line/LineBot');

const lineBot = new LineBot(lineConfigs);

function lineMiddleWare() {
  if (process.env.DEBUG) {
    return (req, res, next) => {
      next();
    };
  }
  return lineSdk.middleware({
    channelAccessToken: lineConfigs.channelAccessToken,
    channelSecret: lineConfigs.channelSecret,
  });
}


router.post(
  '/callback',
  // logging post
  (req, res, next) => {
    logger.debug('== POST RECIVED:/bots/line/callback ======================');
    logger.debug(`req.body = ${JSON.stringify(req.body)}`);
    next();
  },
  // line middleware
  lineMiddleWare(),
  // handle response
  (req, res) => {
    const { events } = req.body;
    events.forEach((e) => {
      lineBot.processLineEvent(e);
    });

    logger.debug('response with code 200');
    res.send();
  },
);


module.exports = router;
