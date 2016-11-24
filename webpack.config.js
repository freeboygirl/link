var path = require("path");
var webpack = require("webpack");

var src = path.join(__dirname, 'src');
var build = path.join(__dirname, 'build');

module.exports = {
  context: src,
  entry: {
    link: './link'
  },
  output: {
    path: build,
    filename: "[name].js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
    ]
  },
  plugins: [
  ]
};