$(function () {
    window.Action = {};
    Action.detail = function (id) {
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
    };

});
