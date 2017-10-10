const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var basicAuth = require('express-basic-auth');

const index = require('./routes/index');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// const auth = {};
// auth[process.env.user] = process.env.password;

app.use(basicAuth({
   users: {'admin': 'password'},
   challenge: true,
   realm: 'Imb4T3st4pp'
}));

app.use('/', index);
app.use(express.static(path.join(__dirname, './public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json( req.app.get('env') === 'development' ? err : {});
});

module.exports = app;
