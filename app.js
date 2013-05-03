
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , files = require('./routes/files')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path')
  ,  passport = require('passport')
    , GoogleStrategy = require('passport-google').Strategy
    , mongoose = require('mongoose');

//db = mongoose.connect('mongodb://127.0.0.1:27017');
//Mongifile = require('./db/model.js').File(db);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser({uploadDir:'./upload'}));
app.use(express.session({ secret: 'keyboard cat' }));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/login', login.login);

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

app.post('/list-files', files.list);
app.post('/uploadfile', files.uploadfile);

//passport init
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user);});
passport.use( user.getGoogleStrategy(GoogleStrategy) );


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
