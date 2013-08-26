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

// Only for this project to render, as the title, user, success and error
// are needed in the index.ejs template, so we make a function here to
// make the render process simplier
function _render(templateName, req, res, title, moreParams) {
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

    renderObj.title = title || '';
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

var _self = {
    upload: function (req, res) {
        var user = req.session.user;
        if (user && user.name) {
            _render('./operation/fileupload', req, res, user.name, {});
        } else {
            _render('./home/index', req, res, gConfig.user.frontPageTitle, {posts: null});
        }
    },

    fileUpload: function (req, res) {
        console.log(req.body);
        console.log(req.files);

        var rootDir = "./public/pages/";
        // get the temporary location of the file
        var tmp_path = req.files.thumbnail.path;
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path = rootDir + req.files.thumbnail.name;
        var fs = require('fs');

        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) {
                req.session.error = err;
                return res.redirect('/');
            }
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function() {
                if (err) {
                    req.session.error = err;
                }

                req.session.success = gConfig.operation.fileUploadSuccess;
                return res.redirect('/');
                // res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
            });
        });
    }
};

module.exports = _self;
