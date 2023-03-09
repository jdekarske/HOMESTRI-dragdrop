const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');
const { DefinePlugin } = require('webpack')

// FIXME: export this
const config = JSON.parse(fs.readFileSync('./config.json'));

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist/static',
  },
    plugins: [
        new DefinePlugin({
            'process.env.key': JSON.stringify(config["key"]) || null,
            'process.env.use_jatos': false,
        }),
    ]
});
