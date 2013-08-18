// Code mirror config
CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.hint.html);
}

$(function () {
    var $tip = $('#ToolTip');
    var $editor = $('#WidgetEditor');
    var currentWidgetTag;
    var showFlag = true;
    var currentWidgetId;

    var SPACE_WIDTH = 50;
    var SPACE_HEIGHT = 20;

    var updateDataList = function (id) {
        var dataListHtmlStr = '';
        var localData = window.localStorage[currentWidgetId];
        var dataList = localData ? JSON.parse(localData) : [];

        if (localData) {
            $.each(dataList, function (key, value) {
                dataListHtmlStr += '<tr><td>' + decodeURI(value['description']) + '</td><td>'
                                   + value['dataSource'] + '</td><td>'
                                   + value['selector'] + '</td><td>'
                                   + value['typeValue'] + '</td></tr>';
            });

            $('#DataList').html(dataListHtmlStr);
            $('.current-items-container').show();
        } else {
            $('.current-items-container').hide();
        }
    };

    var switchPanel = function (id) {
        switch (id) {
            case 'preview':
                $('.editor-preview').show();
                $('.editor-form').hide();
                break;
            case 'form':
                $('.editor-preview').hide();
                $('.editor-form').show();

                $('.sourcecode-editor').hide();
                $('#EditorBack').hide();
                $('#EditSource').show();
                $('.editor-form .data-form').show();
                break;
            case 'editor':
                $('.editor-preview').hide();
                $('.editor-form').show();

                $('.sourcecode-editor').show();
                $('#EditorBack').show();
                $('#EditSource').hide();
                $('.editor-form .data-form').hide();
                break;
        }
    };

    $('[data-cms]').each(function (key, value) {
        var $dom = $(value);

        $dom.css('border-color', 'red').css('border-style', 'solid').css('border-width', '1px');
        $dom.on('hover', function () {
            var $dom = $(this);

            if (!showFlag) return;

            currentWidgetTag = $dom.attr('data-cms');
            console.log('Hover in DOM!');
            $tip.css('left', $dom.position().left)
                .css('top', $dom.position().top)
                .show();
        });
    });

    $('#TipHide').on('click', function () {
        $tip.hide();
        showFlag = false;
        setTimeout(function () {
            showFlag = true;
        }, 2000);
    });

    $('#EditWidget').on('click', function () {
        switchPanel('form');
        currentWidgetId = currentWidgetTag;
        updateDataList();

        $('#EditorTitle').html(currentWidgetId);
        $editor.css('left', $(document).width() - $editor.width() - SPACE_WIDTH)
            .css('top', $(document).height() - $editor.height() - SPACE_HEIGHT)
            .show();

        $('.editor').find('.form-container input').val('');
    });

    $('#SaveButton').on('click', function () {
        var localData = window.localStorage[currentWidgetId];
        var dataList = localData ? JSON.parse(localData) : [];
        var newLineHtml = '';
        var newDataObj = {};
        var foundOut = false;

        newDataObj['selector'] = encodeURI($('#selector').val());
        newDataObj['dataSource'] = $('#DataSource').val();
        newDataObj['description'] = $('#DataDescription').val();
        newDataObj['typeValue'] = $('#TypeValue').val();

        $.each(dataList, function (key, value) {
            if (value.selector == newDataObj.selector) {
                dataList[key]['dataSource'] = newDataObj['dataSource'];
                dataList[key]['description'] = newDataObj['description'];
                dataList[key]['typeValue'] = newDataObj['typeValue'];
                foundOut = true;
            }
        });

        if (!foundOut) {
            dataList.push(newDataObj);

            newLineHtml += '<tr><td>' + decodeURI($('#selector').val()) + '</td><td>'
                        + $('#DataSource').val() + '</td><td>'
                        + $('#DataDescription').val() + '</td></tr>';

            newLineHtml += '<tr><td>' + $('#DataDescription').val() + '</td><td>'
                        + $('#DataSource').val() + '</td><td>'
                        + decodeURI($('#selector').val()) + '</td><td>'
                        + $('#TypeValue').val() + '</td></tr>';
            $('#DataList').append(newLineHtml);
        } else {
            updateDataList();
        }

        window.localStorage.setItem(currentWidgetId, JSON.stringify(dataList));
        $('.current-items-container').show();
    });

    $('#WidgetEditor').find('.close-custom').on('click', function () {
        $editor.hide();
    });

    $('#PreviewButton').on('click', function () {
        switchPanel('preview');

        var previewDataHtmlStr = '';
        var $container = $('.editor-preview');
        var $content = $container.find('#DataPreview');
        var $table = $container.find('table');

        var localData = window.localStorage[currentWidgetId];
        var dataList = localData ? JSON.parse(localData) : [];

        if (localData) {
            var $widget = $('[data-cms="' + currentWidgetId + '"]');

            $.each(dataList, function (key, value) {
                var selector = decodeURI(value.selector);
                var content = $widget.find(selector).html();

                previewDataHtmlStr += '<tr><td>' + value['description'] + '</td><td>'
                                   + '<input type="text" class="data-preview" /><input type="hidden" class="data-selector" value="' + value['selector'] + '"/>' + '</tr>';
            });

            $('#DataPreview').html(previewDataHtmlStr);

            $('#DataPreview').find('tr').each(function (key, value) {
                var selector = decodeURI(dataList[key]['selector']);
                var content = $widget.find(selector).html();
                var $input = $(value).find('.data-preview');

                $input.val(content);
            });

            $container.find('.data-preview').on('keyup', function (event) {
                var $target = $(event.target);
                var $tr = $target.parent().parent();
                var content = $tr.find('.data-preview').val();
                var selector = $tr.find('.data-selector').val();

                $widget.find(decodeURI(selector)).html(content);
            });

            $table.show();
        } else {
            $table.hide();
        }
    });

    $('#BackButton').on('click', function () {
        switchPanel('form');
    });

    $('#EditSource').on('click', function () {
        var $widget = $('[data-cms="' + currentWidgetId + '"]');
        var text = $widget.html();

        // text = $.trim(text);
        // TODO: Remove the '\r' and other things
        /*
        var i, counter, list;

        list = text.split('\n');
        for (counter = 0; counter < list[1].length; counter++) {
            if (list[1][counter] != ' ') {
                break;
            }
        }

        $.each(list, function (index, str) {
            if (index < list.length -1) {
                list[index] = str.slice(0, str.length - counter);
            }
        });
        */
        // console.log(text);

        switchPanel('editor');

        // TODO: Replace the htmlContent with the dataSource that defined, difficult point here!!!

        var $tempDom = $('#TempDiv');
        var localData = window.localStorage[currentWidgetId];
        var dataList = localData ? JSON.parse(localData) : [];

        $tempDom.html(text);
        $.each(dataList, function (key, value) {
            var selector = value['selector'];
            var dataSource = value['dataSource'];

            $tempDom.find(selector).html('$data.' + dataSource);
        });
        text = $tempDom.html();

        editor.setValue(text);
    });

    $('#EditorBack').on('click', function () {
        switchPanel('form');
    });

    $('#ToHtml').on('click', function () {
        KISSY.use('velocity/index, velocity/parse', function(S, Velocity, Parser){
            // var html = (S.all('#tpl').html());
            var html = editor.getValue();
            var asts = Parser.parse(html);
            var compile = new Velocity(asts);

            console.log(compile.render());
        });
    });

    var editor = CodeMirror(document.getElementById("CodeEditor"), {
        mode: "text/html",
        lineNumbers: true,
        indentUnit: 0,
        smartIndent: false,
        autofocus: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        value: '<p>Loading...</p>'
    });
});
