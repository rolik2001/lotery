// Example model
var db = require('orm').db;

var users = db.define('users', {
    id: String,
    login: String,
    password: String,
    email: String,
    balance:String,
    tickets:String
}, {
    methods: {
        example: function() {
            // return example;
        },
        serialize: function() {
            return this;
        }
    }
});
