  var express = require('express');
  var pool = require('./../pool');
  var jwt = require('jsonwebtoken');
  var bcrypt = require('bcrypt');
  var passport = require('passport');
  require('./passport')(passport);
  var router = express.Router();

  router.post('/', (req, res) => {

  passport.authenticate('local', function(err, user, info) {
      console.log(user);
      if(err) {
			return res.status(401).send({ success: false, message: 'Authentication failed.' });
		  }
      if(!user){
        return res.status(400).send({ success: false, message: 'User does not exist!' });
      } else {
        req.logIn(req.body, function(err) {
          console.log(err);
            if(err) {
              return res.status(401).send({ success: false, message: 'The email and password you entered did not match our records. Please double-check and try again.;' });
            }
            var data = {
              userId : 1
            };
            var token = jwt.sign(data, req.app.get('secret'), {
               expiresIn : 60*60
            });
            return  res.json({

                success: true,
                message: '',
                token: token,
                username :user.username,
                 userid : user.userid,
                 primary_role: user.primary_role
            });
          });
      }

    })(req, res);

  });
/*
  function checkUser(reqUserOrEmail,reqPassword, req,res) {

        pool.getConnection(function(err, connection){
            connection.query(" select * from user where ( username ='" + reqUserOrEmail+"' or email = '"+reqUserOrEmail+"' ) ",  function(err, rows){
                connection.release();
                    if(rows!=undefined && rows.length>0){
                          bcrypt.compare(reqPassword, rows[0].password, function(err, matches){
                                if (matches){
                                        var data = {
                                          userId : rows[0].userid
                                        };

                                        var token = jwt.sign(data, req.app.get('secret'), {
                            							 expiresIn : 60*60
                            						});
                                        res.status(200).send({ success: true, message: '',  token: token,username :rows[0].username, userid : rows[0].userid, primary_role: rows[0].primary_role });
                                  }else{
                                        res.status(401).send({ success: false, message: 'The email and password you entered did not match our records. Please double-check and try again.' });
                                  }
                            });
                    }else{
                            res.status(401).send({ success: false, message: 'This user does not exist!' });
                        }

                });
        });

  } */
    function checkUser(reqUserOrEmail,reqPassword, req,res) {
      passport.authenticate('local', function(err, user, info) {
        console.log(user);
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
