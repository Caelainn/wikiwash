var KB = 1024, MB = 1024 * KB, GB = 1024 * MB;

module.exports = {
  cache: {
    maxSizeInBytes: 10 * GB,
    path:           'cache',
    defaultSuffix:  '.html',
  },
};
