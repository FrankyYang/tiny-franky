var mongodb = require('./db');

var Post = function (name, lastEditTime, username, time, userId) {
    this.name = name || '';
    this.lastEditTime = lastEditTime || '';
    this.user = username || '';

    this.time = time ? time : new Date();
    this.userId = userId ? userId : Math.floor(Math.random() * 2147483648).toString(36);
};

var _createPostObj = function () {
    return {
        name: this.name,
        lastEditTime: this.lastEditTime,

        user: this.user,
        time: this.time,
        userId: Math.floor(Math.random() * 2147483648).toString(36)
    };
};

var _self = {
    save: function (callback) {
        var post = _createPostObj.call(this);
        mongodb.util.insert('posts', post, {unique: 'title'}, callback);
    },

    update: function (query, callback) {
        var post = _createPostObj.call(this);
        mongodb.util.update('posts', query, post, callback);
    },

    get: function (username, callback) {
        var query = {};

        if (username) {
            query.user = username;
        }

        mongodb.util.getAll('posts', query, function (err, list) {
            var posts = [];
            list.forEach(function(item, index) {
                var post = new Post(item.name, item.lastEditTime, item.username, item.time);
                posts.push(post);
            });

            callback(null, posts);
        });
    },

    removeWithUrl: function (name, callback) {
        mongodb.util.del('posts', {name: name}, callback);
    }
};

Post.prototype.save = _self.save;
Post.prototype.update = _self.update;
Post.get = _self.get;
Post.removeWithUrl = _self.removeWithUrl;

module.exports = Post;
