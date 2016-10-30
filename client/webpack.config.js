var path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.js',
  },
  devServer: {
    inline: true,
    port: 8081,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ["transform-object-rest-spread"],
        }
      }
    ]
  }
};