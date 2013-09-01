UGC.Dao = (function () {
    var getDetailDialog = function (data, $container, callback) {
        var url = 'content/ugcVideo/detail';
        $container.load(url, data, callback);
    };

    var getPushDialog = function (data, $container, callback) {
        var url = 'ugcVideo/pushHome';
        $container.load(url, data, callback);
    };

    var getBatchDialog = function (data, $container, callback) {
        var url = 'ugcVideo/batchPushHome';
        $container.load(url, data, callback);
    };

    var getControlDialog = function (data, $container, callback) {
        var url = 'ugcVideo/playControlHome';
        $container.load(url, data, callback);
    };

    var getImageList = function (data, callback) {
        var videoListData = [{
            id: '1',
            source: 'PPS',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '123:32',
            id: '91110086119',
            title: '超萌的宝宝好好睡个觉',
            canPush: true,
            canPlay: true
        }, {
            source: '爱奇艺',
            type: '超清',
            recommend: '墙裂推荐',
            time: '2013-09-02',
            transcode: '转码中',
            audit: '审核通过',
            publish: "发布完成",
            duration: '13:32',
            id: '91110086120',
            title: '可爱姑娘人见人爱',
            canPush: true,
            canPlay: true
        }, {
            source: '帕帕奇',
            type: '高清',
            recommend: '一般推荐',
            time: '2013-09-03',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "未发布",
            duration: '07:32',
            id: '91110086121',
            title: '同学正少年，往日已如烟',
            canPush: true,
            canPlay: true
        }, {
            source: 'PPS',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '123:32',
            id: '91110086122',
            title: '当爱已成往事，当年华已不再',
            canPush: true,
            canPlay: true
        }, {
            source: '百度网盘',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '06:32',
            id: '91110086123',
            title: '坑爹的小伙伴们',
            canPush: true,
            canPlay: true
        }, {
            source: 'PPS',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '05:32',
            id: '91110086124',
            title: '中华精武英雄',
            canPush: true,
            canPlay: true
        }, {
            source: '百度贴吧',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '04:32',
            id: '91110086125',
            title: '前方火车正呼啸而来',
            canPush: true,
            canPlay: true
        }, {
            source: '赶集网',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '02:32',
            id: '91110086126',
            title: '3分钟内让你永世难忘的极品',
            canPush: true,
            canPlay: true
        }, {
            source: 'PPS',
            type: '高清',
            recommend: '墙裂推荐',
            time: '2013-09-01',
            transcode: '转码完成',
            audit: '审核通过',
            publish: "发布完成",
            duration: '02:32',
            id: '91110086127',
            title: '姑娘，你的鞋掉了',
            canPush: true,
            canPlay: true
        }];

        return callback(videoListData);

        // TODO: replace with the code here
        $.ajax({
            url: 'ugcVideo/xx',
            type: 'GET',
            data: data,
            dataType: 'json',
            success: function () {
                callback.call(this, data);
            },
            error: function () {
                callback.call(this, data);
            }
        });
    };

    var push = function (data, callback) {
        $.ajax({
            url: 'ugcVideo/push',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function () {
                callback.call(this, data);
            },
            error: function () {
                callback.call(this, data);
            }
        });
    };

    var batch = function (data, callback) {
        $.ajax({
            url: 'ugcVideo/batchPush',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function () {
                callback.call(this, data);
            },
            error: function () {
                callback.call(this, data);
            }
        });
    };

    var control = function (data, callback) {
        $.ajax({
            url: 'ugcVideo/playControl',
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function () {
                callback.call(this, data);
            },
            error: function () {
                callback.call(this, data);
            }
        });
    };

    return {
        getDetailDialog: getDetailDialog,
        getImageList: getImageList,
        push: push,
        batch: batch,
        control: control
    };
})();
