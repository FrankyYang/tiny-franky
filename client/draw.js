function Draw(arg) {
	if (arg.nodeType) {
		this.canvas = arg;
	} else if (typeof arg == 'string') {
		this.canvas = document.getElementById(arg);
	} else {
		return;
	}
	this.init();
}
Draw.prototype = {
	init: function() {
		var that = this;
		if (!this.canvas || !this.canvas.getContext) {
			return;
		}
		this.context = this.canvas.getContext('2d');
		this.canvas.onselectstart = function () {
			return false;  //修复chrome下光标样式的问题
		};
		this.canvas.onmousedown = function(event) {
			that.drawBegin(event);
		};
	},
	drawBegin: function(e) {
		var that = this,
			stage_info = this.canvas.getBoundingClientRect();
		window.getSelection ? window.getSelection().removeAllRanges() :
								document.selection.empty();  //清除文本的选中
		this.context.moveTo(
			e.clientX - stage_info.left,
			e.clientY - stage_info.top
		);
		document.onmousemove = function(event) {
			that.drawing(event);
		};
		document.onmouseup = this.drawEnd;
	},
	drawing: function(e) {
		var stage_info = this.canvas.getBoundingClientRect();
		this.context.lineTo(
			e.clientX - stage_info.left,
			e.clientY - stage_info.top
		);
		this.context.stroke();
	},
	drawEnd: function() {
		document.onmousemove = document.onmouseup = null;
	}
};

/*
var action = {
    name: "line",
    info: {
        startPos: "20,23",
        endPos: "156,23"
    }
};
var draw = function (name, info) {
    switch (name) {
        case 'line':
            drawLine(info);
        break;

    }
};

var drawLine = function (info) {
    var startPos = info.startPos.split(',');
    var endPos = info.endPos.split(',');
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.lineTo(
        e.clientX - stage_info.left,
        e.clientY - stage_info.top
    );
    context.stroke();
}
*/
