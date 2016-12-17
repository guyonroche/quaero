'use strict';

const path = require('path');

const express = require('express');
const proxy = require('proxy-middleware');
const url = require('url');
const bodyParser = require('body-parser');

const config = require('./app.json');

const DAL = require('./lib/dal');
const router = require('./lib/router');

// must create dal before anything else tries to use it.
let dal = DAL.createDal(config.db);

let app = express();

app.use(bodyParser.json());

// API
app.use('/api', router);

// proxy to client
console.log(`Proxying client to ${config.dev.client.port}`);
app.use('/', proxy(url.parse(`http://localhost:${config.dev.client.port}`)));

let server = app.listen(config.server.port, () => {
  console.info(`Express server started at http://localhost:${config.server.port}`);
});
