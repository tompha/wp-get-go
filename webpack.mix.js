/**
 * Laravel Mix
 * ----------------------------------------------------------------------------
 * Utilise Mix's webpack wrapper to handle asset compilation and other build
 * tasks we might need for our builds
 */
const { mix } = require('laravel-mix');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinMozPlugin = requre('imagemin-mozjpeg');

mix.webpackConfig({
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: 'resources/assets/image',
            to: 'public/images'
        }]),
        new ImageMinPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            plugins: [
                ImageMinMozPlugin({
                    quality: 80
                })
            ]
        })
    ]
}).options({
    processCssUrls: false
});

mix.js('resources/assets/js/app.js', 'public/js').sourceMaps();
mix.sass('resources/assets/scss/app.scss', 'public/css').sourceMaps();

if (!mix.inProduction()) {
    mix.browserSync('get-go.wp');
}
