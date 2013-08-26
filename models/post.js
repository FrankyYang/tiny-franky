var mongodb = require('./db');

function Post(title, content, username, time, userId) {
    this.title = title || '';
    this.content = content || '';
    this.user = username || '';

    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }

    if (userId) {
        this.userId = _data.userId;
    } else {
        this.userId = Math.floor(Math.random() * 2147483648).toString(36);
    }
};
module.exports = Post;

Post.prototype.save = function (callback) {
    var post = {
        title: this.title,
        content: this.content,

        user: this.user,
        time: this.time,
        userId: Math.floor(Math.random() * 2147483648).toString(36)
    };

    mongodb.util.insert('posts', post, {unique: 'title'}, callback);
};

Post.prototype.update = function (query, callback) {
    var post = {
        title: this.title,
        content: this.content,

        user: this.user,
        time: this.time,
        userId: Math.floor(Math.random() * 2147483648).toString(36)
    };

    mongodb.util.update('posts', query, post, callback);
};

Post.get = function (username, callback) {
    var query = {};

    if (username) {
        query.user = username;
    }

    mongodb.util.getAll('posts', query, function (err, list) {
        var posts = [];
        list.forEach(function(item, index) {
            var post = new Post(item.title, item.content, item.username, item.time);
            posts.push(post);
        });

        callback(null, posts);
    });
};

Post.removeWithUrl = function (title, callback) {
    mongodb.util.del('posts', {title: title}, callback);
};

Post.getWithUrlAndUsername = function (urlvalue, name, callback) {
    mongodb.util.get('posts', {url: urlvalue, user: name}, function (err, result) {
        if (!err) {
            callback(result.content);
        }
    });
};
