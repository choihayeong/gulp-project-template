const { watch, series } = require("gulp");

function clean(cb) {
    cb();
    console.log("gulp clean");
}

function javascript(cb) {
    cb();
    console.log("gulp javascript");
}

function css(cb) {
    cb();
    console.log("css");
}

function watching() {
    watch("src/*css", css);
    watch("src/*.js", series(clean, javascript));
}

exports.default = watching;