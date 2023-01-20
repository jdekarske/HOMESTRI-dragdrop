const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');
const { DefinePlugin } = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist/static',
  },
    plugins: [
        new DefinePlugin({
            'process.env.manager_key': JSON.stringify(fs.readFileSync('./manager.key', { encoding: 'utf-8'}) || ''),
        }),
    ]
});
