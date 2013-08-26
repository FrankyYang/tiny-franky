/*
 * jQuery Svg Routes Plugin 0.0.1
 *
 * Copyright 2013, iQiyi
 *
 */

/*Dependence: Raphael.js, */

// the widget definition, where "custom" is the namespace,
$.widget( "custom.svgroutes", {
    options: {
        data: [],
        fill: 'rgb(255,190,135)',
        rectWidth: 80,
        rectHeight: 40,
        spaceWidth: 40,
        spaceHeight: 20,
        fontSize: 12,
        fontFamily: "Simsun",
        r: 10,
        dragSupport: false,
        workflowStatus: 'Underway',
        workflowId: '',
        mousehover: function () {}
    },

    // the constructor
    _create: function () {
        // 各种全局变量的保存
        this.startX = 0;
        this.currentLine = [];
        this.nextLine = [];
        this.direction = 1;
        this.startY = 0;
        this.matrix = [];
        this.spaceWidth = this.options.spaceWidth;
        this.spaceHeight = this.options.spaceHeight;

        // 初始化时扩展一次即可
        this._extendRaphael();
    },

    _init: function() {
        var position, startLine;
        var $tip = this.options.$tip;
        var self = this;


        this.matrix = this.options.data;
        this.matrix.forEach(function (line) { // 写默认的item的宽高
            line.forEach(function (metaItem) {
                metaItem.rectWidth = metaItem.rectWidth || self.options.rectWidth;
                metaItem.rectHeight = metaItem.rectHeight || self.options.rectHeight;
            });
        });

        // 组装后台数据为二维矩阵
        size = this._calculatePosition();
        size.w += 2 * self.spaceWidth;         // 绘制提示框的需要
        size.h += 4 * this.options.rectHeight; // 绘制提示框的需要
        this._drawMatrix(size);
        this._bindTipEvents($tip);
    },
    _getLineWidth: function (line) {
        var r = 0;
        line.forEach(function (item) {r = r > item.rectWidth ? r : item.rectWidth; });
        return r;
    },
    _calculatePosition: function () {
        var maxLineHeight = 0, matrixWidth = 0, matrix = this.matrix, self = this;
        var getLineHeight = function (line) {
            var result = 0;
            line.forEach(function (item) { result += item.rectHeight + self.spaceHeight; });
            return result;
        };
                var getPosX = function (leftItem, rightItem, leftLineWidth, nextLineWidth) {
            return leftItem.position.x + (leftLineWidth - leftItem.rectWidth) / 2 + leftItem.rectWidth
                   + self.spaceWidth + (nextLineWidth - rightItem.rectWidth) / 2;
        };
        matrix.forEach(function (line) {
            var lineHeight = getLineHeight(line);
            maxLineHeight = maxLineHeight > lineHeight ? maxLineHeight : lineHeight;
        });
        matrix[0][0]['position'] = {
            x: self.spaceWidth,
            y: (maxLineHeight - matrix[0][0]['rectHeight']) / 2 + self.spaceHeight
        };
        matrix.forEach(function (line, index) {
            var lineWidth = self._getLineWidth(line);
            matrixWidth += lineWidth + self.spaceWidth;
            (index + 1 < matrix.length) && line.forEach(function (leftItem) {
                var preList, nextLineWidth, posX;
                var list = matrix[index + 1].filter(function (nextLineItem) { return leftItem.nextIds.indexOf('' + nextLineItem.id) != -1;});

                lineWidth = self._getLineWidth(line);
                nextLineWidth = self._getLineWidth(matrix[index + 1]);
                if (list.length > 1) { // 显然是一对多了，就不用往回反向找previousIds了
                    var starty = leftItem.position.y + (leftItem.rectHeight - getLineHeight(list)) / 2;
                    list.forEach(function (metaItem) {
                        metaItem.position = {
                            x: getPosX(leftItem, metaItem, lineWidth, nextLineWidth),
                            y: starty + self.spaceHeight / 2
                        };
                        starty = starty + self.spaceHeight + metaItem.rectHeight;
                    });
                } else if (list.length == 1) { // 多对一或者一对一
                    preList = line.filter(function (currentLineItem) { return list[0].previousIds.indexOf('' + currentLineItem.id) != -1;});
                    var height = getLineHeight(preList);
                    list[0].position = {
                        x: getPosX(leftItem, list[0], lineWidth, nextLineWidth),
                        y: preList[0].position.y + (height - list[0].rectHeight - self.spaceHeight) / 2
                    };
                } else {
                    console.error('Not find that item in next line!');
                    console.log(leftItem);
                }
            });
        });
        return {
            w: matrixWidth,
            h: maxLineHeight
        };
    },

    _extendRaphael: function () {
        // 扩展Raphael，加上connection函数，默认是从左向右绘制的,
        // 第一个参数表示左边的点，第二个参数表示右边的点
        Raphael.fn.connection = function (startPoint, endPoint, options) {
            if (!startPoint || !startPoint.x || !startPoint.y || !endPoint || !endPoint.x || !endPoint.y) return;

            // 向右上方指的箭头的示例："M 82 107 L 102 107 Q 112 107 112 97 L 112 27 Q 112 17 122 17 L 136 17";
            // 向右指的箭头的示例："M 141 17 L 134 21 L 136 17 L 134 14 Z";
            var pathStr = '';
            var centralX = startPoint.x + (endPoint.x - startPoint.x) / 2;
            var dy = endPoint.y > startPoint.y ? 10 : -10; // 控制箭头往上以曲线转还是往下以曲线转

            pathStr += Raphael.format("M{0},{1}", startPoint.x, startPoint.y);
            if (startPoint.y != endPoint.y) {
                pathStr += Raphael.format("L{0},{1}Q{2},{3},{4},{5}L{6},{7}Q{8},{9},{10},{11}",
                    centralX - 10, startPoint.y, centralX, startPoint.y, centralX, startPoint.y + dy,
                    centralX, endPoint.y - dy, centralX, endPoint.y, centralX + 10, endPoint.y);
            }
            pathStr += Raphael.format("L{0},{1}", endPoint.x - 5, endPoint.y);

            this.path(pathStr).attr({stroke: 'rgb(107, 77, 79)', fill: "none"});
            // 绘制箭头
            if (options && (!options.fake)) {
                this.path(Raphael.format("M{0},{1}L{2},{3}L{4},{5}L{6},{7}Z", endPoint.x, endPoint.y, endPoint.x - 7,
                    endPoint.y + 4, endPoint.x - 5, endPoint.y, endPoint.x - 7, endPoint.y - 3)
                ).attr({stroke: 'rgb(107, 77, 79)', fill: "rgb(107, 77, 79)"});
            }
        };

        Raphael.fn.button = function (x, y, w, h, text, options) {
            // rect of the button
            var box = this.rect(x, y, w, h, options.round).attr({
                fill: options.rectfill,
                'stroke-width': 0
            });
            // text of the button,  left or center? default is center
            var textPosX = options.align == 'left' ? box.attrs.x + 10 : box.attrs.x + box.attrs.width / 2; // left or center
            var textPosY = options.align == 'left' ? box.attrs.y + box.attrs.height / 2 - 10 : box.attrs.y + box.attrs.height / 2;
            var textAnchor = options.align == 'left' ? 'start' : 'middle';
            var text = this.text(textPosX, textPosY, text).attr({
                "fill": options.textfill,
                "text-anchor": textAnchor,
                "font-family": options.fontFamily,
                "font-size": options.fontSize
            });

            // set of rectangle + text = button
            var button = this.set().attr({
                "fill-opacity": options.opacity,
                cursor: 'pointer'
            });
            options.rotate && box.transform('r' +  options.rotate);
            box.mouseover(options.onHoverIn).mouseout(options.onHoverOut);
            text.mouseover(options.onHoverIn);
            return button.push(box).push(text).mouseup(options.onclick);
        }
    },

    _drawMatrix: function (size) {
        var id = this.element.attr('id');
        var paper = this.paper = Raphael(id, size.w, size.h);
        var statusColorConfig = {
            'Finished': 'rgb(97,177,251)',
            'Underway': 'rgb(168,212,80)',
            'Killed': 'rgb(255,190,135)',
            'Failed': 'rgb(202,105,101)'
        };
        var rectfill;
        var self = this;

        // 第二次绘制时需要先清空之前的内容，否则这些图会上下排列
        paper.clear();
        this.matrix.forEach(function (items, index) {
            items.forEach(function (item) {
                var rectText = item.usedTime ? item.stepName + '\n' + item.usedTime : item.stepName;
                var nextIds = item.nextIds, x, y, optionsTemp, buttonTemp;
                var rotatedWidth = item.rectWidth / 1.41;

                if (item.position) {
                    x = item.position.x;
                    y = item.position.y;
                    rectfill = statusColorConfig[item.status] || self.options.fill;

                    // 绘制带文字的矩形块
                    if (!item.fake) {
                        optionsTemp = {
                            rectfill: rectfill,
                            textfill: 'rgb(82,94,108)',
                            strokeWidth: 0,
                            opacity: 0.5,
                            onHoverIn: self._hoverCb(paper, item, true),
                            onHoverOut: self._hoverCb(paper, item, false)
                        };
                        if (item.condition && item.condition == 'start') {
                            optionsTemp.round = null;
                            optionsTemp.rotate = '45';
                            buttonTemp = paper.button(x + (item.rectWidth - rotatedWidth) / 2, y + (item.rectHeight - rotatedWidth) / 2, item.rectWidth/1.41, item.rectWidth/1.41, rectText, optionsTemp);
                            //buttonTemp.transform('r45');
                        } else {
                            optionsTemp.round = self.options.r;
                            buttonTemp = paper.button(x, y, item.rectWidth, item.rectHeight, rectText, optionsTemp);
                        }
                    } else { // 以贯穿矩形的横线横线替代
                        paper.path(Raphael.format("M{0},{1}L{2},{3}", x - 5, y + item.rectHeight / 2,
                                                  x + item.rectWidth, y + item.rectHeight / 2))
                                                  .attr({stroke: 'rgb(107, 77, 79)', fill: "none"});
                    }

                    (index + 1 < self.matrix.length) && nextIds.forEach(function (id) {
                        var nextItem;
                        self.matrix[index + 1].some(function (metaItem) { return !(nextItem = metaItem) || (metaItem.id == id); });

                        if (!nextItem || !nextItem.position) return;

                        // 绘制两个矩形的连接线
                        paper.connection({
                            x: item.position.x + item.rectWidth,
                            y: item.position.y + item.rectHeight / 2
                        },
                        {
                            x: nextItem.position.x,
                            y: nextItem.position.y + nextItem.rectHeight / 2
                        }, { fake: nextItem.fake });
                    });
                }
            });
        });
    },

    _hoverCb: function (paper, item, isIn) {
        var hoverFlag = isIn;
        var hintElementObj = {};
        var preTaskId;
        var $tip = this.options.$tip;
        var self = this;

        this.hintHideTimer = null;
        this.state = {sender: 'rect', state: 'hide'};

        return function () {
            if (hoverFlag) {
                if (!item.taskId) return;

                var rectfill = "rgb(223,246,198)";
                var color = "hsb(240°, 1, 1)";
                var $dom = $(this.node);

                var x = item.position.x;
                var y = item.position.y + item.rectHeight + 5;

                var hintResetButton, hintLogButton, text = '';
                var restartClickCb = function (item) {
                    return function () {
                        var data = {
                            workflowId: self.options.workflowId,
                            stepId: item.stepId,
                            dynamicId: item.dynamicInstanceId
                        };
                        $.ajax({
                            url: '/process/restartWorkflowStep',
                            dataType: 'json',
                            method: 'post',
                            data: data,
                            success: function(data) {
                                if (data.code == 'A00000') {
                                    console.log('工作流重启成功！');
                                    paper.clear();
                                    self._init(); // 重绘
                                }
                            }
                        });
                    };
                };

                // Hack here, with this I know it's hovering in text
                if ($dom.attr('font')) { // Text的hoverIn, 只show而已
                    state = {sender: 'text', state: 'hide'};
                    self.hintHideTimer && clearTimeout(self.hintHideTimer);
                    return;
                }

                state = {sender: 'rect', state: 'hide'};
                $tip.css('left', $(self.element).position().left + parseInt($dom.attr('x')) + 'px')
                    .css('top', $(self.element).position().top + parseInt($dom.attr('y'))
                    + parseInt($dom.attr('height')) + 10 + 'px').show();

                // 先in再out，真是坑爹
                self.hintHideTimer && clearTimeout(self.hintHideTimer);

                if (preTaskId == item.taskId) return;
                preTaskId = item.taskId;

                $.ajax({
                    url: '/process/getWorkflowStepTips',
                    dataType: 'json',
                    method: 'post',
                    data: {taskId: item.taskId},
                    success: function(data) {
                        if (!hoverFlag) return;
                        if (data.code == 'A00000') {
                            self._setHintContent(data.data);
                        }
                    }
                });
            } else {
                self.hintHideTimer = setTimeout(function () {
                    if (self.state.sender == 'rect') {
                        $tip.hide();
                        console.warn('Hover out and hide tip!');
                    }
                }, 500);
            }
        };
    },
    _bindTipEvents: function ($tip) {
        var self = this;
        $tip.hover(function () {
            self.hintHideTimer && clearTimeout(self.hintHideTimer);
        }, function () {
            $tip.hide();
        });

        $tip.delegate("#RestartStep", "click", function () {
            var id = $(this).attr("data-id");
            window.open('http://10.10.144.128:9092/getlist/?taskId=' + id);
        });
        $tip.delegate("#MoreInfo", "click", function () {
            var $dom = $(this);
            var state = $dom.attr('data-state');
            if (!state || state == 'fold') {
                $dom.html('收起<<');
                self.options.$tip.find('.more-table').show();
                $dom.attr('data-state', 'unfold')
            } else if (state == 'unfold'){
                $dom.html('更多>>');
                self.options.$tip.find('.more-table').hide();
                $dom.attr('data-state', 'fold')
            }
        });
        $tip.delegate("#ReadRecord", "click", function () {
            var $dom = $(this);
            var data = {
                workflowId: $dom.attr("data-workflowId"),
                stepId: $dom.attr("data-stepId"),
                dynamicId: $dom.attr("data-dynamicId")
            };

            $.ajax({
                url: '/process/restartWorkflowStep',
                dataType: 'json',
                method: 'post',
                data: data,
                success: function(data) {
                    if (data.code == 'A00000') {
                        console.log('工作流重启成功！');
                        self.paper.clear();
                        self._init(); // 重绘
                    }
                }
            });
        });
    },
    _setHintContent: function (taskInfo) {
        var taskName = taskInfo.taskItemTitle || '无';
        var $tip = this.options.$tip;
        var restartButton = '';
        var moreLink = '<br>', tableHtml = '';
        var workflowId = this.options.workflowId;
        var len = 30;
        var text = ['起始时间: ' + taskInfo.startTime + '<br>', '结束时间: ' + taskInfo.endTime + '<br>',
                    '进度: ' + taskInfo.progress + '%'].join('');
        var readRecordButton = '<button class="btn btn-mini btn-info" id="ReadRecord" style="float: right;margin-top:10px;" data-id="' + taskInfo.taskItemId + '">查看日志</button>';

        if (taskInfo.status == 'Underway' || taskInfo.status == 'Failed') {
            restartButton = '<button class="btn btn-mini btn-primary" id="RestartStep" style="margin-top:10px;" data-workflowId="' + workflowId + '"'
                            + 'data-stepId="' + item.stepId + '"' + 'data-dynamicId="' + item.dynamicInstanceId + '">步骤重启</button>';
        }
        if (taskInfo.taskItems) {
            taskInfo.taskItems.forEach(function (item) {
                item.startTime = Com.date.format(item.startTime, "yyyy-MM-dd hh:mm");
                item.endTime = Com.date.format(item.endTime, "yyyy-MM-dd hh:mm");
            });
            moreLink = '<br><a href="#" style="color:#00f;" class="more" id="MoreInfo">更多>></a>' + moreLink;
            tableHtml = $("#TmplTipDetails").tmpl(taskInfo.taskItems);
console.log(tableHtml.html());
            $tip.find('.more-table > tbody').html(tableHtml);
        }

        taskName = taskName.length <= len ? taskName : taskName.substring(0, len) + '..';

        $tip.find('.content').html(text + moreLink + restartButton + readRecordButton + "<br>");
    }
});
