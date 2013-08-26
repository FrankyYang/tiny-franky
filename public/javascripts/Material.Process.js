/**
 * Copyright 2013 Qiyi Inc. All rights reserved.
 * 
 * @file:   Material.Grid.js
 * @path:   js-src/Material/
 * @desc:   Material模块下绘制流程图的对象类
 * @author: franky.z.yang@gmail.com
 * @date:   2013-05-11
 */

Material.Process = function (options ) {
    this.dao = Material.Dao;
};

Material.Process.prototype = {
    render : function(options) {
        var params = {
            transId: options.transId,
            type: options.type,
            workFlowType: options.workFlowType || 1
        };
        var self = this;

        this.options = {
            rectWidth: 80,
            rectHeight: 40,
            spaceWidth: 30,
            spaceHeight: 20,
            fontSize: 12
        };
        this.params = params;
        this.$dialog = $('#MaterialProgressContainer').parent();
        this.$container = $('#' + options.id);
        this.isopen = false;

        if (options.type == 0) {
            this._initBatch(params.transId, params.type, params.workFlowType);
        } else {
            this.$container.find('#BatchOptions').hide();
        }

        // 绑定‘刷新’，‘终止’，暂停‘, '恢复', '重启'按钮功能的绑定
        this.bindEvent();
        // 依赖this.params参数去获取流程图的数据
        this._getDataAndDraw();
    },

    bindEvent: function () {
        var $table = this.$container.parent().find('table');
        var self = this;

        // 刷新流程图
        $table.delegate('[data-operation="refreshWorkflow"]', 'click', function () {
            console.log('refreshed!');
            self._getDataAndDraw();
        });

        // 终止一个流程
        $table.delegate('[data-operation="terminateWorkflow"]', 'click', function () {
            self.dao.terminateWorkflow({workflowId: self.options.workflowId}, function (rd) {
                if (rd.code == 'A00000') {
                    console.log('Terminated success');
                    self._getDataAndDraw();
                }
            });
        });

        // 暂停工作流
        $table.delegate('[data-operation="pauseWorkflow"]', 'click', function () {
            self.dao.pauseWorkflow({workflowId: self.options.workflowId}, function (rd) {
                if (rd.code == 'A00000') {
                    console.log('Pause success');
                    $pauseBtn.hide();
                    $resumeBtn.show();
                    self._getDataAndDraw();
                }
            });
        });

        // 恢复工作流
        $table.delegate('[data-operation="resumeWorkflow"]', 'click', function () {
            self.dao.resumeWorkflow({workflowId: self.options.workflowId}, function (rd) {
                if (rd.code == 'A00000') {
                    console.log('Resume success');
                    $resumeBtn.hide();
                    $pauseBtn.show();
                    self._getDataAndDraw();
                }
            });
        });

        // 重启工作流
        $table.delegate('[data-operation="restartWorkflow"]', 'click', function () {
            self.dao.restartWorkflow({workflowId: self.options.workflowId}, function (rd) {
                if (rd.code == 'A00000') {
                    console.log('Restart success');
                    self._getDataAndDraw();
                }
            });
        });
    },

    _setButtonStatus: function (status) {
        var status = this.options['workflowStatus'];
        var $page = this.$container.parent();
        var $table = $page.find('table');

        var $terminateBtn = $table.find('[data-operation="terminateWorkflow"]');
        var $pauseBtn = $table.find('[data-operation="pauseWorkflow"]');
        var $resumeBtn = $table.find('[data-operation="resumeWorkflow"]');
        var $restartBtn = $table.find('[data-operation="restartWorkflow"]');
        if (status == 'Finished') {
            $($table.find('tr')[1]).hide();
        } else {
            $($table.find('tr')[1]).show();
            if (status == 'Killed') {
                $terminateBtn.hide();
                $pauseBtn.hide();
                $resumeBtn.hide();
                $restartBtn.show();
            } else if (status == 'Underway') {
                $terminateBtn.show();
                $pauseBtn.show();
                $resumeBtn.hide();
                $restartBtn.show();
            } else if (status == 'Suspended') {
                $terminateBtn.show();
                $pauseBtn.hide();
                $resumeBtn.show();
                $restartBtn.show();
            }
        }
    },

    _initBatch: function (transId, type, workFlowType) {
        var self = this;
        this.dao.getBatchInfo({
            transId: transId,
            type: type,
            workFlowType: workFlowType
        }, function (data) {
            var list = data.data;
            var $container = self.$container.parent().find('table').find('#BatchOptions');
            var selectHtmlStr = '';
console.log($container);
            if (data.code == 'A00000') {
                list.forEach(function (item) {
                    selectHtmlStr += '<option value="' + item.workflowId + '">' + item.summary + '</option>';
                });
                $container.html(selectHtmlStr);
                $container.change(function () {
                    var value = $container.find("option:selected").val();
                    self.dao.getWorkflowById({workflowId: value}, function (data) {
                        if (data.code == 'A00000') {
                            self.options['data'] = self._createMatrix(data.data.stepInfoList);
                            // 每次绘制清空container
                            self.$container.empty();
                            self.$container.svgroutes(self.options);
                        } else {
                            console.warn('Get workflow by id error!');
                        }
                    });
                    console.log(value);
                });
            } else {
                console.warn('Get batch info error!');
            }
        });
    },

    _getDataAndDraw: function () {
        var self = this;
        self.$container.empty();
        this.dao.getWorkflow(self.params, function (data) {
            if (data.code != 'A00000' || !data.data.stepInfoList) {
                alert(data.msg + '!');
                return;
            }

            var title = data.data.title, id = data.data.transId;

            self.options['workflowStatus'] = data.data.status;
            self.options['workflowId'] = data.data.workflowId;
            self.options['data'] = self._createMatrix(data.data.stepInfoList);
            self.options['$tip'] = $("#SingleTip");

            if (!self.isopen) {
                $('#MaterialProgressContainer').dialog({
                    title : '查看进度',
                    modal : true,
                    width : self.options.data.length * (self.options.rectWidth + self.options.spaceWidth) + 2*self.options.spaceWidth + 400,
                    buttons : {
                        '关闭' : function() {
                            self.isopen = false;
                            $(this).dialog('close');
                            console.log('Close from close button!');
                        }
                    },
                    close: function(event, ui ) {
                        self.isopen = false;
                        console.log('Close event is emmitted!');
                    }
                });
                self.isopen = true;
                self._setButtonStatus();

                self.$dialog.find(".ui-dialog-title").html(title);
                self.$container.parent().find("#MaterialProgressId").html(id);
            }

            // 每次绘制清空container
            self.$container.empty();
            self.$container.svgroutes(self.options);
        });
    },

    _createMatrix: function (data) {
        var getAndPopItemById = function (id) {
            var result;
            data = data.filter(function (item) { return (item.id != id) || !(result = item); });
            return result;
        };
        // 让每一列的nextIds对应的item都能在下一列中找到，以此让矩阵变得‘饱满’。找不到的就创建假的item
        var fill = function () {
            matrix.forEach(function (line, lineIndex) {
                (lineIndex + 1 < matrix.length) && line.forEach(function (metaItem) {
                    var missedId;
                    metaItem.nextIds.forEach(function (id, index) {
                        if (matrix[lineIndex + 1].every(function (item) { return item.id != id; })) {
                            matrix[lineIndex + 1].push({
                                fake: true,
                                id: fakeId,
                                nextIds: ['' + id]
                            });
                            metaItem.nextIds[index] = '' + fakeId;
                            fakeId--;
                        }
                    });
                });
            });
        };
        // 为每个item添加previousIds项，如同双向链表，方便后续处理
        var addPerviousIds = function () {
            matrix.forEach(function (line, lineIndex) {
                (lineIndex + 1 < matrix.length) && line.forEach(function (metaItem) {
                    metaItem.nextIds.forEach(function (id) {
                        matrix[lineIndex + 1].some(function (nextLineItem) {
                            if (id == nextLineItem.id) {
                                nextLineItem.previousIds = (nextLineItem.previousIds || []).concat(['' + metaItem.id]);
                                return true;
                            }
                        });
                    });
                });
            });
        };

        var startItem, matrix, fakeId = -1, debugCounter = 0;
        var self = this;

        data = data.map(function (item) {
            item.nextIds = item.nextIds ? item.nextIds.split(',') : [];
            item.rectWidth = self.options.rectWidth;
            item.rectHeight = self.options.rectHeight;
            return item;
        });

        startItem = getAndPopItemById(111);
        matrix = [[startItem]];
        while (!(matrix[matrix.length - 1].length == 1 && matrix[matrix.length - 1][0]['id'] == 999)) {
            matrix[matrix.length] = [];
            matrix[matrix.length - 2].forEach(function (metaItem) {
                metaItem.nextIds.forEach(function (id) {
                    var i, rItem;
                    var r = getAndPopItemById(id);
                    if (!r && matrix.some(function (line, index) {
                        i = index;
                        return line.some(function (metaItem) { return !(rItem = metaItem) || (metaItem.id == id); });
                    })) {
                        matrix[i] = matrix[i].filter(function (metaItem) { return metaItem.id != rItem.id; });
                        matrix[matrix.length - 1].push(rItem);
                    } else {
                        matrix[matrix.length - 1].push(r);
                    }
                });
            });
            if (debugCounter++ > 200) break; // TODO: 去除这里防止因为数据错误，找不到结束节点而进入死循环的代码
        }
        fill();
        addPerviousIds();
        return matrix;
    }
}
