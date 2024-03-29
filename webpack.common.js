const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs');
const { DefinePlugin } = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin') // TODO figure this out
// https://www.reddit.com/r/webdev/comments/dy39kx/how_to_handle_videos_with_webpack/

// FIXME: export this
const config = JSON.parse(fs.readFileSync('./config.json'));

module.exports = {
    entry: {
        app: './src/app/index.ts',
        components: './src/components/index.ts',
        manager: './src/manager/index.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: 'file-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { context: "src/static", from: "./**/*", to: "static" },
                { context: "src", from: "app/index.html", to: "index.html" },
                { context: "src", from: "manager/manager.html", to: "[name].html" },
                { context: "src", from: "components/*", to: "[name].html" },
            ],
        }),
        new DefinePlugin({
            'process.env.host': JSON.stringify(config["host"]) || null,
            'process.env.protocol': JSON.stringify(config["protocol"]) || null,
            'process.env.endpoints_manager': JSON.stringify(config["endpoints"]["manager"]) || null,
            'process.env.endpoints_simulation': JSON.stringify(config["endpoints"]["simulation"]) || null,
        }),
    ],
};
