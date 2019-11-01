const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

function baseUrl(subdir) {
    return path.join(__dirname, ".", subdir);
}

const config = {
    entry: './site/public/ts/analog/Main.ts',
    output: {
        filename: 'Bundle.analog.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'site/data',       to: 'data'},
            {from: 'site/templates',  to: 'templates'},
            {from: 'site/public/examples',   to: 'examples'},
            {from: 'site/public/img', to: 'img'}
        ])
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'ts-loader',
                    options: {onlyCompileBundledFiles: true}
                }
            }
        ]
    },
    resolve: {
        alias: {
            "Vector": baseUrl('app/core/ts/utils/math/Vector'),
            "math": baseUrl('app/core/ts/utils/math'),
            "core": baseUrl('app/core/ts/'),
            "analog": baseUrl('app/analog/ts'),
            "site/shared": baseUrl('site/public/ts/shared'),
            "site/analog": baseUrl('site/public/ts/analog')
        },
        extensions: ['.ts', '.js']
    }
};

module.exports = (env, argv) => {
    config.plugins.push(new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(!(argv.mode === 'development'))
    }));

    return config;
};
