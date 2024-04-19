const { src, dest, parallel, series, watch } = require("gulp");
const ejs = require("gulp-ejs");
const del = require("del");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const imagemin = require("gulp-imagemin");
const inlineSource = require("gulp-inline-source");
const htmlsplit = require("gulp-htmlsplit");
const lec = require("gulp-line-ending-corrector");

const ROOT = "/";
const PORT = 8080;

const ASSET_PATH = {
    HTML: {
        src: "./src/",
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
    },
    IMAGE: {
        src: "./src/images/*",
        dest: "./output/images/",
    }
};

/**
 * @task : Templates
 */
const gulpEJS = () => new Promise(resolve => {
    src([ASSET_PATH.HTML.src+"/**/*.html", '!'+ASSET_PATH.HTML.src + "/_layouts/*.html"])
    .pipe(ejs())
    .pipe(inlineSource({compress: false}))
    .pipe(dest(ASSET_PATH.HTML.dest));

    resolve();
});

const txtExport = () => new Promise(resolve => {
    setTimeout(() => {
        src("output/**/*.html")
            .pipe(htmlsplit())
            .pipe(
                lec({
                    eolc: "CRLF",
                    encoding: "utf8",
                })
            )
            .pipe(dest("output"));
    }, 500);

    resolve();
})

/**
 * @task : Sass 
 */
const stylesheets = () => new Promise(resolve => {
    src(ASSET_PATH.SCSS.src)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(dest(ASSET_PATH.SCSS.dest));

    resolve();
});

/**
 * @task : scripts 
 */
const getBrowserScript = () => new Promise(resolve => {
    browserify({
        basedir: ".",
        debug: true,
        entries: [ASSET_PATH.SCRIPT.src],
        cache: {},
        packageCache: {},
    }).transform("babelify", {
        sourceMapsAbsolute: false,
        presets: ["@babel/preset-env"]
    }).bundle()
    .pipe(source(ASSET_PATH.SCRIPT.dest))
    .pipe(dest("./"));

    resolve();
});

/**
 * @task : Imagemin 
 */
const images = () => new Promise(resolve => {
    src(ASSET_PATH.IMAGE.src)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: false}),
            imagemin.mozjpeg({quality: 95, progressive: false}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true}, {cleanupIDs: false}]})
        ]))
        .pipe(dest(ASSET_PATH.IMAGE.dest));

    resolve();
});

const inlineResource = () =>
    src([ASSET_PATH.HTML.src+"/**/*.html", '!'+ASSET_PATH.HTML.src + "/_layouts/*.html"])
        .pipe(inlineSource())
        .pipe(dest("./output"));

/**
 * @task : browserSync
 */
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

/**
 * @task : Watch
 */
const watching = () => {
    watch(ASSET_PATH.HTML.src+"/**/*.html", gulpEJS).on("change", browserSync.reload);
    watch(ASSET_PATH.SCSS.watch, stylesheets).on("change", browserSync.reload);
    watch(ASSET_PATH.SCRIPT.watch, getBrowserScript).on("change", browserSync.reload);
};


/**
 * @task : Clean 
 */
const clean = () => new Promise(resolve => {
    del.sync(["output"]);

    resolve();
});

const assets = series(parallel([gulpEJS, stylesheets, getBrowserScript, images]), txtExport);
const liveServer = parallel([watching, bs]);

exports.default = parallel(assets, liveServer);
exports.server = series(liveServer);
exports.build = series(clean, assets);
exports.txt = series(txtExport);
exports.all = series(clean, assets);
exports.clean = series(clean);
