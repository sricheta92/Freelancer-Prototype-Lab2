    var express = require('express');
    var pool = require('./../pool');
    var router = express.Router();
    var bcrypt = require('bcrypt');
     var kafka = require('./kafka/client')

    var salt = bcrypt.genSaltSync(10);

    router.post('/', (req, res) => {

        var reqEmail = req.body.email;
        var reqUsername = req.body.username;
        var reqPassword = req.body.password;
        var reqRole = req.body.role;
        checkIfUsernameEmailExists(reqUsername,reqEmail, reqPassword, reqRole, req, res);
    });


    router.post('/withDetails', (req, res) => {

    kafka.make_request('requestTopic', "signupWithDetails", {"req":req.body}, function(err,results){
      if(err){
       done(err,{});
       }
       else{
            if(results.code == 200){
               return res.status(200).json(results.value);
             }else{
               return res.status(500);
             }
         }
       });

  });

    router.post('/checkEmail', (req, res,next) => {
        var reqEmail = req.body.email;
        if(reqEmail!= ""){
          kafka.make_request('requestTopic', "checkEmail", {"email":req.body.email}, function(err,results){
			         if(err){
	              done(err,{});
                }
                else{
        	           if(results.code == 200){
        	            	return res.status(200).json(results.value);
        	            }else{
                        return res.status(409).json(results.value);
                      }
        	        }
                });
        }else{
          return res.status(400).send({success: false,  message: 'mandatory parameter missing.'});
        }
    });

    router.post('/checkUser', (req, res) => {
        var reqUsername = req.body.username;
        if(reqUsername!= ""){
          kafka.make_request('requestTopic', "checkUsername", {"username":req.body.username}, function(err,results){
               if(err){
                done(err,{});
                }
                else{
                     if(results.code == 200){
                        return res.status(200).json(results.value);
                      }else{
                        return res.status(409).json(results.value);
                      }
                  }
                });
        }else{
          return res.status(400).send({success: false,  message: 'mandatory parameter missing.'});
        }
    });

    function addUser(req,res, reqEmail, reqUsername, reqPassword,reqRole){
      bcrypt.hash(req.body.password, salt, function(err, password) {
           pool.getConnection(function(err, connection){
              connection.query("insert into user (`email`,`username`,`password`,`primary_role`)  VALUES ("+
                  "'"+reqEmail+
                  "', '"+reqUsername+
                  "', '"+password+
                  "', '"+reqRole+
                  "');",  function(err,results, fields){
                  connection.release();//release the connection
                          if(err) {
                            res.status(500);
                            throw err;
                            return;
                          }else{
                            res.status(200).send({success: true,message :"New user created " ,id:results.insertId, username: reqUsername});
                          }
                  });
            });
        });

    }

    function checkIfUsernameEmailExists(reqUsername,reqEmail, reqPassword, reqRole, req,res){
      if(reqUsername!= "" || reqEmail!="" || reqPassword!="" || reqRole!= ""){
          kafka.make_request('requestTopic', "addUser", {"username":reqUsername,"email": reqEmail,"password":reqPassword,"role":reqRole}, function(err,results){
            if(err){
             done(err,{});
             }
             else{
                  if(results.code == 200){
                     return res.status(200).json(results.value);
                   }else{
                     return res.status(409).json(results.value);
                   }
               }
             });

      }else{
          return res.status(400).send({success: false,  message: 'mandatory parameter missing.'});
      }

    }

    module.exports = router;
