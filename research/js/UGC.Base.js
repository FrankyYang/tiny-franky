UGC.Base = function (options) {
    this.dao = UGC.Dao;
    this.config = UGC.Config;
    this.options = $.extend(true, {
        $listContainer: $('#VideoListContainer')
    }, options);
};

UGC.Base.prototype = {
    run: function () {
        this.bindEvent();
    },

    bindEvent: function () {
        var self = this;
    },

    detail: function (id) {
        var details = {
            videoId: '91110086120',
            qipuId: '11910086912',
            videoTitle: '居家温馨小筑',
            description: '我的家的全貌，客厅、厨房、阳台、卧室',
            source: '帕帕奇',
            recommend: '强烈推荐',
            type: '高',
            category: '生活',
            labels: ['生活', '小屋', '温馨']
        };
        var detailDom = $('#TmplDetailTable').tmpl(details);
        $('#DetailDialog table tbody').html(detailDom);

        $('#DetailDialog').dialog({
            title : '节目详情',
            modal : true,
            width : 1200,
            height: 550,
            buttons : {
                '关闭' : function() {
                    $(this).dialog('close');
                }
            }
        });

        $('#PlayerContent').html('<iframe src="http://lego.iqiyi.com/video/preview?objectId=100009567&amp;type=0" class="custom-iframe" frameborder="0" scrolling="no"></iframe>');
    },

    push: function (id) {
        $('#PushDialog').dialog({
            title : '推送确认',
            modal : true,
            width : 400,
            buttons : {
                '确认' : function() {
                    // $(this).dialog('close');
                },
                '取消' : function() {
                    $(this).dialog('close');
                }
            }
        });
    },

    batch: function () {
        var $liDomList = $('#GridContainer li');
        var batchList = [];
        var batchDom;

        $liDomList.each(function (index, li) {
            var $dom = $(li);
            if ($dom.find('.item-select')[0].checked) {
                batchList.push($dom.attr('data-id'));
            }
        });

        if (batchList.length == 0) return;

        batchDom = $('#TmplBatchList').tmpl(batchList);
        $('#BatchDialog table tbody').html(batchDom);

        $('#BatchDialog').dialog({
            title : '批量推送',
            modal : true,
            width : 800,
            buttons : {
                '提交' : function() {
                    // $(this).dialog('close');
                },
                '取消' : function() {
                    $(this).dialog('close');
                }
            }
        });
    },

    process: function () {
        $('#ProcessDialog').dialog({
            title : '查看推送进度',
            modal : true,
            width : 1200,
            buttons : {
                '提交' : function() {
                    // $(this).dialog('close');
                },
                '取消' : function() {
                    $(this).dialog('close');
                }
            }
        });
    },

    control: function () {
        var controlHistory = [{
            operationTime: '2013-07-23 13:44:13',
            operation: '设视频“无效”',
            operationContent: '含有违禁内容',
            operator: 'yangfan@qiyi.com'
        }, {
            operationTime: '2013-07-23 13:44:13',
            operation: '设视频“有效”',
            operationContent: '重新上线',
            operator: 'yangfan@qiyi.com'
        }, {
            operationTime: '2013-07-23 13:44:13',
            operation: '设视频“无效”',
            operationContent: '含有违禁内容',
            operator: 'yangfan@qiyi.com'
        }, {
            operationTime: '2013-07-23 13:44:13',
            operation: '设视频“有效”',
            operationContent: '重新上线',
            operator: 'yangfan@qiyi.com'
        }];
        var controlHistoryDom = $('#TmplControlHistory').tmpl(controlHistory);
        $('#ControlDialog table tbody').html(controlHistoryDom);

        $('#ControlDialog').dialog({
            title : '视频播放控制',
            modal : true,
            width : 900,
            buttons : {
                '提交' : function() {
                    // $(this).dialog('close');
                },
                '取消' : function() {
                    $(this).dialog('close');
                }
            }
        });

        this.dao.load
    }
};
