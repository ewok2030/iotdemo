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
/* eslint-disable no-console*/
if (process.env.NODE_ENV === 'development') {
  console.log('server is running in development mode');
  const webpackConfig = require('../webpack.config.dev');
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
  const devPort = 3001;
  devServer.listen(devPort, () => {
    console.log(`webpack-dev-server is listening on port ${devPort}`);
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
