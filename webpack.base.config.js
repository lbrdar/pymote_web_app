const path = require("path");
const webpack = require('webpack');

module.exports = {
  context: __dirname,

  entry: {
    // Add as many entry points as you have container-react-components here
    algorithm: './client/pages/algorithm/index',
    results: './client/pages/results/index',
    vendors: ['react'],
  },

  output: {
      path: path.resolve('./server/static/bundles/local/'),
      filename: "[name].js"
  },

  externals: [
  ], // add all vendor libs

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),
  ], // add all common plugins here

  module: {
    loaders: [] // add all common loaders here
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  },
};
