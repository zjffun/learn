const fs = require("fs");
const del = require("del");
const { parallel, series, src, dest, watch } = require("gulp");
const template = require("gulp-template");
const server = require("gulp-webserver");

const langs = ["en", "zh_CN"];

function clean(cb) {
  del("dist/**", { force: true });
  cb();
}

function buildHTML(lang) {
  const data = JSON.parse(fs.readFileSync(`./_locales/${lang}/messages.json`));

  const createTemplate = () =>
    template(
      {},
      {
        imports: {
          i18n: (name) => {
            return data[name]?.message || name;
          },
        },
      }
    );

  src("parts-of/*.html")
    .pipe(createTemplate())
    .pipe(dest(`dist/${lang}/parts-of`));
  src("index.html")
    .pipe(createTemplate())
    .pipe(dest(`dist/${lang}`));
}

function build(cb) {
  langs.forEach((lang) => {
    buildHTML(lang);
  });
  cb();
}

function devWatch() {
  watch(["index.html", "parts-of/*.html", "_locales/*/*.json"], function (cb) {
    build();
    cb();
  });
}

function devServer() {
  src("dist").pipe(
    server({
      livereload: true,
      open: true,
      port: 8848,
    })
  );
}

exports.build = series(clean, build);
exports.default = parallel(devWatch, devServer);
