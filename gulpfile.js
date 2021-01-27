const gulp = require("gulp"),
    del = require("del"),
    merge = require("gulp-merge-json"),
    argv = require("yargs").argv,
    config = argv.config == undefined ? "DEV" : argv.config;

function clean() {
    return del(["./build/"]);
}

function copyAllFiles() {
    return gulp
        .src(["src/**/*.*", "!src/manifest*.json"])
        .pipe(gulp.dest("./build/"));
}

function transformManifest(cb) {
    return transformJson(cb, "manifest");
}

function transformJson(cb, fileName) {
    if (config == "DEV")
        return gulp.src(`src/${fileName}.json`).pipe(gulp.dest("./build/"));

    return gulp
        .src([`src/${fileName}.json`, `src/${fileName}.${config}.json`])
        .pipe(
            merge({
                fileName: `${fileName}.json`
            })
        )
        .pipe(gulp.dest("./build"));
}

const watch = cb => {
    if (argv.watch == undefined) return cb();

    return gulp.watch(
        ["src/**/*.*"],
        gulp.series(copyAllFiles, transformManifest)
    );
};

exports.default = gulp.series(clean, copyAllFiles, transformManifest, watch);
