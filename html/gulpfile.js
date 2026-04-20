const gulp = require("gulp");
const pug = require("gulp-pug");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const { deleteAsync } = require("del");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const webp = require("gulp-webp");
const gulpIf = require("gulp-if");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const through2 = require("through2");
const path = require("path");
const sass = require("gulp-sass")(require("sass"));

ffmpeg.setFfmpegPath(ffmpegPath);

const errorHandler = function (error) {
  try {
    notify.onError({
      title: "Gulp Error",
      message: error.message,
      sound: "Beep",
    })(error);
  } catch (e) {
    console.error("Notification failed:", e.message || e);
  }
  if (this && typeof this.emit === "function") this.emit("end");
};

const paths = {
  css: {
    src: ["src/css/pages/**/*.{css,scss,sass}", "!src/css/lib/*.css"],
    dest: "dist/css",
  },
  cssLib: {
    src: [
      "node_modules/swiper/swiper-bundle.min.css",
      "node_modules/flatpickr/dist/flatpickr.min.css",
      "src/css/lib/*.css",
    ],
    conc: "lib.min.css",
    dest: "dist/css",
  },
  js: {
    src: ["src/js/bundles/**/*.js", "src/js/vendor/**/*.js"],
    dest: "dist/js",
  },
 jsLib: {
    src: [
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/vanilla-lazyload/dist/lazyload.min.js",
      "node_modules/swiper/swiper-bundle.min.js",
      "node_modules/flatpickr/dist/flatpickr.min.js",
      "node_modules/flatpickr/dist/l10n/vn.js",
      "src/js/lib/*.js",
    ],
    conc: "lib.min.js",
    dest: "dist/js",
  },
  previews: {
    src: "src/pug/partials/**/*.pug",
    dest: "dist/previews",
  },
  pug: {
    src: "src/pug/pages/**/*.pug",
    watch: "src/pug/**/*.pug",
    dest: "dist",
  },

  assets: {
    src: ["src/assets/**/*", "!src/assets/videos/**", "!src/assets/images/**"],
    dest: "dist/assets",
  },
  images: {
    src: "src/assets/images/**/*.{png,jpeg,jpg,svg}",
    dest: "dist/assets",
  },
  videos: {
    src: [
      "src/assets/videos/**/*.{mp4,mov,avi}",
      "!src/assets/videos/webm/**/*",
    ],
    dest: "dist/assets/",
  },
  webm: {
    src: ["src/assets/videos/webm/**/*.{mp4,mov,avi}"],
    dest: "dist/assets/",
  },
};

function css() {
  return gulp
    .src(paths.css.src)
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      postcss([tailwindcss("./tailwind.config.js"), autoprefixer(), cssnano()]),
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}

function cssLib() {
  return gulp
    .src(paths.cssLib.src)
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(concat(paths.cssLib.conc))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.cssLib.dest))
    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src(paths.js.src)
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function jsLib() {
  return gulp
    .src(paths.jsLib.src)
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(concat(paths.jsLib.conc))
    .pipe(terser())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(paths.jsLib.dest))
    .pipe(browserSync.stream());
}

function pugToHtml() {
  return gulp
    .src(paths.pug.src)
    .pipe(plumber({ errorHandler }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream());
}
function previewPartials() {
  return gulp
    .src(paths.previews.src)
    .pipe(plumber({ errorHandler }))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.previews.dest));
}
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(plumber({ errorHandler }))
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function assets() {
  return gulp
    .src(paths.assets.src)
    .pipe(plumber({ errorHandler }))
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browserSync.stream());
}

function videos() {
  return gulp
    .src(paths.videos.src)
    .pipe(plumber({ errorHandler }))

    .pipe(gulp.dest(paths.videos.dest))
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.extname === ".webm") return cb(null, file);

        const dir = path.dirname(file.path);
        const base = path.basename(file.path, path.extname(file.path));

        const tempOutput = path.join(dir, `${base}.__tmp__.mp4`);
        const finalOutput = path.join(dir, `${base}.mp4`);

        ffmpeg(file.path)
          .output(tempOutput)
          .videoCodec("libx264")
          .audioCodec("aac")
          .outputOptions([
            "-profile:v baseline",
            "-level 3.0",
            "-pix_fmt yuv420p",
            "-movflags +faststart",
          ])
          .on("end", () => {
            fs.unlink(file.path, (err) => {
              if (err) return cb(err);

              fs.rename(tempOutput, finalOutput, (err) => {
                if (err) return cb(err);

                file.path = finalOutput; // 👈 update vinyl file path
                cb(null, file);
              });
            });
          })
          .on("error", (err) => cb(err))
          .run();
      }),
    )
    .pipe(browserSync.stream());
}

function webm() {
  return gulp
    .src(paths.webm.src)
    .pipe(plumber({ errorHandler }))
    .pipe(
      gulpIf(
        (file) => file.extname !== ".webm" && file.extname !== ".svg",
        through2.obj(function (file, _, cb) {
          const dir = path.dirname(file.path);
          const base = path.basename(file.path, path.extname(file.path));

          const tempOutput = path.join(dir, `${base}.__tmp__.webm`);
          const finalOutput = path.join(dir, `${base}.webm`);

          ffmpeg(file.path)
            .output(tempOutput)
            .videoCodec("libvpx-vp9")
            .audioCodec("libvorbis")
            .outputOptions([
              "-b:v 4M",
              "-b:a 128k",
              "-crf 18",
              "-quality good",
              "-preset slow",
            ])
            .on("end", () => {
              fs.unlink(file.path, (err) => {
                if (err) return cb(err);
                fs.rename(tempOutput, finalOutput, (err) => {
                  if (err) return cb(err);
                  file.path = finalOutput;
                  cb(null, file);
                });
              });
            })
            .on("error", (err) => cb(err))
            .run();
        }),
      ),
    )
    .pipe(gulp.dest(paths.webm.dest))
    .pipe(browserSync.stream());
}

function swiperAssets() {
  return gulp
    .src(["node_modules/swiper/swiper-bundle.min.css"])
    .pipe(gulp.dest("dist/vendor/swiper"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: { baseDir: "./dist" },
    host: "0.0.0.0",
    port: 3000,
    open: false,
    notify: false,
    ghostMode: false,
    logFileChanges: true,
    cache: false,
    watchOptions: {
      ignoreInitial: true,
      ignored: "*.txt",
    },
  });

  const watchOptions = {
    ignoreInitial: false,
    delay: 200,
  };

  const pugWatcher = gulp.watch(paths.pug.watch, watchOptions);
  pugWatcher.on("all", (event, filepath) => {
    console.log(`Pug ${event}: ${filepath}`);
    gulp.series(pugToHtml, css)();
  });

  gulp.watch(paths.css.src, watchOptions, css);
  gulp.watch(paths.cssLib.src, watchOptions, cssLib);
  gulp.watch(paths.images.src, watchOptions, images);
  gulp.watch(paths.assets.src, watchOptions, assets);
  gulp.watch(paths.js.src, watchOptions, js);
  gulp.watch(paths.jsLib.src, watchOptions, jsLib);
  // gulp.watch(paths.chartJs.src, watchOptions, chartJs);
  gulp.watch(paths.videos.src, watchOptions, videos);
  gulp.watch(paths.webm.src, watchOptions, webm);

  gulp.watch("dist/**/*").on("change", browserSync.reload);
}

function clean() {
  return deleteAsync(["dist"]);
}

const build = gulp.series(
  clean,
  gulp.parallel(
    css,
    cssLib,
    js,
    jsLib,
    pugToHtml,
    // previewPartials,
    images,
    assets,
    swiperAssets,
    videos,
    webm,
  ),
);

const dev = gulp.series(build, watch);

exports.clean = clean;
exports.build = build;
exports.default = dev;
exports.assets = assets;
