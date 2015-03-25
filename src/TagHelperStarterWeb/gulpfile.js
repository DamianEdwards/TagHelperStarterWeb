/// <binding Clean='clean' />

var gulp = require("gulp"),
    //rimraf = require("rimraf"),
    fs = require("fs"),
    del = require("del"),
    rename = require("gulp-rename"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    less = require("gulp-less"),
    //imagemin = require("gulp-imagemin"),
    project;

eval("project = " + fs.readFileSync("./project.json"));

var paths = {
    bower: "./bower_components/",
    webroot: "./" + project.webroot + "/",
    lib: "./" + project.webroot + "/lib/"
};

gulp.task("clean:lib", function (cb) {
    //rimraf(paths.lib, cb);
    del([paths.lib], cb);
});

gulp.task("clean:css", function (cb) {
    del([paths.webroot + "css/**/*.min.css"]);
});

gulp.task("clean:js", function (cb) {
    del([paths.webroot + "js/**/*.min.js"]);
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

gulp.task("js", function () {
    gulp.src([paths.webroot + "js/**/*.js", "!js/**/*.min.js"], { base: "." })
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("."));
});

gulp.task("css", function () {
    gulp.src([paths.webroot + "css/**/*.css", "!css/**/*.min.css"], { base: "." })
        .pipe(cssmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("."));
});

//gulp.task("images", function () {
//    return gulp.src(paths.webroot + "images/**/*")
//        .pipe(imagemin({
//            progressive: true
//        }))
//        .pipe(gulp.dest("."));
//});

gulp.task("default", ["clean", "css"]);
