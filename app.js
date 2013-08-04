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
var MongoStore = require('connect-mongo')(express);
var SessionStore = require("session-mongoose")(express);
var partials = require('express-partials');

var routes = require('./routes');
var userRoutes = require('./routes/user');
var postRoutes = require('./routes/post');

var settings = require('./settings');

var app = express();
var sessionStore = new MongoStore({
    db : settings.db
}, function() {
    console.log('connect mongodb success...');
});
var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000
});

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use(partials());
    app.use(express.favicon(__dirname + '/public/images/icon.png'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public'));
    // connect/session
    app.use(express.cookieSession({
        secret : settings.cookie_secret,
        cookie : {
            maxAge : 60000 * 20    //cookie expire time: 20 minutes
        },
        store : store
    }));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});


app.get('/', userRoutes.index);
app.get('/u/:user', userRoutes.user);
app.get('/reg', userRoutes.reg);
app.post('/reg', userRoutes.doReg);
app.get('/login', userRoutes.login);
app.post('/login', userRoutes.doLogin);
app.get('/logout', userRoutes.logout);

app.post('/post', postRoutes.write);
app.post('/operation', postRoutes.operation); 

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
