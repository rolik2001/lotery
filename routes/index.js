var express = require('express');
var router = express.Router();
var db = require('orm').db;
var User = db.models.users;
var Ticket = db.models.tickets;
var Game = db.models.game;
var _ = require('lodash');


//socket.io
var io = require('socket.io');
var io = io.listen(80);


io.sockets.on('connection', function (socket) {
	socket.on('eventServer', function (data) {
		console.log(data);
		socket.emit('eventClient', { data: 'Hello Client' });
	});
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', {
        layout: 'layouts/other'
    });
});
router.get('/cabinet', function(req, res, next) {
    User.find({
        login: req.session.user.login
    }, function(eror, users) {
        req.session.user = users[0];
        var user = req.session.user;
        if (user) {
            Ticket.count({
                session: req.session.user.id
            }, function(err, count) {
                res.render('cabinet', {
                    login: user.login,
                    id: user.id,
                    email: user.email,
                    balance: user.balance,
                    tickets: count
                });


            });
        }
    });
});

router.post('/login', function(req, res, next) {
    User.find({
        login: req.body.login
    }, function(err, users) {
        if (users.length == 0) {
            res.send('Invalid username or password');
        } else {
            if (users[0].password == req.body.password) {
                req.session.user = users[0];
                res.redirect('/cabinet');
            } else {
                res.send('Invalid username or password');
            }
        }
    });
});
router.post('/sign', function(req, res, next) {
    res.render('sign');
});
router.post('/register', function(req, res, next) {
    if (req.body.email.length == 0) {
        res.send("Please write email!");
    } else {
        if (req.body.login.length == 0) {
            res.send("Please write login!");
        } else {
            if (req.body.password.length == 0) {
                res.send("Please write password!");
            } else {
                if (req.body.password == req.body.password2) {
                    // var user = _.pick(req.body, 'login', 'password', 'email');
                    User.create({
                        login: req.body.login,
                        password: req.body.password,
                        email: req.body.email,
                        balance: "100",
                    }, function(err, users) {
                        if (err) {
                            res.send("Email or login is register in system!")
                        } else {
                            req.session.user = users[0];
                            res.redirect('/cabinet');
                        }
                    });

                } else {
                    res.send("Password is not match")
                }
            }
        }
    }
});
router.post('/games', function(req, res, next) {
    res.render('games')
});

router.get('/games', function(req, res, next) {
    res.render('games');
    console.log(data);
   socket.broadcast.to('room').emit('eventClient', {data:'Hello Client'});
});



router.post('/play', function(req, res, next) {
    User.get(req.session.user.id, function(error, user) {
        if (!error && user.balance >= (req.body.bets * 10)) {
            user.balance = parseInt(user.balance) - (req.body.bets * 10);
            req.session.user.balance = user.balance;
            user.save(function(err) {
                for (var i = 0; i < req.body.bets; i++) {
                    Ticket.create({
                        session: req.session.user.id
                    }, function(eror, tick) {
                        if (eror) {
                            res.send(eror);
                        }
                    });
                }
                res.redirect('/games')
            });
        } else {
            res.send("You dont have money")
        }
    });
});
router.get('/lol', function(req, res, next) {
    if (req.session.user.login == "rolik") {
        Ticket.count({}, function(err, count) {
            res.render('lol', {
                tickets: count
            });
        });
    } else {
        res.send(404);
    }
});
router.post('/lol', function(req, res, next) {
    Ticket.find({}, function(error, tickets) {
        if (tickets.length == 0) {
            res.send("sorry");
        } else {
            var random = Math.floor(Math.random() * tickets.length + 0);
            var winner = tickets[random];
            User.find({
                    id: winner.session
                },
                function(errr, users) {
                    users[0].balance = parseInt(users[0].balance) + (tickets.length * 10);
                    req.session.user.balance = users[0].balance;
                    users[0].save(function(er) {
                        res.render('games');
                    });
                });
            Ticket.find({}).remove(function(err) {
                console.log("Yes");
            });
        }
    });
});
module.exports = router;





//             Ticket.find({}, function(error, tickets) {
//                 var random = Math.floor(Math.random() * tickets.length + 0);
//                 var winner = tickets[random];
//                 User.find({
//                         id: winner.session
//                     },
//                     function(errr, users) {
//                         users[0].balance = parseInt(users[0].balance) + (tickets.length * 10);
//                         req.session.user.balance = users[0].balance;
//                         users[0].save(function(er) {


// res.render('games', {
//     number: 2,
//     user: fuck,
//     id:20
// });
//                         });
//                     });
//                 Ticket.find({}).remove(function(err) {
//                     console.log("Yes");
//                 });
//             });
//
