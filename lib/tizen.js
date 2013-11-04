module.exports = {
    initialize: function () {
        var db = require('db');

        db.saveObject("key", {
            id: "tizen",
            value: 100
        });

        console.log(db.retrieveObject("key").id);

        window.tizen = {
            module: {
                api: function () {
                    console.log("tizen simulator!");
                }
            }
        };
    }
};