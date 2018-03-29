var auth = require('passport-local-authenticate');
var mongo = require('./mongo');

function handle_request(msg, callback){

    if(msg.key=="login"){
      console.log("inside kafka backend")
    }
  /*
   Bhavan's code
   var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    if(msg.username == "bhavan@b.com" && msg.password =="a"){
        res.code = "200";
        res.value = "Success Login";

    }
    else{
        res.code = "401";
        res.value = "Failed Login";
    }
    callback(null, res);
    */
}

exports.handle_request = handle_request;
