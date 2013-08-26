var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.password = user.password;
};

module.exports = User;

User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
    };

    mongodb.util.insert('users', user, {unique: 'name'}, callback);
};

User.get = function (username, callback) {
    mongodb.util.get('users', {name: username}, callback);
};
