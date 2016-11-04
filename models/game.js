// Example model
var db = require('orm').db;

var game = db.define('game', {
    id: String,
    start:String
}, {
    methods: {
        example: function() {
            // return example;
        }

    }
});
