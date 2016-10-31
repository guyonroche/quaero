'use strict';

let path = require('path');

let express = require('express');
let url = require('url');
let bodyParser = require('body-parser');

let pkg = require('./package.json');
let config = require('./app.json');

let DAL = require('./lib/dal');
let router = require('./lib/router');

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