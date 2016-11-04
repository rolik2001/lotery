//var -package-

var express = require('express');
var exphbs = require('express-handlebars');
// var authentication = rbasic = require('express-authentication');
// var authentication = rbasic = require('express-authentication-basic');
var app = express();
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var users = [{
    username: 'mykolat',
    password: "583460"
}, {
    username: 'roman',
    password: "FBI"
}, {
    username: 'daniel',
    password: "123d"
}];
//static
app.use(express.static('images'));
//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//viewengine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(expressValidator());
app.use(expressSession({
    secret: 'orest',
    saveUninitialized: false,
    resave: false
}));

app.get('/', function(req, res) {
    res.render('home', {
        title: 'Form Validation',
        success: false,
        errors: req.session.errors
    });
    req.session.errors = null;
});

app.post('/login', function(req, res, next) {
    console.log(req.body)
  });
    app.post('/register', function(req, res, next) {
      });

    //Lookup for username
    //Compare password
    let user = users.filter(function(obj) {
        return obj.username == req.body.username;
    });
    console.log(user);
    if (user.length > 0 && req.body.password == user[0].password) {
        console.log("pass ok");
        res.sendStatus(200);
    } else {
        res.sendStatus(403)
    }
});
app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});
