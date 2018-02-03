// app.js


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


// add log
const logger = require('./logger');


const index = require('./routes/index');
// const lineBot = require('./routes/line-bot');
const lineRounter = require('./routes/linerounter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/bots/line/callback', lineBot);
app.use(bodyParser.json());
app.use('/bots/line/', lineRounter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  logger.error('An error occurs:');
  logger.error(`req.body = ${JSON.stringify(req.body)}`);
  logger.error(`${err.stack}`);

  const status = err.status || 500;
  logger.error(`res status = ${status}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(status);
  res.render('error');
});


module.exports = app;