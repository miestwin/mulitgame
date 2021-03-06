const webpack = require('webpack');
const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    entry: {
        controller: './src/controller/index.ts',
        game: './src/game/index.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist/scripts'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pixi: pixi,
            phaser: phaser,
            p2: p2
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' },
            { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' }
        ]
    }
}