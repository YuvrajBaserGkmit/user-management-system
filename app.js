const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { commonErrorHandler } = require('./helpers/common-function.helper');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

// gzip compression module
app.use(compression());

// register all the routes
routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
  const message = 'Invalid endpoint';
  const statusCode = 404;
  commonErrorHandler(req, res, message, statusCode);
});

module.exports = app;
