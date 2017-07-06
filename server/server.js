/**
 * Module dependencies.
 */
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import webpack from 'webpack';
import socketio from 'socket.io';
// webpack
import WebpackDevServer from 'webpack-dev-server';
import iotSockets from './sockets/sockets';
import serverConfig from './config';

/**
 * Create Express server.
 */
const app = express();
app.set('port', serverConfig.port);
app.use(compression());
app.use(bodyParser.json());
// default route for single page app
app.use('/', express.static(path.join(__dirname, '/public')));

/**
 * Start Express server.
 */
const webpackConfig = process.env.NODE_ENV === 'development' ? require('../webpack.config.dev') : null;
/* eslint-disable no-console*/
if (webpackConfig) {
  console.log('server is running in development mode');
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
  devServer.listen(webpackConfig.devServer.port, () => {
    console.log(`webpack-dev-server is listening on port ${webpackConfig.devServer.port}`);
  });
}

/**
 * Route handlers
 */
const deviceRoutes = require('./routes/Device.routes');

/**
 * API routes
 */
app.use('/api/device', deviceRoutes.default);

const server = app.listen(serverConfig.port, () => {
  console.log('App is running at http://localhost:%d in %s mode', serverConfig.port, app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

/**
 * Start Socket.io
 */
const io = socketio(server);
app.set('socketio', io);
iotSockets(io, serverConfig);

export default app;
