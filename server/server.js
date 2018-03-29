var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
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
app.use(cors());
app.use(passport.initialize());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/signup', signup);
app.use('/login', login);
app.use('/skill', skill);
app.use('/project',project);
app.use('/user',user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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
app.set('secret', 'CMPE272_freelancer');
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
