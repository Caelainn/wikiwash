var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var KB = 1024, MB = 1024 * KB, GB = 1024 * MB;

module.exports = {
  root:         rootPath,

  cache: {
    maxSizeInBytes: 10 * GB,
    path:           'cache',
    defaultSuffix:  '.html',
  },
};
