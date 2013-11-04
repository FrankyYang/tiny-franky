module.exports = {
    APPNAME: "JS Project Test",
    LICENSE: "LICENSE",
    PACKAGE_JSON: __dirname + "/../package.json",
    ROOT: __dirname + "/../",
    BUILD: __dirname + "/",
    EXT: __dirname + "/../ext/",
    ASSETS: __dirname + "/../ext/assets/",
    CACHE_MANIFEST: __dirname + "/../ext/cache.manifest",
    LIB: __dirname + "/../lib/",    
    DEVICES: __dirname + "/../lib/css/",
    THIRDPARTY: __dirname + "/../thirdparty/",
    DEPLOY: __dirname + "/../pkg/",
    SPACES_AND_TABS: /\n+|\s+|\t{2,}/g,
    ESCAPED_QUOTES: '\'+"\'"+\'',
    thirdpartyIncludes: [
        "browser-require/require.js",
        "jquery.js",
        "jWorkflow/jworkflow-min-0.4.0.js"
    ]
};
