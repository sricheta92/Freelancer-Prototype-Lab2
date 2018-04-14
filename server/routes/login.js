  var express = require('express');
  var pool = require('./../pool');
  var jwt = require('jsonwebtoken');
  var bcrypt = require('bcrypt');
  var fs = require('fs-extra')
  var passport = require('passport');
  require('./passport')(passport);
  var router = express.Router();

  router.post('/', (req, res) => {

  passport.authenticate('local', function(err, user, info) {
      if(err) {
			return res.status(401).send({ success: false, message: 'Authentication failed.' });
		  }
      if(!user){
        return res.status(400).send({ success: false, message: 'The email and password you entered did not match our records. Please double-check and try again.' });
      } else {
        req.logIn(req.body, function(err) {
            if(err) {
              return res.status(401).send({ success: false, message: 'The email and password you entered did not match our records. Please double-check and try again.' });
            }
            var data = {
              userId : 1
            };
            var token = jwt.sign(data, req.app.get('secret'), {
               expiresIn : 60*60
            });

              if(user.profilePicPath!== null){
                var buffer = fs.readFileSync("./uploads/"+user.profilePicPath);
                var bufferBase64 = new Buffer(buffer);
                user.encodeImage = bufferBase64;
              }else{
                var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
                var bufferBase64 = new Buffer(buffer);
                user.encodeImage = bufferBase64;
              }
            return  res.json({
                success: true,
                message: '',
                token: token,
                user : user.user,
                username :user.username,
                userid : user.userid,
                primary_role: user.primary_role,
                encodeImage : user.encodeImage
            });
          });
      }

    })(req, res);

  });

    function checkUser(reqUserOrEmail,reqPassword, req,res) {
      passport.authenticate('local', function(err, user, info) {
        if(!user){
    			return res.status(400).send({ success: false, message: 'User does not exist!' });
    		} else {
          req.logIn(req.body, function(err) {
      				if(err) {
      					res.status(401).send({ success: false, message: 'The email and password you entered did not match our records. Please double-check and try again.;' });
      				}
              var token = jwt.sign(data, req.app.get('secret'), {
                 expiresIn : 60*60
              });
      				return res.json({
                 success: true,
                  message: '',
                  token: token,
                  username :'BHavan',
                   userid : 1,
                   primary_role: 'Worker'
              });
            });
        }

      })(req, res);
    }
  module.exports = router;
