/**
 * Module dependencies.
 */
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import webpack from 'webpack';
import mongoose from 'mongoose';
// webpack
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

import serverConfig from './config';
import deviceSeed from './seed/Device.seed';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;
const isDevelopment = process.env.NODE_ENV === 'development';

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    throw error;
  }

  // feed some dummy data in DB
  if (serverConfig.seedDatabase) {
    taskSeed();
    projectSeed();
  }
});

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
app.use('/api/devices', deviceRoutes.default);


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
  // TODO: Cant use browserHistory because all routes get redirected here. ALso, need to support api
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'public/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/public')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
}

/* eslint-disable*/
app.listen(serverConfig.port, () => {
  console.log('App is running at http://localhost:%d in %s mode', serverConfig.port, app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
/* eslint-enable*/
export default app;
