var fs = require('fs'),
    sys = require('sys'),
    _path = require('path'),
    uglify = require('uglify-js'),
    _c = require('./build/conf'),
    _DEBUG_FILE = 'build/debug/lib.js',
    _RELEASE_FILE = 'build/release/lib-min.js',
    ast, debugOut, releaseOut;

function matches(type) {
    return function (path) {
        return path.match(new RegExp(type + "$"));
    }
}

function collect(path, files, matches) {
    matches = matches || function (path) {
        return path.match(/\.js$/);
    };

    if (fs.statSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(function (item) {
            collect(_path.join(path, item), files, matches);
        });
    } else if (matches(path)) {
        files.push(path);
    }
}

function compile(files, block) {
    return files.reduce(function (buffer, file) {
        var filestr = fs.readFileSync(file, "utf-8") + "\n";
        return buffer + (block ? block(filestr, file) : filestr);
    }, "");
}

desc('Deploy All JS files');
task('deploy', [], function(params) {
    //var files = ['constants.js', 'db.js', 'event.js', 'require.js', 'tizen.js', 'utils.js'], 
    var files = ['constants.js', 'db.js', 'event.js', 'require.js', 'utils.js'], 
        //LIB = __dirname + "/lib/",
        all = '',
        lib = [],
        thirdparty = [],
        src = {
            info: JSON.parse(fs.readFileSync(_c.PACKAGE_JSON, "utf-8")),
            js: "",
            html: "",
            skins: ""
        };

    collect(_c.LIB, lib);
    collect(_c.THIRDPARTY, thirdparty, function (path) {
        return _c.thirdpartyIncludes.some(function (file) {
	    return matches(file)(path);
	});
    });

    src.js += "/*! \n  " + _c.APPNAME +
              " v" + src.info.version + " :: Built On " + new Date() + "\n\n" +
              fs.readFileSync(_c.LICENSE, "utf-8") + "*/\n";

    src.js += _c.thirdpartyIncludes.reduce(function (buffer, file) {
        return buffer + fs.readFileSync(_c.THIRDPARTY + file, "utf-8");
    }, "");

    src.js += compile(lib, function (file, path) {
        console.log('[path --> ]    ' + path.replace(/\\/g, "/").replace(/^.*lib\//, ""));
        return "require.define('" + path.replace(/\\/g, "/").replace(/^.*lib\//, "").replace(/\.js$/, '') +
               "', function (require, module, exports) {\n" + file + "});\n";
    });

    src.js += "require('db').initialize(function () { require('tizen').initialize(); });";
        
    debugOut = fs.openSync(_DEBUG_FILE, 'w+');    
    fs.writeSync(debugOut, src.js);
    
    releaseOut = fs.openSync(_RELEASE_FILE, 'w+');
    fs.writeSync(releaseOut, uglify.minify(_DEBUG_FILE).code);
    //fs.writeSync(releaseOut, uglify.minify("lib/utils.js"));
});

/*
files.forEach(function(file, i) {
    if (file.match(/^.*js$/)) {
        all += fs.readFileSync('lib/' + file).toString();
    }
});
*/
