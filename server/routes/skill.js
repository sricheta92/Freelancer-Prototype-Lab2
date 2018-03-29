var express = require('express');
var pool = require('./../pool');
var router = express.Router();

router.post('/withDetails', (req, res) => {

  var reqUserID = req.body.userID;
  var reqSkills = req.body.skills;
  pool.getConnection(function(err, connection){
  reqSkills.map((skill) => {
      connection.query("insert into skill_user (`userid`,`skillid`)  VALUES ("+
      "'"+ reqUserID +
      "', '" + skill +
      "');", function(err,results, fields){
        if(err) throw err;
        else res.status(200);

      });
    })

  });
});
router.get('/allSkills', (req, res) => {

  pool.getConnection(function(err, connection){

      connection.query("select skill_id ,skill_name from skill;", function(err,rows){
        connection.release();
        if(err) throw err;
        if(rows!=undefined && rows.length>0) {
          res.status(200).send({ skills: rows});
        }else{
          res.status(501).send({ skills: undefined});
        }
      });


  });
});
router.get('/allCategories', (req, res) => {
  pool.getConnection(function(err, connection){
    connection.query("select * from skill_category",  function(err, rows){
      connection.release();//release the connection
      if(err) throw err;
      if(rows!=undefined && rows.length>0) {

          res.status(200).send({ success:'true',allCategories: rows});
      }else{
          res.status(400).send({success: false});
      }
    });
  });
});

router.get('/skillsByCategory', (req, res) => {
   let arr=[]

  pool.getConnection(function(err, connection){
        connection.query("select category_id  from skill_category ",  function(err, rows){
            connection.release();//release the connection
              if(rows!=undefined && rows.length>0) {
                  rows.map((row,index) => {
                    var arr1=[];
                    connection.query("select  skill_id, skill_name from skill where skill_category= '" + row.category_id+ "';",  function(err, rows1){

                        rows1.map((row1) => {
                            arr1.push({id : row1.skill_id, name : row1.skill_name});
                         });
                         arr.push({category_id: row.category_id, skills : arr1});
                         if(index === rows.length-1){
                          if(err) throw err;
                          res.status(200).send({skillbyCategory: arr});
                        }
                    });
                });
              }
          });
      })
});

module.exports = router;
