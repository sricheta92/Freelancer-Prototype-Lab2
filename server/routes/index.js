var express = require('express');
var router = express.Router();
var pool = require('./../pool');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Freelancer' );
  pool.getConnection(function(err, connection){
      //run the query
        connection.query('select * from skill_category',  function(err, rows){
        connection.release();//release the connection
        if(err) throw err;
        else {
            console.log(rows);
          }
      });


      });
  });

function checkIfUserNameExists(username){

}

module.exports = router;
