var auth = require('passport-local-authenticate');
var mongo = require('./mongo');


var dbArray = [];
var poolSize = 100;
while(poolSize>0){
	mongo.connect("mongodb://localhost:27017/freelancer", function(database) {
		dbArray.push(database);
	});
	poolSize--;
}

function acquireDBInstance(){
	while(dbArray.length==0){}
	return dbArray.pop();
}

function handle_request(msg, callback){
  var res = {};
  var data = {};
    console.log("inside kafka backend handle_request");
    if(msg.key=="login"){
       let db = acquireDBInstance();
       db.collection('user').find({$or:[{email:msg.value.username},{username:msg.value.username}]}).toArray(function (err, result) {
           if (err) throw err;
           console.log("inside" + result.length + "       " + msg.value.password + "  "+  result[0].password);
           if(result!=undefined && result.length==1){
                doesMatch=true;
                if(doesMatch){
                  data = {
                            email : result[0].email,
                            userid : result[0]._id,
                            username : msg.value.username,
                            primary_role : result[0].primary_role
                        };
                  res.code = "200";
                }else{
                  res.code = "401";
			      	    data = {success: false,
									message: "Unauthorized User!"};
                }
                res.value = data;
                dbArray.push(db);
                delete db;
                callback(null, res);
            //  });
           }else{
             res.code = "401";
	      	    	data = {success: false,
							message: "User not found!"};
	      	        res.value = data;
	      	        dbArray.push(db);
	      	        delete db;
		      	    callback(null, res);
           }
       });
     }
     if(msg.key=="signup"){
        var res = {};
        let db = acquireDBInstance();
        auth.hash(msg.value.password, function(err, password) {
              db.collection("user").find({email: msg.value.email}).toArray(function (err, rows) {
					    if(rows!=undefined && rows.length>0){
                res.code = "400";
		      	    	data = {success: false,
								message: "User already exists."};
		      	        res.value = data;
		      	        dbArray.push(db);
		      	        delete db;
			      	    callback(null, res);
              }
          });
        });
     }
     if(msg.key=="checkEmail"){
       var res = {};
       let db = acquireDBInstance();
       db.collection("user").find({email: msg.value.email}).toArray(function (err, rows) {
         if(rows!=undefined && rows.length>0) {
             res.code = "409";
             data = { inuse:'email',success: false, message: 'This email address is already in use.' };
         }else{
           res.code = "200";
           data = {success: true};
         }
         res.value = data;
         dbArray.push(db);
         delete db;
         callback(null, res);
       });
     }
     if(msg.key=="checkUsername"){
       var res = {};
       let db = acquireDBInstance();
       db.collection("user").find({username: msg.value.username}).toArray(function (err, rows) {
         if(rows!=undefined && rows.length>0) {
             res.code = "409";
             data = { inuse:'user',success: false, message: 'This username already exists, please choose another' }
         }else{
           res.code = "200";
           data = {success: true};
         }
         res.value = data;
         dbArray.push(db);
         delete db;
         callback(null, res);
       });
     }



}

exports.handle_request = handle_request;
