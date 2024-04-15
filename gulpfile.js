const { src, dest, parallel, series } = require("gulp");
const ejs = require("gulp-ejs");

const gulpEJS = () => 
    src(["./src/views/**/*.html", '!'+"./src/views" + "/**/include/*.html"])
    .pipe(ejs())
    .pipe(dest("output/"));


exports.default = parallel([gulpEJS]);
