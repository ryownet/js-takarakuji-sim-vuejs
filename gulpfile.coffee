gulp         = require 'gulp'
path         = require 'path'
fs           = require 'fs'
sass         = require 'gulp-sass'
runSequence  = require 'run-sequence'
$            = (require 'gulp-load-plugins')()

# FIXME 全体的にエラー対策してません

paths =
  srcDir : 'src'
  dstDir : 'public'
  tstDir : 'test'

# copycss
gulp.task 'copy:css', ->
  gulp.src [
    "#{paths.tmpDir}/**/*.css"
    ]
    .pipe gulp.dest "./#{paths.dstDir}"

# copycss2tmp
gulp.task 'copy:csstmp', ->
  gulp.src [
    "#{paths.srcDir}/**/*.css"
    ]
    .pipe gulp.dest "./#{paths.tmpDir}"


# compass compile
gulp.task 'scss', ->
  gulp
    .src "#{paths.srcDir}/**/*.scss"
    .pipe sass
      outputStyle: 'compressed'
    .pipe $.header('@charset "utf-8";')
    .pipe gulp.dest "#{paths.dstDir}"

# copyJS
gulp.task 'copy:js', ->
  gulp.src "#{paths.srcDir}/**/!(concat)/*.js"
    .pipe strip
      line: true
      block: false
    .pipe gulp.dest "./#{paths.dstDir}"

# js concat
gulp.task 'js:concatJalanPc', ->
  gulp.src [
    "#{paths.srcDir}/pc/common/js/concat/_intro.js"
    "#{paths.srcDir}/pc/common/js/concat/*.js"
  ]
  .pipe $.concat "jalanpc.js"
  .pipe $.uglify()
  .pipe gulp.dest "#{paths.dstDir}/pc/common/js"


# e2e test
gulp.task 'test:busterjs', ->
  gulp
    .src "#{paths.tstDir}/buster/**/*-test.js"
    .pipe buster
      name: "my lovely configuration name"
      environment: "browser"
      failOnStderr: true
      useHeadlessBrowser: true


# e2e test
gulp.task 'test:casperjs', ->
  gulp
    .src "#{paths.tstDir}/casper/**/*-test.js"
    .pipe casperjs()



# --------------------------------------------
# npm run から呼ばれるpublicタスク

gulp.task 'css', ['scss']


gulp.task 'javascript', ->
  runSequence(
    'copy:js'
    'js:concatJalanPc'
  )

gulp.task 'default', ['watch']
gulp.task 'dest', ['css', 'javascript']

gulp.task 'check', ['css:lint', 'js:hint']
gulp.task 'check:js', ['js:hint', 'js:jscs']
gulp.task 'check:css', ['css:lint']
gulp.task 'check:html', ['html4:lint', 'html:validate']


gulp.task 'test:buster', ['test:busterjs']


