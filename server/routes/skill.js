var express = require('express');
var pool = require('./../pool');
var router = express.Router();
var kafka = require('./kafka/client');

router.post('/withDetails', (req, res) => {

    kafka.make_request('requestTopic', "skillwithUser", {"req":req.body}, function(err,results){
        if(err){
         done(err,{});
         }
         else{
              if(results.code == 200){
                 return res.status(200);
               }else{
                 return res.status(409);
               }
           }
      });


});
router.get('/allSkills', (req, res) => {

  kafka.make_request('requestTopic', "allSkills", {}, function(err,results){
    if(err){
     done(err,{});
     }
     else{
          if(results.code == 200){
             return res.status(200).json(results.value);
           }else{
             return res.status(501).json(results.value);
           }
       }
  });
});
router.get('/allCategories', (req, res) => {

  kafka.make_request('requestTopic', "allCategories", {}, function(err,results){
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

});

router.get('/skillsByCategory', (req, res) => {

  kafka.make_request('requestTopic', "skillsByCategory", {}, function(err,results){
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

});

module.exports = router;
