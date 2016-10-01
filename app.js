var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var uuid = require('uuid');
var MongoStore = require('connect-mongo')(session);
process.env.SESSION_SECRET || require('dotenv').load();
var passport = require('./lib/passport');
var url = require('url');
var env = env = process.env.NODE_ENV || 'development';

var routes = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');
var restaurant = require('./routes/restaurant');
// var favorites = require('./routes/favorites');

var app = express();

var forceSsl = function (req, res, next) {
  if (env === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// CORS policy
app.use(cors({
 credentials: true,
 origin: 'https://kristenlk.github.io',
 // origin: 'http://localhost:5000',
 allowedHeaders: ['Cookie', 'Content-Type']
}));

// app.use(cors());

if (env === 'production') {
  app.use(forceSsl);
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// For GET to Yelp API
app.use(function(req,res,next){
  res.locals.query = url.parse(req.url, true).query;
  next();
});
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// flash
// app.use(flash());

// sessions
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false,
  store : new MongoStore({
    // url: "mongodb://localhost/tastemaker",
    // collection: "sessions"
    url : "mongodb://heroku_kptgj5fp:kgk4cp9gfrpc2d9ui3riak69ph@ds041571.mongolab.com:41571/heroku_kptgj5fp"
  }),
  cookie : {
    httpOnly : false,
    maxAge : 72000000 // 20 hours
  },
  genid : function(req) {
    return uuid.v4({
      rng : uuid.nodeRNG
    });
  }
}));


// passport
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', routes);
app.use('/users', users);
app.use('/account', account);
app.use('/restaurant', restaurant);
// app.use('/favorites', favorites);


// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
