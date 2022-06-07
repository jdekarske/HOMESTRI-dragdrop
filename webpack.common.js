const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin') // TODO figure this out

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
                { from: "src/app/index.html", to: "index.html" },
                { from: "src/manager/manager.html", to: "[name].html" },
            ],
        }),
    ],
};