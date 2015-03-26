/// <binding Clean='clean' />

var gulp = require("gulp"),
    fs = require("fs"),
    del = require("del"),
    watch = require("gulp-watch"),
    batch = require("gulp-batch"),
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
    var onChange = function (file) {
        console.log(file.event + " of " + file.path + " detected, running tasks...");
    };

	// watch([paths.js, "!" + paths.minJs], function (file) {
	// 	onChange(file);
	// 	gulp.start("jshint");
	// });
	// watch([paths.less], function (file) {
	// 	onChange(file);
	// 	gulp.start("less");
	// });
	watch(paths.bower, batch({ timeout: 100 }, function (events, cb) {
		//onChange(file);
		//gulp.start("copy:lib");
		//cb();
		events
			.on("data", onChange)
			.on("end", function() {
				gulp.start("copy:lib");
				cb();
			});
    }));

});

//gulp.task("images", function () {
//    return gulp.src(paths.webroot + "images/**/*")
//        .pipe(imagemin({
//            progressive: true
//        }))
//        .pipe(gulp.dest("."));
//});

gulp.task("pre-publish", ["clean", "copy", "less", "cssmin", "jsmin"]);
