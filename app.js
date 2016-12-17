'use strict';

const path = require('path');

const express = require('express');
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

// serve client from public folder
app.use('/', express.static(path.join(__dirname, 'public')));

let server = app.listen(config.server.port, () => {
  console.info(`Express server started at http://localhost:${config.server.port}`);
});
