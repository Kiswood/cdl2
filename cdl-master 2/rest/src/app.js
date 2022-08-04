var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const { logger } = require('./logger.js');
var _ = require('lodash');

exports.dbName = "cdl";

const rest = require('./rest.js');
const main = require('./main.js');
const fs = require('fs');
// const { nextTick } = require('process');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var docsRouter = require('./routes/docs');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');
app.set('json spaces', 2);

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/docs', docsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(80);

const options = {
	host: 'localhost',
	port: 80,
	// path: `/?message={ "_id" : { "$exists" : true } }`,
	path: "/?message={'_id':{'$exists':true}}",
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
};

rest.getJSON(options, (statusCode, result) => {
	logger.info(`Event Result: ${statusCode}\n\n${JSON.stringify(result,null,2)}`);
});

module.exports = app;
