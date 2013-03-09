var mongodb = require('./db');

function Post(url, response, username, time, userId) {
    this.url = url || '';
    this.response = response || '';
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

Post.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var post = {
		url: this.url,
		response: this.response,
        user: this.user,
		time: this.time,
        userId: Math.floor(Math.random() * 2147483648).toString(36)
	};

    try {
        mongodb.close();
    } catch(e) {
        console.log("Means that the db is not opened.");
    }

	mongodb.open(function(err, db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex('user');
			
			collection.insert(post, {safe: true}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback) {
    try {
        mongodb.close();
    } catch(e) {
        console.log("Means that the db is not opened.");
    }

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query, {limit:9}).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.url, doc.response, doc.username, doc.time);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};

Post.removeWithUrl = function (url, callback) {
    try {
        mongodb.close();
    } catch(e) {
        console.log("Means that the db is not opened.");
    }

	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

            collection.findAndRemove(
                {url: url}, // query
                [['time','asc']],  // sort order
                {safe: true}, // options
                function(err, object) {
                    console.log("Remvoe finish!");
                    console.log(object);
                    mongodb.close();
                    if (err){
                        console.warn(err.message);  // returns error if no matching object found
                        callback(err);
                    } else {
                        callback();
                    }
                }
            );
        });
    });
};

Post.getWithUrlAndUsername = function (urlvalue, name, callback) {
    try {
        mongodb.close();
    } catch(e) {
        console.log("Means that the db is not opened.");
    }

	mongodb.open(function(err, db) {
		if (err) {
            mongodb.close();
			return callback(err);
		}

		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			//find
			collection.findOne({url: urlvalue, user: name}, function(err, doc) {
                console.log('Find from database -->' + urlvalue + ' and user --> ' + name);
                for (var i in err) {
                    console.log(err[i]);
                }
                for (var i in doc) {
                    console.log(doc[i]);
                }
				mongodb.close();
				if (doc) {
					callback(err, doc.response);
				} else {
					callback(err, null);
				}
			});

            //mongodb.close();
		});
	});
};
