var express = require('express');
var app = express();
var util = require('util');
var clientSessions = require("client-sessions");



var exphbs = require('express-handlebars');
app.engine('.html', exphbs());
app.set('view engine', '.html');




var Auth0Strategy = require('passport-auth0'),
    passport = require('passport');

var strategy = new Auth0Strategy({
    domain:       'uk-pymnt.eu.auth0.com',
    clientID:     'put-client-id-here',
    clientSecret: 'put-client-secret-here',
    callbackURL:  '/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session()); 





app.use(clientSessions({
  cookieName: 'session',
  secret: 'ssssh'
}));






app.get('/', function(req, res) {
  res.render('index');
});

app.get('/login', 
  passport.authenticate('auth0', { session: true }), function (req, res) {
    res.redirect("/");
  }
);

app.get('/callback', 
  passport.authenticate('auth0', { failureRedirect: '/login' }), 
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    
    res.redirect("/welcome");
  }
);

app.get('/welcome', function(req, res) {
  res.render('welcome', {
    name: req.session.passport.user.displayName,
    user: util.inspect(req.session.passport.user, false, null)
  });
});




var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on %s', port);
});