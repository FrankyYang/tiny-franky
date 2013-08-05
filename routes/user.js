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

// Util function for password check
function _checkPasswd (passwd, passwdRepeat) {
    if (passwd != passwdRepeat) {
        req.session.error = gConfig.user.twoCodeNotTheSame;
        return false;
    }

    return true;
}

// Util function for password generate
function _getPasswd(password) {
    var md5 = uCrypto.createHash('md5');
    return md5.update(password).digest('base64');
}

function _renderUserPosts(req, res, username) {
    Post.get(username, function(err, posts) {
        if (err) {
            req.session.error = err;
            return;
        }
        _render('./user/user', req, res, username, {posts: posts});
    });
}

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
    // Render the front page, if user is not login, show welcome worlds,
    // if the user has logined in, show the name of the user in the header
    index: function (req, res) {
        var user = req.session.user;
        if (user && user.name) {
            _renderUserPosts(req, res, user.name);
        } else {
            _render('./home/index', req, res, gConfig.user.frontPageTitle, {posts: null});
        }
    },

    // Give the response when someon try to login, render the page here
    user: function(req, res) {
        User.get(user, function(err, user) {
            if (!user) { // In the user model, if no user got, user here will be null
                req.session.error = gConfig.user.userNotExist;
                return res.redirect('/');
            }

            _renderUserPosts(req, res, user.name);
        });
    },

    // Render the login page
    login: function(req, res) {
        _render('./user/login', req, res, gConfig.user.loginTitle);
    },

    // Render the reg page
    reg: function(req, res) {
        _render('./user/reg', req, res, gConfig.user.regTitle);
    },

    // Check the user name and the passwd, if pass, redirect
    // to the index page and show the login success info
    doLogin: function(req, res) {
        // Generate the passwd with md5 util function
        // Compare the pass in password with that in database
        var password = _getPasswd(req.body.password);

        User.get(req.body.username, function(err, user) {
            // If check not pass, redirect to the login page
            // TODO: Do this in front end, no redirect, just check result
            if (!user) {
                req.session.error = gConfig.user.userNotExist;
                return res.redirect('/login');
            }

            if (user.password != password) {
                req.session.error = gConfig.user.passwdError;
                return res.redirect('/login');
            }

            req.session.user = user;
            req.session.success = gConfig.user.loginSuccess;
            return res.redirect('/');
        });
    },

    // Check information when the user try to reg
    // Only generate the account for the new users
    doReg: function(req, res) {
        if (!_checkPasswd(req.body['password'], req.body['password-repeat'])) {
            return res.redirect('/reg');
        }

        // Generate the md5 passwd to save it
        var password = _getPasswd(req.body.password);

        var newUser = new User({
            name: req.body.username,
            password: password,
        });

        // Check whether the user is exist
        User.get(newUser.name, function(err, user) {
            if (user) {
                req.session.error = gConfig.user.userAlreadyExit;
                return res.redirect('/reg');
            }

            // Add one more account in database
            newUser.save(function(err) {
                if (err) {
                    req.session.error = err;
                    return res.redirect('/reg');
                }

                req.session.user = newUser;
                req.session.success = gConfig.user.regSuccess;
                res.redirect('/');
            });
        });
    },

    // Logout will be success always, redirect to index page
    logout: function(req, res) {
        req.session.user = null;
        req.session.success = gConfig.user.logoutSuccess;
        res.redirect('/');
    }
};

module.exports = _self;
