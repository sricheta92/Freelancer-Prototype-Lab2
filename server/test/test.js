var assert = require('assert');
var app = require('../server');
var request = require('supertest');
var assert = require('chai').assert;
var token='';
var email=Math.random()+'@gmail.com';
var username = Math.floor(Math.random()*1000000);

//Test case- 0 - signup
it('Test case 0 - should respond with success flag on', function(done) {
    request(app)
      .post('/signup')
      .send({"email":email,
    	  "password":"admin",
    	  "username":username,
    	  "role":"Worker"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
          if (err) done(err);
          assert.equal(res.body.success, true);
          done();
      });
 });

//Test case- 1 - login
it('Test case 1 - should respond with success flag on', function(done) {
    request(app)
      .post('/login')
      .send({"useroremail":email,
        "password":"admin"})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
            if (err) done(err);
            assert.equal(res.body.success, true);
            done();
      });
 });

 //Test case- 1 - signup
 it('Test case 2 - should respond with success flag on', function(done) {
     request(app)
       .post('/signup/checkEmail')
       .send({"email":email+"1" })
       .expect(200)
       .expect('Content-Type', /json/)
       .end(function(err, res) {
             if (err) done(err);
             assert.equal(res.body.success, true);
             done();
       });
  });

  //Test case- 3 - signup
  it('Test case 3 - should respond with success flag on', function(done) {
      request(app)
        .post('/signup/checkUser')
        .send({"username":username+"1" })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
              if (err) done(err);
              assert.equal(res.body.success, true);
              done();
        });
   });

   //Test case- 4 - signup
   it('Test case 4 - should respond with success flag on', function(done) {
       request(app)
         .post('/signup/checkUser')
         .send({"username":username+"1" })
         .expect(200)
         .expect('Content-Type', /json/)
         .end(function(err, res) {
               if (err) done(err);
               assert.equal(res.body.success, true);
               done();
         });
    });


       //Test case- 4 - signup
       it('Test case 5 - should respond with success flag on', function(done) {
           request(app)
             .get('/skill/allSkills')
             .expect(200)
             .expect('Content-Type', /json/)
             .end(function(err, res) {
                   if (err) done(err);
                   assert(res.body.skills);
                   done();
             });
        });
