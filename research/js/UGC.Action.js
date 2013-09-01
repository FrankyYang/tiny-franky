var UGC = UGC || {version: '1.0'};
UGC.Config = UGC.Config || {};

UGC.Action = (function () {
    var base = null;
    var grid = null;

    var getBase = function (options, isNew) {
        if (isNew) {
            return new UGC.Base(options);
        }

        if (!base) {
            base = new UGC.Base(options);
        }

        return base;
    };

    var getGrid = function (options, isNew) {
        if (isNew) {
            return new UGC.Grid(options);
        }
        if (!grid) {
            grid = new UGC.Grid(options);
        }
        return grid;
    };

    var run = function ($container) {
        getBase({'$container': $container}).run();
    };

    var detail = function (id) {
        getBase().detail(id);
    };

    var push = function (id) {
        getBase().push(id);
    };

    var batch = function (idList) {
        getBase().batch(idList);
    };

    var process = function (id) {
        getBase().process(id);
    };

    var control = function (id) {
        getBase().control(id);
    };

    var gridReload = function (type, flag) {
        getGrid().reload(type, flag);
    };

    return {
        run: run,
        detail: detail,
        push: push,
        batch: batch,
        process: process,
        control: control,
        gridReload: gridReload,

        getBase: getBase,
        getGrid: getGrid
    };
})();
