var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection =  require('mongodb').Connection;
var Server = require('mongodb').Server;

var _self = new Db(settings.db, new Server(settings.host, settings.port, {
	auto_reconnect : true,
    safe: false
}));

_self.util = {
    insert: function (collectionName, obj, options, callback) {
        try {
            _self.open(function(err, db) {
                if (err) {
                    console.warn('Error while opening database, with collection ' + collectionName);
                  return callback(err);
                }

                db.collection(collectionName, function(err, collection) {
                    if (err) {
                        _self.close();
                        console.warn('Error while opening collection, with collection ' + collectionName);
                        return callback(err);
                    }

                    if (options.unique) {
                        collection.ensureIndex(options.unique, {unique: true});
                    }

                    collection.insert(obj, {safe: true}, function(err, savedObj) {
                        _self.close();

                        if (err) {
                            console.warn('Error while inserting into collection, with collection ' + collectionName);
                            console.warn(err);
                        }

                        callback(err, savedObj);
                    });
                });
            });
        } catch (e) {
            _self.close();
            callback('Database error!');
        }
    },

    update: function (collectionName, query, obj, callback) {
        try {
            _self.open(function(err, db) {
                if (err) {
                    console.warn('Error while opening database, with collection ' + collectionName);
                    return callback(err);
                }

                db.collection(collectionName, function(err, collection) {
                    if (err) {
                        _self.close();
                        console.warn('Error while opening collection, with collection ' + collectionName);
                        return callback(err);
                    }

                    collection.update(query, obj, {upsert: true}, function(err, num) {
                        _self.close();

                        if (err) {
                            console.warn('Error while updating the collection, with collection ' + collectionName);
                            console.warn(err);
                        }

                        callback(err);
                    });
                });
            });
        } catch (e) {
            _self.close();
            callback('Database error!');
        }

    },

    get: function (collectionName, searchObj, callback) {
        try {
            _self.open(function(err, db) {
                if (err) {
                    console.warn('Error while opening database, with collection ' + collectionName);
                  return callback(err);
                }
                db.collection(collectionName, function(err, collection) {
                    if (err) {
                        _self.close();
                        console.warn('Error while opening collection, with collection ' + collectionName);
                        return callback(err);
                    }

                    collection.findOne(searchObj, function(err, searchResultObj) {
                        _self.close();
                        if (searchResultObj) {
                            callback(err, searchResultObj);
                        } else {
                            console.warn('Error while getting collection, with collection ' + collectionName);
                            callback(err, null);
                        }
                    });
                });
            });
        } catch (e) {
            _self.close();
            callback('Database error!');
        }
    },

    getAll: function (collectionName, searchObj, callback) {
        try {
            _self.open(function(err, db) {
                if (err) {
                    console.warn('Error while opening database, with collection ' + collectionName);
                  return callback(err);
                }
                db.collection(collectionName, function(err, collection) {
                    if (err) {
                        _self.close();
                        console.warn('Error while opening collection, with collection ' + collectionName);
                        return callback(err);
                    }

                    collection.find(searchObj, {limit:9}).sort({time: -1}).toArray(function(err, searchResultList) {
                        _self.close();

                        if (searchResultList) {
                            callback(err, searchResultList);
                        } else {
                            console.warn('Error while getAll operation, with collection ' + collectionName);
                            callback(err, null);
                        }
                    });
                });
            });
        } catch (e) {
            _self.close();
            callback('Database error!');
        }
    },

    del: function (collectionName, searchObj, callback) {
        try {
            _self.open(function(err, db) {
                if (err) {
                    console.warn('Error while open database, with collection ' + collectionName);
                  return callback(err);
                }
                db.collection(collectionName, function(err, collection) {
                    if (err) {
                        _self.close();
                        console.warn('Error while open collection, with collection ' + collectionName);
                        return callback(err);
                    }

                    collection.findAndRemove(searchObj, [['time','asc']], {safe: true}, function (err, obj) {
                        _self.close();

                        if (err) {
                            console.warn('Error while deling operation, with collection ' + collectionName);
                            callback(err);
                        } else {
                            callback();
                        }
                    });
                });
            });
        } catch (e) {
            _self.close();
            callback('Database error!');
        }
    }
};

module.exports = _self;
