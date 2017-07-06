const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'client/client.js'),
  ],
  output: {
    path: path.join(__dirname, '/build/public'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'client/templates/index.html', inject: 'body', filename: 'index.html', favicon: 'client/templates/favicon.ico' }),    
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react', 'es2015', 'stage-0',
          ],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        },
      }, {
        test: /\.json?$/,
        loader: 'json-loader',
      }, {
        test: /\.css$/,
        loader: 'style-loader!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
      },
    ],
  },
};
