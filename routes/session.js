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

var u = require('underscore');
var _info = {};
var id = 1;

var _self = {
    init: function () {
        var sessionName = Math.floor(Math.random() * 2147483648).toString(36);
        _info[sessionName] = {};
        return sessionName;
    },

    get: function (sessionName) {
        return _info[sessionName] || {};
    },

    initUser: function (sessionName, userName, obj) {
        _info[sessionName] = {};
        _info[sessionName][userName] = obj ? obj : {};
    },

    getUser: function (sessionName) {
        return _info[sessionName]['user'] || {};
    },

    setUser: function (sessionName, obj) {
        _info[sessionName]['user'] = obj;
    },

    setInfo: function (sessionName, key, value) {
        _info[sessionName][key] = value;
    },

    getInfo: function (sessionName, key) {
        return _info[sessionName][key];
    }
};

u.extend(exports, _self);
