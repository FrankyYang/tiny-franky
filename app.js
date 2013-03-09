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

var express = require('express');
var http = require('http');
var routes = require('./routes');
var settings = require('./settings');
var Api = require('./models/post.js');
var MongoStore = require('connect-mongo')(express);
var partials = require('express-partials');
var app = express();
var sessionStore = new MongoStore({
        db : settings.db
    }, function() {
        console.log('connect mongodb success...');
    });

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    // make the code that base on express2.0 compatible with current 3.0 version
    app.use(partials());
    app.use(express.favicon(__dirname + '/public/images/icon.png'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.session({
        secret : settings.cookie_secret,
        cookie : {
            maxAge : 60000 * 20    //cookie expire time: 20 minutes
        },
        store : sessionStore
    }));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// The main filter that will filt out the simulated api request with normal website access
app.all('*', function (req, res, next) {
    // The most simple way of a filter is listing the results that you plan to ignore, here are they,
    // I ignore them just because the normal website access will use them to login/logout or others
    // TODO: remove the key words that won't be used currently
    var routesEscape = ['stylesheets', 'javascripts', 'operation', 'login$', 'logout$', 'post$', 'reg$', 'u/', '/'];
    var url = req.url;
    var result = false;
    var currentUser;

    if (url[0] && url[0] == '/') {
        url = url.slice(1);
    }
    if (url == null || url == '') {
        next();
        return;
    }

    // If the program runs into 'next', the normal website access will be processed in other functionalities
    // I use 'some' here just for the control of the loop from the inner function, 
    // as I return true, the loop will stop, that's what I want
    result = routesEscape.some(function (item) {
        if (url.match(new RegExp(item))) {
            next();
            return true;
        }
    });

    if (!result && req.session && req.session.user) {
        currentUser = req.session && req.session.user ? req.session.user.name : '';
        Api.getWithUrlAndUsername(url, currentUser.name, function(err, responseData) {
            if (err) {
                console.log('Error occur --> ' + err);
                return;
            }

            if (!responseData) {
                next();
            } else {
                res.send(responseData);
            }
        });
    }
});

app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.post('/operation', routes.operation);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
