var express = require('express');
var pool = require('./../pool');
var router = express.Router();
var fs = require('fs-extra');
var kafka = require('./kafka/client');
var nodemailer = require('nodemailer');

  router.post('/hire', (req,res) =>{
    kafka.make_request('requestTopic', "hireUser", {"data":req.body}, function(err,results){
      if(err){
         done(err,{});
      }
      else{
        if(results.code == 200){

          var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: 'srichetaruj@gmail.com',
                  pass: 'performance@48'
              }
          });

          var mailOptions = {
              from: 'srichetaruj@gmail.com',
              to: req.body.hiredFreelancer.email,
              subject: 'Congrats! You are hired :-) ',
              text: 'you are hired to the project'

          };

  transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                  console.log(error);
              //    res.status(400).send({message:"Mail sending failed"});
              } else {
                  console.log("Email sent!");
              }
          });

           return res.status(200).json(results.value);
         }else{
           return res.status(500).json(results.value);;
         }
      }
    });
  });


    router.get('/skills/:userid', (req,res) =>{
      kafka.make_request('requestTopic', "userskills", {"userid":req.params.userid}, function(err,results){
        if(err){
         done(err,{});
         }
         else{
           if(results.code == 200){
              return res.status(200).json(results.value);;
            }else{
              return res.status(500).json(results.value);;
            }
         }
       });
    });
  router.get('/detail/:userid', (req,res) =>{
        kafka.make_request('requestTopic', "getUser", {"userid":req.params.userid}, function(err,results){
          if(err){
           done(err,{});
           }
           else{
             if(results.code == 200){
               console.log("USER"+ JSON.stringify(results.value));
               if(results.value.user.profilePicPath!== null){
              // console.log(obj);
                 var buffer = fs.readFileSync("./uploads/"+results.value.user.profilePicPath);
                 var bufferBase64 = new Buffer(buffer);
                 results.value.user.encodeImage = bufferBase64;
               }else{
              //   console.log(obj);
                 var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
                 var bufferBase64 = new Buffer(buffer);
                 results.value.user.encodeImage = bufferBase64;
               }

                return res.status(200).json(results.value);;
              }else{
                return res.status(500).json(results.value);;
              }
           }

        });
      // var arr = []
      // console.log("hello" +req);
      // pool.getConnection(function(err, connection){
      //   connection.query("select * from user  where  userid= "+  req.params.userid + ";", function(err, rows){
      //       if(rows != undefined && rows.length >0){
      //         console.log(rows);
      //         connection.query("select * from skill s join skill_user su on s.skill_id = su.skillid where su.userid ="+  req.params.userid + ";", function(err, rows1){
      //           if(rows1 != undefined && rows1.length>0){
      //             res.status(200).send({success: true, user : rows, skill : rows1});
      //           }else{
      //               res.status(200).send({success: true, user : rows, skill : []});
      //           }
      //         });
      //       }else{
      //         throw err;
      //         res.status(500).send({success: false, message : "user not found"});
      //       }
      //     });
      // });
  });

  router.get('/biddedprojects/:userid', (req, res) => {
    kafka.make_request('requestTopic', "projectsBiddedByMe", {"userid":req.params.userid}, function(err,results){
      if(err){
       done(err,{});
       }
       else{
            if(results.code == 200){
                    results.value.projectsBiddedByMe.map(function(project){
                                project.usersBidded.forEach(function(obj) {
                                if(obj.profilePicPath!== null){
                                  console.log(obj);
                                  var buffer = fs.readFileSync("./uploads/"+obj.profilePicPath);
                                  var bufferBase64 = new Buffer(buffer);
                                  obj.encodeImage = bufferBase64;
                                }else{
                                  console.log(obj);
                                  var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
                                  var bufferBase64 = new Buffer(buffer);
                                  obj.encodeImage = bufferBase64;
                                }
                              });

                              });
                return res.status(200).json(results.value);
             }else{
               return res.status(500).json(results.value);;
             }
         }
    });
  });


  router.get('/postedprojects/:userid', (req, res) => {

    kafka.make_request('requestTopic', "projectsPostedByMe", {"userid":req.params.userid}, function(err,results){
      if(err){
       done(err,{});
       }
       else{
            if(results.code == 200){


                            results.value.projectsPostedByMe.map(function(project){
                              project.usersBidded.forEach(function(obj) {
                              if(obj.profilePicPath!== null){
                                console.log(obj);
                                var buffer = fs.readFileSync("./uploads/"+obj.profilePicPath);
                                var bufferBase64 = new Buffer(buffer);
                                obj.encodeImage = bufferBase64;
                              }else{
                                console.log(obj);
                                var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
                                var bufferBase64 = new Buffer(buffer);
                                obj.encodeImage = bufferBase64;
                              }
                            });

                            });

                             return res.status(200).json(results.value);

               //return res.status(200).json(results.value);;
             }else{
               return res.status(500).json(results.value);;
             }
         }
    });


  });

    router.post('/manageTransaction',(req,res) =>{
      kafka.make_request('requestTopic', "manageTransaction", {"data":req.body}, function(err,results){
         if(err){
           done(err,{});
         }
         else{
           if(results.code == 200){
              return res.status(200).json(results.value);;
            }else{
              return res.status(500).json(results.value);;
            }
         }
      });
    });

    router.post('/auth', function(req, res){
      	if (req.isAuthenticated()) {
      		res.status(200).send({ success: true, message: 'User already logged in!' });
      	} else {
      		res.status(401).send({ success: false, message: 'Authentication failed.' });
      	}
    });



  router.post('/update', function(req, res){
      kafka.make_request('requestTopic', "updateProfile", {"data":req.body}, function(err,results){
         if(err){
           done(err,{});
         }
         else{
           if(results.code == 200){
             if(results.value.user.profilePicPath!== null){
               var buffer = fs.readFileSync("./uploads/"+results.value.user.profilePicPath);
               var bufferBase64 = new Buffer(buffer);
               results.value.user.encodeImage = bufferBase64;
             }else{
               var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
               var bufferBase64 = new Buffer(buffer);
               results.value.user.encodeImage = bufferBase64;
             }

              return res.status(200).json(results.value);;
            }else{
              return res.status(500).json(results.value);;
            }
         }
      });
  });

    router.get('/logout', function(req, res){
    	req.logout();
    	req.session.destroy();
    	res.status(200).send({ success: true, message: 'User successfully logged out!' });
    });

    router.get('/downloadFile', (req, res) => {
      console.log("********PROFILE"+ req.query.profilePicPath + "-------------" + req.query.filepath);
      if(req.query.profilePicPath!=undefined){
        var buffer = fs.readFileSync(req.query.profilePicPath);
        console.log(req.query.profilePicPath);
        console.log(buffer);
        var bufferBase64 = new Buffer(buffer);
        res.status(200).send(bufferBase64);
      }else{
          res.download("./uploads/"+req.query.filepath);
      }
    });
    module.exports = router;
