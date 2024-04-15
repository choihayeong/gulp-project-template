const { series, parallel } = require("gulp");

function transpile(cb) {
    cb();
    console.log("transpile");
}

function bundle(cb) {
    cb();
    console.log("bundle");
}

exports.build = series(transpile, bundle);
