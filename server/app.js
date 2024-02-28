var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const wadizRouter = require('./routes/wadiz');

// mongoose connect
require('dotenv').config();
const mongoose = require('mongoose');
const {MONGO_HOST} = process.env; // mongodb host .env에서 가져옴

mongoose
  .connect(MONGO_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connect Successful'))
  .catch(err => console.error("DB 연결 에러 ",err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', wadizRouter);

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

module.exports = app;
