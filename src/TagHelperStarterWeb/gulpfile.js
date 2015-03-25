/// <binding Clean='clean' />

var gulp = require("gulp"),
    fs = require("fs"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    rename = require("gulp-rename"),
    jshint = require("gulp-jshint"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    less = require("gulp-less"),
    //imagemin = require("gulp-imagemin"),
    project;

eval("project = " + fs.readFileSync("./project.json"));

var paths = {
    bower: "./bower_components/",
    webroot: "./" + project.webroot + "/"
};

paths.lib = paths.webroot + "lib/"
paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.less = paths.webroot + "css/**/*.less";

gulp.task("clean:lib", function (cb) {
    del(paths.lib, cb);
});

gulp.task("clean:css", function (cb) {
    del(paths.minCss, cb);
});

gulp.task("clean:js", function (cb) {
    del(paths.minJs, cb);
});

gulp.task("clean", ["clean:lib", "clean:css", "clean:js"]);

gulp.task("copy:lib", ["clean:lib"], function () {
    var bower = {
        "angular": "angular/angular*.{js,map}",
        "bootstrap": "bootstrap/dist/**/*.{js,map,css,ttf,svg,woff,eot}",
        "bootstrap-touch-carousel": "bootstrap-touch-carousel/dist/**/*.{js,css}",
        "hammer.js": "hammer.js/hammer*.{js,map}",
        "jquery": "jquery/jquery*.{js,map}",
        "jquery-validation": "jquery-validation/jquery.validate.js",
        "jquery-validation-unobtrusive": "jquery-validation-unobtrusive/jquery.validate.unobtrusive.*{js,map}"
    };

    for (var destinationDir in bower) {
        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));
    }
});

gulp.task("jshint", function () {
    gulp.src([paths.js, "!" + paths.minJs])
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("jsmin", function () {
    gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("."));
});

gulp.task("cssmin", function () {
    return gulp.src([paths.css, "!" + paths.minCss], { base: "." })
        .pipe(cssmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("."));
});

gulp.task("less", function () {
    gulp.src(paths.less, { base: "." })
        .pipe(less())
        .pipe(gulp.dest("."));
});

gulp.task("watch", ["copy:lib", "jshint", "less"], function () {
    var onChange = function (event) {
        console.log("File " + event.path + " was " + event.type + ", running tasks...");
    };

    gulp.watch([paths.js, "!" + paths.minJs], ["jshint"])
        .on("change", onChange);
    gulp.watch([paths.less], ["less"])
        .on("change", onChange);
    gulp.watch(paths.bower + "*", ["copy:lib"])
        .on("change", onChange);
});

//gulp.task("images", function () {
//    return gulp.src(paths.webroot + "images/**/*")
//        .pipe(imagemin({
//            progressive: true
//        }))
//        .pipe(gulp.dest("."));
//});

gulp.task("pre-publish", ["clean", "copy", "less", "cssmin", "jsmin"]);
