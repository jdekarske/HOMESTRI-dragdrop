const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const fs = require('fs');
const { DefinePlugin } = require('webpack');

// FIXME: export this
const config = JSON.parse(fs.readFileSync('./config.json'));

module.exports = merge(common, {
  mode: "production",
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
        new DefinePlugin({
            'process.env.use_jatos': config["use_jatos"] || null,
        }),
  ]
});
