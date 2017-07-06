const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3001', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.join(__dirname, 'client/client.js'),
  ],
  output: {
    path: path.join(__dirname, '/build/public'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    hot: true,
    filename: '[name].js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: './public',
    proxy: {
      '*': 'http://localhost:3000',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'client/templates/index.html', inject: 'body', filename: 'index.html', favicon: 'client/templates/favicon.ico' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react', 'es2015', 'stage-0', 'react-hmre',
          ],
          plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
        },
      }, {
        test: /\.json?$/,
        loader: 'json-loader',
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]',
      },
    ],
  },
};
