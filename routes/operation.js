/*
 *  Copyright 2013 Yang Fan (personal).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var uCrypto = require('crypto');

var User = require('../models/user'); // Save the user info of this website
var Post = require('../models/post'); // Save the content that the user posted
var gConfig = require('./config');

var _render = function (templateName, req, res, name, moreParams) {
    var renderObj = {};
    var key;
    var isEmptyObj = function (obj) {
        var key;

        for (key in obj) {
            return false;
        }

        return true;
    }
    var _moreParams = moreParams || {};
    var user = req.session.user;

    renderObj.name = name || '';
    renderObj.user = isEmptyObj(user) ? null : user;
    renderObj.success = req.session.success;
    renderObj.error = req.session.error;

    // Reset the global success and error info
    req.session.success = '';
    req.session.error = '';

    for (key in _moreParams) {
        renderObj[key] = _moreParams[key];
    }

    res.render(templateName, renderObj);
}

var _writeLog = function (name, time, userName, isUpdate, callback) {
    var post = new Post(name, time, userName);
    
    if (isUpdate) {
        post.update({name: name}, callback);
    } else {
        post.save(callback);
    }
};

var _getLog = function () {
};

var _self = {

    // Response the delete row operation from the client side
    // Here we remove that data from database
    operation: function(req, res) {
        var filePath = req.body.urlvalue;
        var operation = req.body.operation;
        var fs = require('fs');

        if (operation && operation == "delete") {
            // delete the temporary file
            fs.unlink(filePath, function(err) {
                if (err) {
                    console.log(err);
                    req.session.error = err;
                    return;
                }

                Post.removeWithUrl(filePath, function (err) {
                    if (err) {
                        console.log("Remove file " + filePath + "has err: " + err);
                        return;
                    }
                    res.redirect('/');
                });

                return res.redirect('/');
            });
            
        }
    },

    upload: function (req, res) {
        var user = req.session.user;
        if (user && user.name) {
            _render('./operation/fileupload', req, res, user.name, {});
        } else {
            _render('./home/index', req, res, gConfig.user.frontPageTitle, {posts: null});
        }
    },

    fileUpload: function (req, res) {
        console.log(req.files);

        // var rootDir = dir || "./public/pages/";
        var rootDir = "./public/pages/";
        var tempPath = req.files.thumbnail.path; // thumbnail is defined in frontend
        var targetPath = rootDir + req.files.thumbnail.name;
        var fs = require('fs');

        // move the file from the temporary location to the intended location
        fs.rename(tempPath, targetPath, function(err) {
            if (err) {
                console.log('Renmae error!');
                console.log(err);
                req.session.error = err;
                return res.redirect('/');
            }

            // delete the temporary file
            fs.unlink(tempPath, function(err) {
                var time = new Date();

                if (err) {
                    console.log(err);
                    req.session.error = err;
                }

                // Record the file upload info
                _writeLog(targetPath, time, req.session.user.name, false, function (err) {
                    if (err) {
                        req.session.error = err;
                        return res.redirect('/');
                    }

                    req.session.success = gConfig.post.postSuccess;
                    res.redirect('/');
                });

                req.session.success = gConfig.operation.fileUploadSuccess;
                return res.redirect('/');
            });
        });
    }
};

module.exports = _self;
