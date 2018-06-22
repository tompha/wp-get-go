let mix = require('laravel-mix');

mix.js('resources/assets/js/app.js', 'public/js');
mix.sass('resources/assets/scss/app.scss', 'public/css/');
mix.browserSync('get-go.wp');
