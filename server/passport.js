var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./kafka/client');


passport.use('local', new LocalStrategy({
	usernameField: 'reqUserOrEmail',
	passwordField: 'reqPassword'
  }, function(email, password, done) {
	  kafka.make_request('requestTopic', "login", {username:email,password:password}, function(err,results){
          if(err){
              done(err,{});
          } else {
              if(results.code == 200){
                  done(null,results.value);
              } else {
                  done(null,false);
              }
          }
      });
}));

  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;
