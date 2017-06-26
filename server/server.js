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
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';
import iotSockets from './sockets/sockets';
import serverConfig from './config';

// Set native promises as mongoose promise
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Create Express server.
 */
const app = express();
app.set('port', serverConfig.port);
app.use(compression());
app.use(bodyParser.json());
/**
 * Route handlers
 */
const deviceRoutes = require('./routes/Device.routes');


/**
 * API routes
 */
app.use('/api/device', deviceRoutes.default);


/**
 * Start Express server.
 */
// Enable webpack middleware if in debug mode
if (isDevelopment) {
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    hot: true,
    inline: true,
    quiet: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  // TODO: Cant use browserHistory because all routes get redirected here. Also, need to support api
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'public/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

/* eslint-disable*/
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

/* eslint-enable*/
export default app;
