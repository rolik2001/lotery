// Example model
var db = require('orm').db;

var tickets = db.define('tickets', {
    id: String,
    session: String
}, {
    methods: {
        example: function() {
            // return example;
        }

    }
});
