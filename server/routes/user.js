var express = require('express');
var pool = require('./../pool');
var router = express.Router();
var fs = require('fs-extra');
  router.get('/detail/:userid', (req,res) =>{
      var arr = []
      console.log("hello" +req);
      pool.getConnection(function(err, connection){
        connection.query("select * from user  where  userid= "+  req.params.userid + ";", function(err, rows){
            if(rows != undefined && rows.length >0){
              console.log(rows);
              connection.query("select * from skill s join skill_user su on s.skill_id = su.skillid where su.userid ="+  req.params.userid + ";", function(err, rows1){
                if(rows1 != undefined && rows1.length>0){
                  res.status(200).send({success: true, user : rows, skill : rows1});
                }else{
                    res.status(200).send({success: true, user : rows, skill : []});
                }
              });
            }else{
              throw err;
              res.status(500).send({success: false, message : "user not found"});
            }
          });
      });
  });

  router.get('/biddedprojects/:userid', (req, res) => {
    var arr = [];
    var arr1 = [];
    var userBidded= [];
    var mybid;
    var doc;
      pool.getConnection(function(err, connection){
        connection.query("select * from project where project_id in (SELECT pb.project_id FROM project_bid pb join user u on u.userid = pb.user_id where u.userid ="+ req.params.userid+")",  function(err, rows){
        connection.release();//release the connection
          if(err){
              throw err;
              res.status(500).send({status:false});
         }else{

           rows.map((row,index) => {
             var arr1=[];
             console.log(row.project_id);
             connection.query("select  * from skill s join project_skill ps on s.skill_id= ps.skill_id where ps.project_id = '" + row.project_id+ "';",  function(err, rows1){
               rows1.map((row1) => {
                     arr1.push({id : row1.skill_id, name : row1.skill_name});
                  });
              });

             connection.query("select  * from project_document pd join project p on pd.project_id= p.project_id where pd.project_id = '" + row.project_id+ "';",  function(err, rows3){
                if(rows3!= undefined && rows3.length >0){
                  doc = rows3[0].document_path;
                }
              });

              connection.query("select * from freelancer.user u join freelancer.project_bid pb on u.userid = pb.user_id where pb.project_id = '" + row.project_id+ "';",  function(err, rows4){
                 if(rows4!= undefined && rows4.length >0){
                   userBidded = rows4;
                 }
               });

               console.log(row.project_id);
               connection.query("select * , AVG(bid_price) as 'average_bid' from freelancer.user u join freelancer.project_bid pb on u.userid = pb.user_id where pb.user_id = '"+ req.params.userid+ "' and pb.project_id ='"+ row.project_id+"' group by pb.project_id;",  function(err, rows5){
                    console.log(rows5);
                  if(rows5!= undefined && rows5.length >0){
                    mybid = rows5[0];
                  }
                });



             connection.query("select * from user u join project_user pu on u.userid = pu.user_id where pu.Role = 'Employer' and project_id = "+row.project_id +";",function(err,rows2){
               if(rows2 != undefined && rows2.length >0){

                   arr.push({project: row, skills : arr1, postedBy : rows2[0], file : doc ,usersBidded : userBidded,mybid : mybid});
                   if(index === rows.length-1){
                      if(err) throw err;
                      res.status(200).send({projectsBiddedByMe: arr});
                      return;
                    }
                }
             });
         });
            if(rows == undefined || rows.length ==0){
               res.status(500).send({status: false, projectsBiddedByMe : [] });
             }
          }
        });
      });
  });



  router.get('/postedprojects/:userid', (req, res) => {
    var arr = [];
    var arr1 = [];
    var userBidded= [];
    var mybid;
    var doc;
      pool.getConnection(function(err, connection){
        connection.query("select * from project where project_id in (SELECT pb.project_id FROM project_user pb join user u on u.userid = pb.user_id where pb.Role = 'Employer' and  u.userid ="+ req.params.userid+")",  function(err, rows){
        connection.release();//release the connection
          if(err){
              throw err;
              res.status(500).send({status:false});
         }else{

           rows.map((row,index) => {
             var arr1=[];
             console.log(row.project_id);
             connection.query("select  * from skill s join project_skill ps on s.skill_id= ps.skill_id where ps.project_id = '" + row.project_id+ "';",  function(err, rows1){
               rows1.map((row1) => {
                     arr1.push({id : row1.skill_id, name : row1.skill_name});
                  });
              });

             connection.query("select  * from project_document pd join project p on pd.project_id= p.project_id where pd.project_id = '" + row.project_id+ "';",  function(err, rows3){
                if(rows3!= undefined && rows3.length >0){
                  doc = rows3[0].document_path;
                }
              });

              connection.query("select * from freelancer.user u join freelancer.project_bid pb on u.userid = pb.user_id where pb.project_id = '" + row.project_id+ "';",  function(err, rows4){
                 if(rows4!= undefined && rows4.length >0){
                   userBidded = rows4;
                 }
               });

               console.log(row.project_id);
               connection.query("select * , AVG(bid_price) as 'average_bid' from freelancer.user u join freelancer.project_bid pb on u.userid = pb.user_id where pb.project_id ='"+ row.project_id+"' group by pb.project_id;",  function(err, rows5){
                    console.log(rows5);
                  if(rows5!= undefined && rows5.length >0){
                    mybid = rows5[0];
                  }
                });



             connection.query("select * from user u join project_user pu on u.userid = pu.user_id where pu.Role = 'Employer' and project_id = "+row.project_id +";",function(err,rows2){
               if(rows2 != undefined && rows2.length >0){

                   arr.push({project: row, skills : arr1, postedBy : rows2[0], file : doc ,usersBidded : userBidded,mybid : mybid});
                   if(index === rows.length-1){
                      if(err) throw err;
                      res.status(200).send({projectsPostedByMe: arr});
                      return;
                    }
                }
             });
         });
            if(rows == undefined || rows.length ==0){
               res.status(500).send({status: false, projectsPostedByMe : [] });
             }
          }
        });
      });
  });
    router.get('/downloadFile', (req, res) => {
      if(req.query.profilePicPath!='undefined'){
        var buffer = fs.readFileSync(req.query.profilePicPath);
        console.log(req.query.profilePicPath);
        console.log(buffer);
        var bufferBase64 = new Buffer(buffer);
        res.status(200).send(bufferBase64);
      }
    });
    module.exports = router;
