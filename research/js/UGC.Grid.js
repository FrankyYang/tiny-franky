/**
 * Copyright 2013 Qiyi Inc. All rights reserved.
 *
 * @file:   UGC.Grid.js
 * @path:   js-src/ugc/
 * @desc:   UGC模块下表格对象类
 * @author: franky.z.yang@gmail.com
 * @date:   2013-09-01
 */

///import js-src/lib/
///import js-src/com/

UGC.Grid = function (options) {
    this.dao = UGC.Dao;

    this.options = $.extend(true, {}, options);

    this.$grid = this.options.$container.find('ul');

    this.bindEvent();
}

UGC.Grid.prototype = {
    run: function (options, callback) {
        this._initGrid.call(this, options, callback);
    },

    bindEvent: function () {},

    getGrid: function () {
        return this.$grid;
    },

    getRowDataById: function ($grid, id) {
    },

    reload: function(type, isAsec) {
        // type: 1, 时间； 2， 片源清晰度； 3， 推荐等级
        this.dao.getImageList({}, function (videoListData) {
            var generatedDom = $('#TmplSeprate').tmpl(videoListData);
            $('.image-list ul').append(generatedDom);
        });
    },

    _initGrid: function(options,callback) {
        this.dao.getImageList({}, function (videoListData) {
            var generatedDom = $('#TmplSeprate').tmpl(videoListData);
            $('.image-list ul').append(generatedDom);
        });
    }
};
