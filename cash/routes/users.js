var express = require('express');
var router = express.Router();
var db = require('orm').db;
var login = db.models.users;

/* GET login listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, login){
    if(err) throw new Error(err);
    res.json(users)
    /*res.render('home/index', {
      title: 'Generator-Express MVC',
      login: login
    });*/
  });
});

module.exports = router;
