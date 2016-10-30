'use strict';

let path = require('path');

let program = require('commander');
let express = require('express');
let proxy = require('proxy-middleware');
let url = require('url');
let bodyParser = require('body-parser');

let pkg = require('./package.json');
let config = require('./app.json');

let DAL = require('./lib/dal');
let router = require('./lib/router');

program
  .version(pkg.version)
  .option('-d, --dev', 'Run server in dev mode, proxy client to client port')
  .parse(process.argv);

// must create dal before anything else tries to use it.
let dal = DAL.createDal(config.db);

let app = express();

app.use(bodyParser.json());

// API
app.use('/api', router);

if (program.dev) {
  // proxy to client
  console.log(`Proxying client to ${config.dev.client.port}`)
  app.use('/', proxy(url.parse(`http://localhost:${config.dev.client.port}`)));
} else {
  // serve client from public folder
  app.use('/', express.static(path.join(__dirname, 'public')));
}

let server = app.listen(config.server.port, () => {
  console.info(`Express server started at http://localhost:${config.server.port}`);
});
