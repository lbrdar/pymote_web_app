const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const config =  require('./webpack.base.config.js');
const localSettings = require('./webpack.local-settings.js');

const ip = localSettings.ip;

config.devtool = "#eval-source-map";

config.ip = ip;

const defaultEntryParts = [
  'webpack-dev-server/client?http://' + ip + ':3000',
  'webpack/hot/only-dev-server'
];

// Use webpack dev server
config.entry = {
  algorithm: [
    ...defaultEntryParts,
    './client/pages/algorithm/index'
  ],
};

// override django's STATIC_URL for webpack bundles
config.output.publicPath = 'http://' + ip + ':3000' + '/assets/bundles/';

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new BundleTracker({filename: './webpack-stats-local.json'}),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('development'),
      'BASE_API_URL': JSON.stringify('http://' + ip + ':8000/api/v1/'),
  }}),

]);

// Add a loader for JS and JSX files with react-hot enabled
config.module.loaders.push(
  { 
    test: /\.jsx?$/, 
    exclude: /node_modules/, 
    loaders: ['react-hot', 'babel'] 
  }
);

module.exports = config;
