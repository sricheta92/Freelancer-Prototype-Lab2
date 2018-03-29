 var mysql = require('mysql')


 // create database connection pool
 var pool  = mysql.createPool({
     host     : 'localhost',
     user     : 'root',
     password : 'Hello@123',
     database : 'freelancer'
 });


module.exports = pool;
