const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf, prettyPrint} = format;


const formatStr = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'silly',
    transports: [
        new transports.Console()
    ],
    format: combine(
        label({label: 'TomazBot'}),
        timestamp(),
        formatStr
    ),
});

logger.info('logger is on!');
module.exports = logger;