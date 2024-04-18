const { src, dest, parallel, series, watch } = require("gulp");
const ejs = require("gulp-ejs");
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const browserify = require("browserify");
const source = require("vinyl-source-stream");

const ROOT = "/";
const PORT = 8080;

const ASSET_PATH = {
    HTML: {
        src: "./src/views",
        dest: "./output/"
    },
    SCSS: {
        src: "./src/scss/common.scss",
        dest: "./output/css/",
        watch: "./src/scss/**/*.scss",
    },
    SCRIPT: {
        src: "./src/scripts/common.js",
        dest: "./output/scripts/bundle.js",
        watch: "./src/scripts/**/*.js",
    }
};

// markup
const gulpEJS = () => 
    src([ASSET_PATH.HTML.src+"/**/*.html", '!'+ASSET_PATH.HTML.src + "/**/include/*.html"])
    .pipe(ejs())
    .pipe(dest(ASSET_PATH.HTML.dest));

// stylesheets
const stylesheets = () => 
    src(ASSET_PATH.SCSS.src)
    .pipe(sass({
        outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(dest(ASSET_PATH.SCSS.dest));

// scripts
const getBrowserScript = () => {
    browserify({
        basedir: ".",
        debug: true,
        entries: [ASSET_PATH.SCRIPT.src],
        cache: {},
        packageCache: {},
    }).bundle()
    .pipe(source(ASSET_PATH.SCRIPT.dest))
    .pipe(dest("output"));
};

// browser-sync 
const bs = () => {
    browserSync.init({
        server: {
            baseDir: __dirname + ROOT,
            directory: true,
        },
        port : PORT,
        open: false,
    });
};
    
const watching = () => {
    watch(ASSET_PATH.HTML.src+"/**/*.html", gulpEJS).on("change", browserSync.reload);
    watch(ASSET_PATH.SCSS.watch, stylesheets).on("change", browserSync.reload);
    watch(ASSET_PATH.SCRIPT.watch, getBrowserScript).on("change", browserSync.reload);
};

const clean = () => del(["output"]);

exports.default = parallel([gulpEJS, stylesheets, getBrowserScript, watching, bs]);
exports.clean = series(clean);
