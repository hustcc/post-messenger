/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'post-messenger.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'PostMessenger',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /.js$/,
      loader: 'babel-loader'
    }]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false }
    })
  ]
};