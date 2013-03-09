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

var Url = require('url');
var User = require('../models/user.js'); // Save the user info of this website
var Post = require('../models/post.js'); // Save the content that the user posted
var _crypto = require('crypto');
var _tempInfoStack = {};
var _tempUserStack = {};

// for our template, only when user is null no user info will be shown,
// but here the variable we save the user info will be {} if no user info is supplied
function _utilIsEmptyObj(obj) {
    var key;

    for (key in obj) {
        return false;
    }

    return true;
}

// Only for this project to render, as the title, user, success and error
// are needed in the index.ejs template, so we make a function here to 
// make the render process simplier
function _render(templateName, req, res, title, moreParams) {
    var renderObj = {};
    var key;
    var _moreParams = moreParams || {};

    renderObj.title = title || '';
    renderObj.user = _utilIsEmptyObj(_tempUserStack) ? null : _tempUserStack;
    renderObj.success = _tempInfoStack.success;
    renderObj.error = _tempInfoStack.error;
    // After rendered, this temp info obj should be reset
    // or the error or success info will be shown in other pages
    _tempInfoStack = {}; 

    for (key in _moreParams) {
        renderObj[key] = _moreParams[key];   
    }

    res.render(templateName, renderObj);
}

function _renderUserPosts(req, res, username) {
    Post.get(username, function(err, posts) {
        if (err) {
            _tempInfoStack['error'] = err;
            return;
        }
        _render('user', req, res, username, {posts: posts});
    });
}

// Render the front page, when the user is not login, show some words to welcome the user
// if the user has logined in, show the name of the user in the header
exports.index = function(req, res){
    if (_tempUserStack.name) {
        _renderUserPosts(req, res, _tempUserStack.name);
    } else {
        _render('index', req, res, '首页', {posts: null});
    }
};

// Give the response when someon try to login, render the page here
exports.user = function(req, res) {
    User.get(_tempUserStack, function(err, user) {
        if (!user) {
            _tempInfoStack['error'] = '用户不存在';
            return res.redirect('/');
        }

        _renderUserPosts(req, res, _tempUserStack.name);
    });
};

// Save the posted url infomation from the user
exports.post = function(req, res) {
    var url = req.body.urlvalue;
    var response = req.body.response;
    var post = new Post(url, response, _tempUserStack.name);

    post.save(function(err, results) {
        if (err) {
            _tempInfoStack['error'] = err;
            return res.redirect('/');
        }

        _tempInfoStack['success'] = '提交成功';
        res.redirect('/');
    });
};

// render the reg page
exports.reg = function(req, res) {
    _render('reg', req, res, '用户注册');
};

// Check information when the user try to reg
// Only generate the account for the new users
exports.doReg = function(req, res) {
    // Check the password
    if (req.body['password-repeat'] != req.body['password']) {
        _tempInfoStack['error'] = '两次输入的密码不一致';
        return res.redirect('/reg');
    }
  
    // Generate the md5 passwd
    var md5 = _crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    var newUser = new User({
        name: req.body.username,
        password: password,
    });
    
    // Check whether the user is exist
    User.get(newUser.name, function(err, user) {
        if (user)
            err = '用户名已经存在';
        if (err) {
            _tempInfoStack['error'] = err;
            console.log(err);
            return res.redirect('/reg');
        }
        // Add one more account in database
        newUser.save(function(err) {
            if (err) {
                _tempInfoStack['error'] = err;
                return res.redirect('/reg');
            }
             _tempUserStack = newUser;
            _tempInfoStack['success'] = '注册成功';
            res.redirect('/');
        });
    });
};

// Render the login page
exports.login = function(req, res) {
    _render('login', req, res, '用户登陆');
};

// Check the user name and the passwd
exports.doLogin = function(req, res) {
    //生成口令的散列值
    var md5 = _crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    
    User.get(req.body.username, function(err, user) {
        if (!user) {
            _tempInfoStack['error'] = '用户不存在';
            return res.redirect('/login');
        }
        if (user.password != password) {
            _tempInfoStack['error'] = '密码错误';
            return res.redirect('/login');
        }
        _tempUserStack = user;
        _tempInfoStack['success'] = '登录成功';
        res.redirect('/');
    });
};

// Logout will be success always, redirect to index page
exports.logout = function(req, res) {
    _tempUserStack = {};
    _tempInfoStack['success'] = '登出成功';
    res.redirect('/');
};

// Response the delete row operation from the client side
// Here we remove that data from database
exports.operation = function(req, res) {
    var url = req.body.urlvalue;
    var operation = req.body.operation;

    if (operation && operation == "delete") {
        Post.removeWithUrl(url, function (err) {
            if (err) {
                console.log("Remove the url " + url + " with err: " + err);
                return;
            }
            console.log("Remove the url " + url + " success!");
            res.redirect('/');
        });
    }
};
