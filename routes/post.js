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

var Post = require('../models/post'); // Save the content that the user posted
var gConfig = require('./config');

var _self = {
    // Save the posted url infomation from the user
    write: function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var name = req.session.user ? req.session.user.name : null;
        var post = new Post(title, content, name);

        post.save(function(err, results) {
            if (err) {
                req.session.error = err;
                return res.redirect('/');
            }

            req.session.success = gConfig.post.postSuccess;
            res.redirect('/');
        });
    },

    // Response the delete row operation from the client side
    // Here we remove that data from database
    operation: function(req, res) {
        var title = req.body.urlvalue;
        var operation = req.body.operation;

        if (operation && operation == "delete") {
            Post.removeWithUrl(title, function (err) {
                if (err) {
                    console.log("Remove the record with title " + title + " has err: " + err);
                    return;
                }
                res.redirect('/');
            });
        }
    }
};

module.exports = _self;
