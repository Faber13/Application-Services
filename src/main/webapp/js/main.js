// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "js/libs",
    "paths": {
        preloading : "../stuff/preloading",
        loading    : "../stuff/loading"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(["../IndexContext", "domReady!", "bootstrap"], function(IndexContext) {
    console.log("index.js() - require() on domReady!");

    var indexContext = new IndexContext();
    indexContext.init();

});
