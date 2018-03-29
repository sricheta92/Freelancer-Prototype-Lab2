  var express = require('express');
  var pool = require('./../pool');
  var multer = require('multer');
  var router = express.Router();
  var fs = require('fs-extra')

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + "."+ file.originalname)
    }
  })

  var upload = multer({ storage: storage }).single('file');

  router.post('/uploadFiles', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return res.status(501).send({error:err});
      }
      res.json({originalname :req.file.originalname, uploadname :req.file.filename});
    })
  })

  router.post("/postprojects",function(req,res){

    var project_name = req.body.project_name;
    var description = req.body.description;
    var budget_range = req.body.budget_range;
    var project_pay_type = req.body.project_pay_type;
    pool.getConnection(function(err, connection){
     connection.query("insert into project (`project_name`,`description`,`budget_range`,`project_pay_type`,`create_ts`)  VALUES ("+
       "'"+project_name+
       "', '"+description+
       "', '"+budget_range+
       "', '"+project_pay_type+
       "', CURDATE());",  function(err,results, fields){
       connection.release();//release the connection
           if(err) {
               res.status(500).send({success:false,message :'Some internal error occured!'});
             throw err;
             return;

         }else{
             res.status(200).send({success: true,message :"New project posted " ,projectid:results.insertId});
         }
      });

    });

  });


  router.get("/mapRecommendedProjects/:userId" ,function(req,res){
    debugger
    var arr = [];
    var arr1 = [];
    var userBidded= [];
    var doc;
      pool.getConnection(function(err, connection){
        connection.query("select * from project where project_id in ( select distinct(project_id) FROM project_skill ps join skill_user su where ps.skill_id = su.skillid and su.userid = "+ req.params.userId+")",  function(err, rows){
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

                   rows4.forEach(function(obj) {
                     if(obj.profilePicPath!== null){
                     console.log(obj);
                     var buffer = fs.readFileSync(obj.profilePicPath);
                       var bufferBase64 = new Buffer(buffer);
                  
                     obj.encodeImage = bufferBase64;
                   }else{
                     console.log(obj);
                     var buffer = fs.readFileSync("./uploads/default/noimg.PNG");
                     var bufferBase64 = new Buffer(buffer);
                     obj.encodeImage = bufferBase64;
                   }
                   });
                   userBidded = rows4;

                 }
               });

             connection.query("select * from user u join project_user pu on u.userid = pu.user_id where pu.Role = 'Employer' and project_id = "+row.project_id +";",function(err,rows2){
               if(rows2 != undefined && rows2.length >0){

                 console.log(rows2.length);
                   arr.push({project: row, skills : arr1, postedBy : rows2[0], file : doc ,usersBidded : userBidded});
                   if(index === rows.length-1){
                      if(err) throw err;
                      res.status(200).send({projectsWithSkills: arr});
                    }
                 }
             });
         });

           if(rows == undefined || rows.length ==0){
              res.status(500).send({status: false, projectsWithSkills : [] });
            }
          }
        });
      });
  });


    router.get("/getWhoPostedTheProject/:projectId" ,function(req,res){
        pool.getConnection(function(err, connection){
          connection.query("select * from user u join project_user pu on u.userid = pu.user_id where pu.Role = 'Employer' and project_id = "+ req.params.projectId+";",  function(err, rows){
            connection.release();//release the connection
            if(err){
                throw err;
                res.status(500).send({status:false});
           }else{
                res.status(200).send({status: true, postedBy : rows[0] });
            }
          });
        });
    });

    router.get("/getSkills/:projectId" ,function(req,res){
        pool.getConnection(function(err, connection){
          connection.query("select skill_name from skill s join project_skill ps on s.skill_id = ps.skill_id where project_id = "+ req.params.projectId+";",  function(err, rows){
            connection.release();//release the connection
            if(err){
                throw err;
                res.status(500).send({status:false});
           }else{
                res.status(200).send({status: true, skillsRequiredByProject : rows });
            }
          });
        });
    });

  router.post("/mapFilesToProject",function(req,res){

    var projectid = req.body.projectid;
    var filepath = req.body.filepath;
    pool.getConnection(function(err, connection){
    connection.query("insert into project_document (`project_id`,`document_path`)  VALUES ("+
      "'"+projectid+
      "', '"+filepath+
      "');",  function(err,results, fields){
      connection.release();//release the connection
          if(err) {
            res.status(500).send({success:false});
            throw err;
            return;

        }else{
            res.status(200).send({success: true,message :"Files added to the project "});
        }
     });

  });
  });


  router.post("/mapSkillToProject",function(req,res){

    var projectid = req.body.projectid;
    var skills = req.body.skills;
    pool.getConnection(function(err, connection){
    skills.map((skill,index) => {
        connection.query("insert into project_skill (`project_id`,`skill_id`)  VALUES ("+
          "'"+projectid+
          "', '"+skill.skill_id+
          "');",  function(err,results, fields){
           if(index === skills.length-1){
              if(err) {
                  res.status(500).send({success:false});
                  throw err;
                  return;
              }else{
                  res.status(200).send({success: true,message :"Skills added to the project "});
              }
          }
         });
    });

  });
  });

  router.post("/mapProjectToUser",function(req,res){

      var projectid = req.body.projectid;
      var userid = req.body.userid;
      var role = req.body.role;

      pool.getConnection(function(err, connection){

          connection.query("insert into project_user (`project_id`,`user_id`,`Role`)  VALUES ("+
            "'"+projectid+
            "', '"+userid+
            "', '"+role+
            "');",  function(err,results, fields){

                if(err) {
                    res.status(500).send({success:false});
                    throw err;
                    return;
                }else{
                    res.status(200).send({success: true,message :"Users added to the project "});
                }

           });


    });
  });

router.post("/bidproject",function(req,res){

  var project_id = req.body.project_id;
  var user_id = req.body.user_id;
  var bid_price = req.body.bid_price;
  var bid_days = req.body.bid_days;
  pool.getConnection(function(err, connection){
   connection.query("insert into project_bid (`project_id`,`user_id`,`bid_price`,`bid_days`,`create_date`)  VALUES ("+
     "'"+project_id+
     "', '"+user_id+
     "', '"+bid_price+
     "', '"+bid_days+
     "', CURDATE());",  function(err,results, fields){
     connection.release();//release the connection
         if(err) {
             res.status(500).send({success: false});
           throw err;
           return;

       }else{
           res.status(200).send({success: true,message :" user bidded for project successfully " });
       }
    });

  });

});


  module.exports = router;
