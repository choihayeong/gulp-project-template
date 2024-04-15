# gulp-project-template

> study making project template with gulp

- publish date : 2024-04-15


## Getting Started

- [공식문서 참고](https://gulpjs.com/docs/en/getting-started/quick-start)

> `cb`는 뭘까? <br />
> 여기서 말하는 cb는 callback 함수의 약자로 보임. 여기서 대표적인 콜백함수의 예시는 setTimeout과 setInterval에서 쓰이는 함수들을 콜백함수로 말할 수 있다. <br />
> 예를 들어 `setTimeout(() => {console.log("Time's up")}, 3000);` 에서 `() => {console.log("Time's up")}` 이 부분을 콜백함수라 한다.

### Basic Usage - 1

- `gulp`에 내장되어있는 `series()`, `parallel()`

    * `series`는 다음 예시에서 `transpile` 다음 `bundle` 순서대로 처리
    
    * `parallel`은 말그래도 병렬 처리를 함 (순서 관계 없음)

- 아래 예시에서 터미널에 `gulp build`를 입력하면 실행 결과를 알 수 있다.    

```javascript
const { series } = require("gulp");

function transpile(cb) {
    cb();
    console.log("transpile");
}

function bundle(cb) {
    cb();
    console.log("bundle");
}

exports.build = series(transpile, bundle);
```

```javascript
const { parallel } = require("gulp");

function javascript(cb) {
    cb();
    console.log("javascript");
}

function css(cb) {
    cb();
    console.log("css");
}

exports.build = series(javascript, css);
```

- 다음과 같이 `series()`, `parallel()`은 중첩해서 사용 가능함

```javascript
const { series, parallel } = require("gulp");

function clean(cb) {
    cb();
    console.log("clean");
}

function cssTranspile(cb) {
    console.log("css Transpile");
}

function cssMinify(cb) {
    cb();
    console.log("css minify");
}

function jsTranspile(cb) {
    cb();
    console.log("js transpile");
}

function jsBundle(cb) {
    cb();
    console.log("js Bundle");
}

function jsMinify(cb) {
    cb();
    console.log("js minify");
}

function publish(cb) {
    cb();
    console.log("publish");
}

exports.build = series(
    clean,
    parallel (
        cssTranspile,
        series(jsTranspile, jsBundle)
    ),
    parallel(
        cssMinify,
        jsMinify
    ),
    publish
);
```

### Basic Usage - 2

- `gulp`에 내장되어있는 `src`, `dest` 

    * 다음 예시는 src 폴더 내 js 파일이 output 폴더 내 js 파일로 추출되는(dest) 기본적인 구조이다.

```javascript
const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;
``` 

- root에 `src`폴더 생성 후 `index.js` 파일을 생성 하고 `gulp` 명령어를 실행하면 `output` 폴더 내에 `index.js` 파일이 추출이 된다.

```javascript
const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*.js')
    .pipe(dest('output/'));
}
```

- 예시에서 gulp-babel, gulp-uglify, gulp-rename을 적용하려면 npm으로 설치를 해줘야함.

    * [gulp-babel](https://www.npmjs.com/package/gulp-babel)

    * [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

    * [gulp-rename](https://www.npmjs.com/package/gulp-uglify)

```bash
npm i gulp-babel gulp-uglify gulp-rename
```

- 이 예시는 `src` 폴더 내 js파일들을 babel로 트랜스파일링 한 뒤 output 폴더로 추출 하고 uglify 적용시킨 것을 다시 한번 .min.js로 붙여 output 파일 내에 추출을 하는 예제이다.

```javascript
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

function streamTask() {
    return src("src/*.js")
        .pipe(babel())
        .pipe(dest("output/"))
        .pipe(uglify())
        .pipe(rename({extname : ".min.js"}))
        .pipe(dest("output/"));
}

exports.default = streamTask;
```

### Basic Usage - 3

- gulp에 내장된 `watch`를 알아보자.... 

    * gulp에서 `watch`는 파일이 수정될 때 이를 감지하는 것을 말한다. 

- 다음 예시에서 src 폴더 내 css 파일이 변할 경우 css 함수를 실행하게 되고, js파일이 수정될 경우 clean 함수 실행 후 javascript 함수가 실행된다.

```javascript
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
```
