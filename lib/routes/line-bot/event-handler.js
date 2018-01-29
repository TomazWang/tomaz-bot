const line = require("@line/bot-sdk");
const logger = require("../../../logger");
const lineConfig = require("../../config/line-config");


// create LINE SDK client
const client = new line.Client(lineConfig);


/**
 * Converts an event to a reply promise.
 * @param event and array of input events.
 */
module.exports.handleEvent = (event) => {

    logger.info(`handleEvent: got event ${JSON.stringify(event)}`);
    logger.info(`handleEvent: got event.type  = ${event.type}`);

    if (event.type === 'message' && event.message.type === 'text') {
        // only accept  text message for now.
        return handleTextMessage(event);

    } else if (event.type === 'postback') {
        // not implemented.
        return handlePostBack(event);
    } else {
        logger.info(`handleEvent: ignored! ${event.type} not regonized.`);
        return Promise.resolve(null);
    }

};

function handleTextMessage(event) {
    const messageTxt = event.message.text;
    logger.info(`handleTextMessage: messageText = ${messageTxt}`);

    if (!messageTxt.startsWith('機器人')) {
        // ignore non-mention message
        logger.info(`handleTextMessage: ignored! ignored not mentioned text message.`);
        return Promise.resolve(null);
    }

    const realContext = messageTxt.split('機器人').pop();
    logger.info(`handleTextMessage: realContext = ${realContext}`);

    // create a echoing text message
    const echo = {type: 'text', text: realContext};
    logger.info(`handleTextMessage: echo = ${JSON.stringify(echo)   }`);

    return client.replyMessage(event.replyToken, echo);
}

function handlePostBack(event) {
    logger.info(`handlePostBack: ignored! postback not implemented.`);
    return Promise.resolve(null);
}
