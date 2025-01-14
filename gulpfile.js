const {src, dest, watch, parallel} = require ("gulp");

//csss
const sass = require('gulp-sass')(require('sass'));
const plumber = require ('gulp-plumber');
const autoprefixer = require ('autoprefixer');
const cssnano = require('cssnano');
const postcss = require ('gulp-postcss');
const sourcemaps = require ('gulp-sourcemaps');



//imagenes
const cache =require ('gulp-cache');
const imagemin = require ('gulp-imagemin');
const webp =require ('gulp-webp');
const avif = require ('gulp-avif');



// javascript
const terser =require('gulp-terser-js');


function css(done){

    src("src/scss/**/*scss") //identifica el archivo
    .pipe(sourcemaps.init())
    .pipe (plumber() )
    .pipe( sass() ) 
    .pipe(postcss([autoprefixer(),cssnano()]))// lo compila
    .pipe (sourcemaps.write('.'))
    .pipe(dest("build/css") );  // lo guarda en el disco duro


    done(); //calllback que avisa a gulp que llegamos al final
}


function imagenes(done){
    const opciones = {
      optimizationlevel:3
    }
    src ('img/**/*.{png,jpg}')
    .pipe( cache(imagemin(opciones)) )
    .pipe (dest('build/img') )

    done();
}

function versionwebp(done){
  const opciones = {
    quality: 50
  };


    src('img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}

function versionavif(done){
    const opciones = {
      quality: 50
    };
  
  
      src('img/**/*.{png,jpg}')
      .pipe(webp(opciones))
      .pipe(dest('build/img'))
  
      done();
  }

  function javascript (done) {
    src("src/scss/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe (terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
  }

function dev(done) {

    watch("src/scss/**/*scss",css)
    watch("src/**/js/*.js",javascript)

    done();
}

exports.css = css;
exports.js =javascript;
exports.imagenes = imagenes;
exports.versionwebp =versionwebp;
exports.versionavif = versionavif;
exports.dev =parallel(imagenes,versionwebp,versionavif,javascript, dev);
