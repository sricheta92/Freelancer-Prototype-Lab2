var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressSessions = require("express-session")
var mongoStore = require("connect-mongo")(expressSessions);
var passport = require('passport');
var index = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var skill = require('./routes/skill');
var project = require('./routes/project');
var user = require('./routes/user');

var app = express();
const port = process.env.PORT || 5000;
//Enable CORS
var corsOptions = {
    origin: 'http://ec2-13-57-249-255.us-west-1.compute.amazonaws.com:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors(corsOptions))
app.use(cookieParser('CMPE273_passport'));


//var mongoSessionURL = "mongodb://localhost:27017/freelancer";
var mongoSessionURL = "mongodb://admin:admin@ds143099.mlab.com:43099/freelancersri";
app.use(expressSessions({
  secret: "CMPE273_passport",
  resave: false,
  saveUninitialized: true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 6 * 1000,
  store: new mongoStore({
    url: mongoSessionURL,
    collection: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/skill', skill);
app.use('/project',project);
app.use('/user',user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    res.header('Access-Control-Allow-Credentials', true);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});
app.set('secret', 'CMPE273_passport');
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
