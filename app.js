var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var io = require('socket.io').listen(83);
//
// //socket.io
// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
//session Mysql
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'lotery',
    checkExpirationInterval: 900000,
    expiration: 86400000,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: String,
            expires: String,
            data: String
        }
    }
};



var app = express(),
    orm = require('orm'),
    fs = require('fs');

orm.db = orm.connect("mysql://root@localhost/lotery", function(err, db) {
    // console.log(db);
    if (err) {
        console.log("Something is wrong with the connection", err);
        return;
    } else {
        console.log("connection to db is ok")
    }
});

var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function(file) {
    if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore(options),
    cookie:{maxAge:1000000},
    resave: true,
    saveUninitialized: true
}));


var routes = require('./routes/index');

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.send(err.status || 500);
        // res.render('error', {
        //   message: err.message,
        //   error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});


module.exports = app;
