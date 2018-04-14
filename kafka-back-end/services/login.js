var mongoURL = "mongodb://localhost:27017/freelancer";
//var mongoURL = "mongodb://admin:admin@ds143099.mlab.com:43099/freelancersri"
var ObjectID = require('mongodb').ObjectID;
var mongo = require("./mongo");
var auth = require('passport-local-authenticate');

function handle_request(msg,callback){
    var res = {};
    if(msg.key === 'login'){
        mongo.connect(mongoURL, function (db) {
           db.collection('user').findOne({$or:[{email:msg.value.username},{username:msg.value.username}]},function (err, result) {
             if(result){
                  auth.verify(msg.value.password, result.password, function(err, doesMatch) {
  	                 if(doesMatch)
                      {

                          data = {  email : result.email,
                                    userid : result._id,
                                    username : result.username,
                                    primary_role : result.primary_role,
                                    profilePicPath : result.profilePicPath,
                                    user : result

                                  };
                            res.code = "200";
                            res.value = data;
                            callback(null, res);
                      }
                    else{
                      res.code = "401";
                      data = {success: false,
                      message: "Unauthorized User!"};
                      res.value = data;
                      callback(null, res);
                    }
                  });
            }else{
                    res.code = "401";
                    data = {success: false,
                    message: "User not found!"};
                    res.value = data;
                    callback(null, res);
              }
            });
        });
  }
  if(msg.key =="checkEmail"){
	   mongo.connect(mongoURL, function(db) {
       db.collection("user").find({email: msg.value.email}).toArray(function (err, rows){
		         if(rows!=undefined && rows.length>0) {
                 res.code = "409";
                 data = { inuse:'email',success: false, message: 'This email address is already in use.' };
		             res.value = data;
                 callback(null, res);
		         }else{
  		           res.code = "200";
  		           data = {success: true};
  		           res.value = data;
                 callback(null, res);
		         }
					});
		 		});
  }
  if(msg.key =="checkUsername"){
    mongo.connect(mongoURL, function(db) {
      db.collection("user").find({username: msg.value.username}).toArray(function (err, rows){
           if(rows!=undefined && rows.length>0) {
               res.code = "409";
               data = { inuse:'user',success: false, message: 'This username already exists, please choose another' };
               res.value = data;
               callback(null, res);
           }else{
             res.code = "200";
             data = {success: true};
             res.value = data;
             callback(null, res);
           }
        });
      });
  }
  if(msg.key == "addUser"){
    mongo.connect(mongoURL, function(db) {
      db.collection("user").find({email: msg.value.email}).toArray(function (err, rows) {
         if(rows!=undefined && rows.length>0) {
               res.code = "409";
               data = { inuse:'email',success: false, message: 'This email address is already in use.' };
               res.value = data;
               callback(null, res);
         }else{
               db.collection("user").find({username: msg.value.username}).toArray(function (err, rows) {
                   if(rows!=undefined && rows.length>0) {
                       res.code = "409";
                       data = { inuse:'user',success: false, message: 'This username already exists, please choose another' }
                       res.value = data;
                       callback(null, res);
                   }else{
                        auth.hash(msg.value.password, function(err, password) {
                            db.collection("user").insertOne({username:msg.value.username, password: password, email: msg.value.email, primary_role: msg.value.role}, function (err, rows) {

                                res.code = "200";
                                data ={success: true,message :"New user created " ,id:rows.insertedId, username: msg.value.username}
                                res.value = data;
                                callback(null, res);
                            });
                        });
                   }
               });
            }
        });
    });
  }
  if(msg.key =='allCategories'){
    mongo.connect(mongoURL, function(db) {
      db.collection("skill_category").find({}).toArray(function (err, rows){
           if(rows!=undefined && rows.length>0) {
               res.code = "200";
               data =  { success:'true',allCategories: rows};
               res.value = data;
               callback(null, res);
           }else{
             res.code = "400";
             data = {success: false};
             res.value = data;
             callback(null, res);
           }
        });
      });
  }
  if(msg.key =='skillsByCategory'){
    let arr=[]
      mongo.connect(mongoURL, function(db) {
          db.collection("skill_category").find({}).toArray(function (err, rows){
               if(rows!=undefined && rows.length>0) {
                  rows.map((row,index) => {
                     var arr1=[];
                      db.collection("skill").find({skill_category: row.category_id},{skill_id: 1, skill_name : 1 }).toArray(function (err, rows1){
                         rows1.map((row1) => {
                            arr1.push({id : row1.skill_id, name : row1.skill_name});
                         });
                         arr.push({category_id: row.category_id, skills : arr1});
                         if(index === rows.length-1){
                            if(err){
                              res.code = "400";
                              data = {}
                              res.value = data;
                              callback(null, res);
                            }else{
                              res.code = "200";
                              data =  { skillbyCategory: arr};
                              res.value = data;
                              callback(null, res);
                            }

                          }
                      });
                  });
               }
          });
      });
  }
  if(msg.key == "signupWithDetails"){
    mongo.connect(mongoURL, function(db) {
      db.collection("user").updateOne(
        { _id: new ObjectID(msg.value.req.userID) },
        { $set: {
          firstname :msg.value.req.fname,
          lastname :msg.value.req.lname,
          city :msg.value.req.city,
          phone :msg.value.req.phone,
          profilePicPath : msg.value.req.profilePic,
          bio :msg.value.req.bio,
          prof_headline : msg.value.req.headline,
        }},{ upsert: true },function (err, rows){
          if (err) throw err;
  				res.code = "200";
  				data =  {success: true,message :"Added" , id:msg.value.req.userID};
          res.value = data;
      	  callback(null, res);

      });
    });
  }
  if(msg.key == "skillwithUser"){

    mongo.connect(mongoURL, function(db) {
      var reqUserID = new ObjectID(msg.value.req.userID);
      var reqSkills = msg.value.req.skills;
        reqSkills.map((skill) => {
          db.collection("skill_user").insertOne({userid:reqUserID, skillid :skill},function(err,rows){
            if(err) throw err;
            res.code = "200";
            callback(null, res);
          });
        });
    });
  }
  if(msg.key == "allSkills"){
    mongo.connect(mongoURL, function(db) {
      db.collection("skill").find({ }).toArray(function (err, rows){
           if(rows!=undefined && rows.length>0) {
               res.code = "200";
               data =  {skills: rows};
               res.value = data;
               callback(null, res);
           }else{
             res.code = "501";
             data = {skills: undefined};
             res.value = data;
             callback(null, res);
           }
        });
      });
  }
  if(msg.key == "postprojects"){
    var project_name = msg.value.req.project_name;
    var description = msg.value.req.description;
    var budget_range = msg.value.req.budget_range;
    var project_pay_type = msg.value.req.project_pay_type;
    var date = new Date();
    mongo.connect(mongoURL, function(db) {
      db.collection("project").insertOne({project_name:project_name,description:description,budget_range:budget_range,project_pay_type:project_pay_type,create_ts:date,status: "OPEN" }, function (err, rows) {
        if(err) {
            res.code = "500";
            data =  {success:false,message :'Some internal error occured!'};
            res.value = data;
            callback(null, res);
        }else{
            res.code = "200";
            data = {success: true,message :"New project posted " ,projectid:rows.insertedId};
            res.value = data;
            callback(null, res);
        }
      });
    });
  }
  if(msg.key == "mapFilesToProject"){
    var projectid = msg.value.req.projectid;
    var filepath = msg.value.req.filepath;
    mongo.connect(mongoURL, function(db) {
      db.collection("project_document").insertOne({project_id:projectid,document_path: filepath}, function (err, rows) {
        if(err) {
            res.code = "500";
            data =  {success:false}
            res.value = data;
            callback(null, res);
        }else{
            res.code = "200";
            data = {success: true,message :"Files added to the project "};
            res.value = data;
            callback(null, res);
        }
      });
    });
  }
  if(msg.key == "mapSkillToProject"){
      var projectid = msg.value.req.projectid;
      var skills = msg.value.req.skills;
      mongo.connect(mongoURL, function(db) {
        skills.map((skill,index) => {
          db.collection("project_skill").insertOne({project_id:projectid, skill_id :skill.skill_id},function(err,rows){
            if(index === skills.length-1){
                if(err) {
                  res.code =500;
                  data = {success:false};
                  res.value = data;
                  callback(null, res);
                }else{
                  res.code =200;
                  data = {success: true,message :"Skills added to the project "};
                  res.value = data;
                  callback(null, res);
                }
            }
          });
        });
    });
  }
  if(msg.key == "mapProjectToUser"){
       var projectid = msg.value.req.projectid;
       var userid =  new ObjectID(msg.value.req.userid);
       var role =  msg.value.req.role;
       mongo.connect(mongoURL, function(db) {
          db.collection("project_user").insertOne({project_id:projectid, user_id :userid, Role:role},function(err,rows){
            if(err) {
                res.code = "500";
                data =  {success:false}
                res.value = data;
                callback(null, res);
            }else{
                res.code = "200";
                data = {success: true,message :"Users added to the project  "};
                res.value = data;
                callback(null, res);
            }

          });
      });
  }
  if(msg.key == "mapRecommendedProjects"){
    var userid = msg.value.userid;
    var arrtemp = [];
    var arr = [];

     mongo.connect(mongoURL, function(db) {
       db.collection('skill_user').aggregate([
         { $match : { userid : new ObjectID(userid) } },
         {
           $lookup:
           {
             from: 'project_skill',
             localField: 'skillid',
             foreignField: 'skill_id',
             as: 'orderdetails'
           }
         },
         {$unwind : "$orderdetails"},
        { $group: {_id: "$orderdetails.project_id"}}
     ]).toArray(function(err, response) {

           response.forEach( function(res1,index){
               arrtemp[index]= new ObjectID(res1._id);
               index++;
           });

  Promise.all(arrtemp).then(() =>
           db.collection("project").find({_id:{$in:arrtemp}}).toArray(function(err,res1){
            res1.map((row,index) => {

                var arr1 = [];
                var doc;
                var userBidded= [];
                    // SKILLS
                    db.collection('project_skill').aggregate([
                      { $match : { project_id : row._id.toHexString() }},
                      {$lookup:{
                          from: 'skill',
                          localField: 'skill_id',
                          foreignField: 'skill_id',
                          as: 'orderdetails1'
                        }}

                    ]).toArray(function(err,res2){
                      res2.forEach((row1) => {
                         arr1.push({id : row1.skill_id, name : row1.orderdetails1[0].skill_name});
                      });
                    });
                    // FILES

                      db.collection('project_document').aggregate([
                          { $match : { project_id : row._id.toHexString() }},
                          {$lookup:{
                              from: 'project',
                              localField: 'project_id',
                              foreignField: '_id',
                              as: 'orderdetails2'
                            }}
                        ]).toArray(function(err,res3){
                           if(res3!= undefined && res3.length >0){
                            res3.forEach((rows2) => {
                                doc = rows2.document_path;
                            });
                          }
                        })



                      db.collection('project_bid').aggregate([
                        { $match : { project_id : row._id }},
                        {$lookup:{
                            from: 'user',
                            localField: 'userid',
                            foreignField: '_id',
                            as: 'userbidproject'
                          }},
                          {$unwind : "$userbidproject"}
                      ]).toArray(function(err,res4){
                          if(res4!= undefined && res4.length >0){
                          //  userBidded = res4;
                            res4.forEach(function(res4row,index){
                              userBidded[index] = {};
                              userBidded[index].project_id = res4row.project_id;
                              userBidded[index].userid = res4row.userid;
                              userBidded[index].bid_price = res4row.bid_price;
                              userBidded[index].bid_days = res4row.bid_days;
                              userBidded[index].create_ts = res4row.create_ts;
                              userBidded[index].username = res4row.userbidproject.username;
                              userBidded[index].email = res4row.userbidproject.email;
                              userBidded[index].primary_role = res4row.userbidproject.primary_role;
                              userBidded[index].bio = res4row.userbidproject.bio;
                              userBidded[index].city = res4row.userbidproject.city;
                              userBidded[index].firstname = res4row.userbidproject.firstname;
                              userBidded[index].lastname = res4row.userbidproject.lastname;
                              userBidded[index].phone = res4row.userbidproject.phone;
                              userBidded[index].prof_headline = res4row.userbidproject.prof_headline;
                              userBidded[index].profilePicPath = res4row.userbidproject.profilePicPath;
                            });
                          }
                      })



                      db.collection('project_user').aggregate([
                        { $match : { Role : 'Employer', project_id : row._id.toHexString() }},
                        {$lookup:{
                            from: 'user',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'project_user'
                          }},
                          {$unwind : "$project_user"}
                      ]).toArray(function(err,res5){
                        if(res5 != undefined && res5.length >0){
                            row.project_id = row._id;
                            arr.push({project: row, skills : arr1, postedBy : res5[0].project_user, file : doc ,usersBidded : userBidded});
                            if(index == res1.length-1){
                                 if(err){
                                   res.code = "500";
                                   data =  {success: false, projectsWithSkills:[]}
                                   res.value = data;
                                   callback(null, res);
                                 }else{
                                   res.code = "200";
                                   data = {projectsWithSkills: arr};
                                   res.value = data;
                                   callback(null, res);
                               }
                            }
                        }
                      })



            });


            if(res1 == undefined || res1.length ==0){
              res.code = "500";
              data =  {projectsWithSkills:[]}
              res.value = data;
              callback(null, res);
             }
         }));
       });

     });
  }
  if(msg.key == "bidProject"){
     var project_id = new ObjectID(msg.value.req.project_id);
     var user_id = new ObjectID(msg.value.req.user_id);
     var bid_price = parseInt(msg.value.req.bid_price);
     var bid_days = msg.value.req.bid_days;
     var create_ts =  new Date();
    mongo.connect(mongoURL, function(db) {
      db.collection("project_bid").insertOne({project_id:project_id, userid :user_id, bid_price:bid_price,bid_days:bid_days,create_ts:create_ts},function(err,rows){
        if(err) {
            res.code = "500";
            data =  {success: false};
            res.value = data;
            callback(null, res);
        }else{
            res.code = "200";
            data = {success: true,message :" user bidded for project successfully " }
            res.value = data;
            callback(null, res);
        }
      });
    });
  }
  if(msg.key == "projectsPostedByMe"){
    var arr = [];
    var arr1 = [];
    var userBidded= [];
    var mybid ={};
    var doc;
    var arrtemp = [];
    var userid = msg.value.userid;
    mongo.connect(mongoURL, function(db) {
      db.collection('project_user').aggregate([
        { $match : { user_id : new ObjectID(userid), Role : 'Employer'} },
        {
          $lookup:
          {
            from: 'user',
            localField: 'user_id',
            foreignField: 'userid',
            as: 'project_user1'
          }
        }
    ]).toArray(function(err, response) {
      if(err){
        res.code = "500";
        data =  {success: false};
        res.value = data;
        callback(null, res);
      }else{
        response.forEach(  function(res1,index){
           arrtemp[index]= new ObjectID(res1.project_id);
           index++;
         });

      Promise.all(arrtemp).then(() =>

        db.collection("project").find({_id:{$in:arrtemp}}).toArray(function(err,response1){

        response1.map((row,index) => {
          db.collection('project_skill').aggregate([
            { $match : { project_id :  row._id.toHexString()}},
            {$lookup:{
                from: 'skill',
                localField: 'skill_id',
                foreignField: 'skill_id',
                as: 'project_skill'
              }}
          ]).toArray(function(err,res1){
              if(res1!= undefined && res1.length >0){
                res1.map((row1) => {
                  arr1.push({id : row1.skill_id, name: row1.project_skill[0].skill_name});
                });
              }
          });

          // FILES
          db.collection('project_document').aggregate([
            { $match : { project_id : row._id.toHexString()}},
            {$lookup:{
                from: 'project',
                localField: 'project_id',
                foreignField: '_id',
                as: 'orderdetails2'
              }}
          ]).toArray(function(err,res2){
             if(res2!= undefined && res2.length >0){
              res2.map((rows2) => {
                  doc = rows2.document_path;
              });
            }
          });
          //userbidded
          db.collection('project_bid').aggregate([
            { $match : { project_id :  row._id }},
            {$lookup:{
                from: 'user',
                localField: 'userid',
                foreignField: '_id',
                as: 'userbidproject'
              }},
              {$unwind : "$userbidproject"}
          ]).toArray(function(err,res4){
              if(res4!= undefined && res4.length >0){
              //  userBidded = res4;
                res4.map(function(res4row,index){
                  userBidded[index] = {};
                  userBidded[index].project_id = res4row.project_id;
                  userBidded[index].userid = res4row.userid;
                  userBidded[index].bid_price = res4row.bid_price;
                  userBidded[index].bid_days = res4row.bid_days;
                  userBidded[index].create_ts = res4row.create_ts;
                  userBidded[index].username = res4row.userbidproject.username;
                  userBidded[index].email = res4row.userbidproject.email;
                  userBidded[index].primary_role = res4row.userbidproject.primary_role;
                  userBidded[index].bio = res4row.userbidproject.bio;
                  userBidded[index].city = res4row.userbidproject.city;
                  userBidded[index].firstname = res4row.userbidproject.firstname;
                  userBidded[index].lastname = res4row.userbidproject.lastname;
                  userBidded[index].phone = res4row.userbidproject.phone;
                  userBidded[index].prof_headline = res4row.userbidproject.prof_headline;
                  userBidded[index].profilePicPath = res4row.userbidproject.profilePicPath;
                });
              }
          });

          //MY BID
          db.collection('project_bid').aggregate([
            { $match : { project_id :  row._id }},
            {$lookup:{
                from: 'project',
                localField: 'project_id',
                foreignField: '_id',
                as: 'userbidproject1'
              }},
              {$unwind : "$userbidproject1"},
              { $project: { userbidproject1 :1,bid_price :1,bid_days:1, "average_bid": { $avg: "$bid_price" }
             }}
          ]).toArray(function(err,res5){
            if(res5!= undefined && res5.length >0){
              mybid = res5[0];
            }
          });
                /**** GHATIYA CODE STARTS****/

                // POSTED BY
                db.collection('project_user').aggregate([
                  { $match : { Role : 'Employer', project_id :   row._id.toHexString() }},
                  {$lookup:{
                      from: 'user',
                      localField: 'user_id',
                      foreignField: '_id',
                      as: 'project_user'
                  }},
                  {$unwind : "$project_user"}
                ]).toArray(function(err,res6){
                    if(res6 != undefined && res6.length >0){
                        row.project_id = row._id;
                        arr.push({project: row, skills : arr1, postedBy : res6[0], file : doc ,usersBidded : userBidded,mybid : mybid});
                        if(index == response.length-1){
                             if(err){
                               res.code = "500";
                               data =  {success: false, projectsPostedByMe:[]}
                               res.value = data;
                               callback(null, res);
                             }else{
                               res.code = "200";
                               data = {projectsPostedByMe: arr};
                               res.value = data;
                               callback(null, res);
                             }
                        }
                    }


                  });
                });
              }));


        if(response == undefined || response.length ==0){
          res.code = "500";
          data =  {projectsPostedByMe:[]}
          res.value = data;
          callback(null, res);
         }
      }
    });

  });
}
if(msg.key == "projectsBiddedByMe"){

  var arr = [];
  var arr1 = [];
  var userBidded= [];
  var mybid ={};
  var doc;
  var arrtemp = [];
  var userid = msg.value.userid;
  mongo.connect(mongoURL, function(db) {
    db.collection('project_bid').aggregate([
      { $match : { userid : new ObjectID(userid)} },
      {
        $lookup:
        {
          from: 'user',
          localField: 'userid',
          foreignField: '_id',
          as: 'project_bid1'
        }
      }
  ]).toArray(function(err, response) {
    if(err){
      res.code = "500";
      data =  {success: false};
      res.value = data;
      callback(null, res);
    }else{
      response.forEach(function(res1,index){
         arrtemp[index]= new ObjectID(res1.project_id);
         index++;
       });
    Promise.all(arrtemp).then(() =>
      db.collection("project").find({_id:{$in:arrtemp}}).toArray(function(err,response1){

      response1.map((row,index) => {
        db.collection('project_skill').aggregate([
          { $match : { project_id :  row._id.toHexString()}},
          {$lookup:{
              from: 'skill',
              localField: 'skill_id',
              foreignField: 'skill_id',
              as: 'project_skill'
            }}
        ]).toArray(function(err,res1){
            if(res1!= undefined && res1.length >0){
              res1.map((row1) => {
                arr1.push({id : row1.skill_id, name: row1.project_skill[0].skill_name});
              });
            }
        });

        // FILES
        db.collection('project_document').aggregate([
          { $match : { project_id : row._id.toHexString()}},
          {$lookup:{
              from: 'project',
              localField: 'project_id',
              foreignField: '_id',
              as: 'orderdetails2'
            }}
        ]).toArray(function(err,res2){
           if(res2!= undefined && res2.length >0){
            res2.map((rows2) => {
                doc = rows2.document_path;
            });
          }
        });
        //userbidded
        db.collection('project_bid').aggregate([
          { $match : { project_id :  row._id }},
          {$lookup:{
              from: 'user',
              localField: 'userid',
              foreignField: '_id',
              as: 'userbidproject'
            }},
            {$unwind : "$userbidproject"}
        ]).toArray(function(err,res4){
            if(res4!= undefined && res4.length >0){
            //  userBidded = res4;
              res4.map(function(res4row,index){
                userBidded[index] = {};
                userBidded[index].project_id = res4row.project_id;
                userBidded[index].userid = res4row.userid;
                userBidded[index].bid_price = res4row.bid_price;
                userBidded[index].bid_days = res4row.bid_days;
                userBidded[index].create_ts = res4row.create_ts;
                userBidded[index].username = res4row.userbidproject.username;
                userBidded[index].email = res4row.userbidproject.email;
                userBidded[index].primary_role = res4row.userbidproject.primary_role;
                userBidded[index].bio = res4row.userbidproject.bio;
                userBidded[index].city = res4row.userbidproject.city;
                userBidded[index].firstname = res4row.userbidproject.firstname;
                userBidded[index].lastname = res4row.userbidproject.lastname;
                userBidded[index].phone = res4row.userbidproject.phone;
                userBidded[index].prof_headline = res4row.userbidproject.prof_headline;
                userBidded[index].profilePicPath = res4row.userbidproject.profilePicPath;
              });
            }
        });

        //MY BID
        db.collection('project_bid').aggregate([
          { $match : { project_id :  row._id }},
          {$lookup:{
              from: 'project',
              localField: 'project_id',
              foreignField: '_id',
              as: 'userbidproject1'
            }},
            {$unwind : "$userbidproject1"},
            { $project: { userbidproject1 :1,bid_price :1,bid_days:1, "average_bid": { $avg: "$bid_price" }
           }}
          //  { $group: {_id: "$project_id",average_bid :{$avg:"$bid_price"}}}
        ]).toArray(function(err,res5){
          if(res5!= undefined && res5.length >0){
              mybid = res5[0];


              // POSTED BY
              db.collection('project_user').aggregate([
                { $match : { Role : 'Employer', project_id :   row._id.toHexString() }},
                {$lookup:{
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'project_user'
                }},
                {$unwind : "$project_user"}
              ]).toArray(function(err,res6){
                  if(res6 != undefined && res6.length >0){
                      row.project_id = row._id;
                      arr.push({project: row, skills : arr1, postedBy : res6[0], file : doc ,usersBidded : userBidded,mybid : mybid});
                  //    arr.push({project: row, skills : arr1, postedBy : res6[0].project_user, file : doc ,usersBidded : userBidded});
                      if(index == response.length-1){
                           if(err){
                             res.code = "500";
                             data =  {success: false, projectsBiddedByMe:[]}
                             res.value = data;
                             callback(null, res);
                           }else{
                             res.code = "200";
                             data = {projectsBiddedByMe: arr};
                             res.value = data;
                             callback(null, res);
                           }
                      }
                  }
                });

            }
        });


        });

      }));
      if(response == undefined || response.length ==0){
        res.code = "500";
        data =  {projectsBiddedByMe:[]}
        res.value = data;
        callback(null, res);
       }
    }
  });

});
}
if(msg.key == "userskills"){
var userid = msg.value.userid;
var userSkill=[];
console.log(userid);
mongo.connect(mongoURL, function(db) {
  db.collection('skill_user').aggregate([
    { $match : { userid : new ObjectID(userid) }},
    {$lookup:{
        from: 'skill',
        localField: 'skillid',
        foreignField: 'skill_id',
        as: 'skillUser'
      }}
  ]).toArray(function(err,response){

     if(response!= undefined && response.length >0){
       response.map((row1) => {
        userSkill.push({id : row1.skillid, skill_name: row1.skillUser[0].skill_name});
      });
      res.code = "200";
      data =  {userSkill:userSkill}
      res.value = data;
      callback(null, res);
    }else{
      res.code = "500";
      data =  {userSkill:[]}
      res.value = data;
      callback(null, res);
    }

  });
});
}
if(msg.key =="hireUser"){
  mongo.connect(mongoURL, function(db) {
    db.collection("project").updateOne(
      { _id: new ObjectID(msg.value.data.hiredFreelancer.project_id) },
      { $set: {
        status :msg.value.data.status,
        hiredFreelancer :msg.value.data.hiredFreelancer,
        submission : msg.value.data.submission
      }},{ upsert: true },function (err, rows){
        if (err) {
          res.code = "500";
          data =  {success: false,message :"Hired freelancer internal error" };
          res.value = data;
          callback(null, res);
        }else{
        res.code = "200";
        data =  {success: true,message :"Hired successfully" };
        res.value = data;
        callback(null, res);
      }

    });
  });
}
if(msg.key == "submitsolution"){
  mongo.connect(mongoURL, function(db) {
    db.collection("project").updateOne(
      { _id: new ObjectID(msg.value.req.project_id) },
      { $set: {
        submission :msg.value.req.submission
      }},{ upsert: true },function (err, rows){
        if (err) {
          res.code = "500";
          data =  {success: false,message :"Solution submission internal error" };
          res.value = data;
          callback(null, res);
        }else{
        res.code = "200";
        data =  {success: true,message :"Solution submitted succesully!" };
        res.value = data;
        callback(null, res);
      }

    });
  });
}
if(msg.key =="manageTransaction"){
  mongo.connect(mongoURL, function(db) {
    db.collection("user").updateOne(
    { _id: new ObjectID(msg.value.data.project.hiredFreelancer.userid) },
     { $push: { transactionhistory: {
       project : msg.value.data.project,
       money : msg.value.data.project.hiredFreelancer.bid_price
     } } }
  ,{ upsert: true },function (err, rows1){
          db.collection("user").findOneAndUpdate(
            { _id: new ObjectID(msg.value.data.postedby) },
            { $push: { transactionhistory: {
              project : msg.value.data.project,
              money : -msg.value.data.project.hiredFreelancer.bid_price
            } } }
              ,{ upsert: true },function (err, rows2){
              db.collection("project").updateOne(
                { _id: new ObjectID(msg.value.data.project._id) },
                { $set: {
                    status : "CLOSED"
                }},{ upsert: true },function (err, rows3){
                  if (err) {
                        res.code = "500";
                        data =  {success: false,message :"Transaction unsuccessful" };
                        res.value = data;
                        callback(null, res);
                    }else{
                        res.code = "200";
                        data =  {success: true,message :"Transaction Successful!" , user : rows2.value};
                        res.value = data;
                        callback(null, res);
                  }
              });

            });

          });
});
}

if(msg.key =="updateProfile"){
  mongo.connect(mongoURL, function(db) {
    db.collection("user").findOneAndUpdate(
    { _id: new ObjectID(msg.value.data.id) },
    { $set: {
      phone :msg.value.data.phone,
      profilePicPath : msg.value.data.profilePic,
      bio :msg.value.data.bio,
      prof_headline : msg.value.data.headline,
    }}
  ,{ upsert: true },{ returnNewDocument:true},function (err, rows1){
    if (err) {
          res.code = "500";
          data =  {success: false,message :"Update User internal error" };
          res.value = data;
          callback(null, res);
      }else{
          res.code = "200";
          data =  {success: true,message :"Updated User successfully" , user : rows1.value};
          res.value = data;
          callback(null, res);
    }
  });
  });
}

if(msg.key == "getAllprojects"){
  var userid = msg.value.userid;
  var arrtemp = [];
  var arr = [];

   mongo.connect(mongoURL, function(db) {
     db.collection('project').find({}).toArray(function(err, response) {

          response.forEach(function(res1,index){
             arrtemp[index]=res1._id;
             index++;
          });

          Promise.all(arrtemp).then(() =>
            db.collection("project").find({_id:{$in:arrtemp}}).toArray(function(err,res1){
                    res1.map((row,index) => {
                      var arr1 = [];
                      var doc;
                      var userBidded= [];
                          // SKILLS
                           db.collection('project_skill').aggregate([
                            { $match : { project_id : row._id.toHexString() }},
                            {$lookup:{
                                from: 'skill',
                                localField: 'skill_id',
                                foreignField: 'skill_id',
                                as: 'orderdetails1'
                              }}
                            ]).toArray(function(err,res2){
                              res2.map((row1) => {
                                arr1.push({id : row1.skill_id, name : row1.orderdetails1[0].skill_name});
                              });
                            });
                            // FILES
                             db.collection('project_document').aggregate([
                              { $match : { project_id : row._id.toHexString() }},
                              {$lookup:{
                                  from: 'project',
                                  localField: 'project_id',
                                  foreignField: '_id',
                                  as: 'orderdetails2'
                                }}
                            ]).toArray(function(err,res3){
                               if(res3!= undefined && res3.length >0){
                                res3.map((rows2) => {
                                    doc = rows2.document_path;
                                });
                              }
                            });

                             db.collection('project_bid').aggregate([
                              { $match : { project_id : row._id }},
                              {$lookup:{
                                  from: 'user',
                                  localField: 'userid',
                                  foreignField: '_id',
                                  as: 'userbidproject'
                                }},
                                {$unwind : "$userbidproject"}
                            ]).toArray(function(err,res4){
                                if(res4!= undefined && res4.length >0){
                                  res4.map(function(res4row,index){
                                    userBidded[index] = {};
                                    userBidded[index].project_id = res4row.project_id;
                                    userBidded[index].userid = res4row.userid;
                                    userBidded[index].bid_price = res4row.bid_price;
                                    userBidded[index].bid_days = res4row.bid_days;
                                    userBidded[index].create_ts = res4row.create_ts;
                                    userBidded[index].username = res4row.userbidproject.username;
                                    userBidded[index].email = res4row.userbidproject.email;
                                    userBidded[index].primary_role = res4row.userbidproject.primary_role;
                                    userBidded[index].bio = res4row.userbidproject.bio;
                                    userBidded[index].city = res4row.userbidproject.city;
                                    userBidded[index].firstname = res4row.userbidproject.firstname;
                                    userBidded[index].lastname = res4row.userbidproject.lastname;
                                    userBidded[index].phone = res4row.userbidproject.phone;
                                    userBidded[index].prof_headline = res4row.userbidproject.prof_headline;
                                    userBidded[index].profilePicPath = res4row.userbidproject.profilePicPath;
                                  });
                                }

                            });


                              db.collection('project_user').aggregate([
                                { $match : { Role : 'Employer', project_id : row._id.toHexString() }},
                                  {$lookup:{
                                    from: 'user',
                                    localField: 'user_id',
                                    foreignField: '_id',
                                    as: 'project_user'
                                  }},
                                  {$unwind : "$project_user"}
                                  ]).toArray(function(err,res5){
                                    if(res5 != undefined && res5.length >0){
                                      row.project_id = row._id;
                                      arr.push({project: row, skills : arr1, postedBy : res5[0].project_user, file : doc ,usersBidded : userBidded});
                                      if(index == res1.length-1){
                                           if(err){
                                             res.code = "500";
                                             data =  {success: false, allProjects:[]}
                                             res.value = data;
                                             callback(null, res);
                                           }else{
                                             res.code = "200";
                                             data = {allProjects: arr};

                                             res.value = data;
                                             callback(null, res);
                                         }
                                      }

                                      }
                                  });
                      });
                  if(res1 == undefined || res1.length ==0){
                    res.code = "500";
                    data =  {allProjects:[]}
                    res.value = data;
                    callback(null, res);
                   }

               }));
    // );
     });

   });
}

}

exports.handle_request = handle_request;
