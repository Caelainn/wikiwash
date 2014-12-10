var request = require('request'),
  zlib      = require('zlib'),
  fs        = require('fs'),
  moment    = require('moment'),
  Q         = require('q');

var ignore = [
  'Portal:', 'File:', 'Special:', 'Wikipedia:',
  'Talk:', 'Help:', 'User:', 'Category:', 'Data:',
  'index.php', 'index.html', '/', 'Main_Page',
];
var url_prefix = "http://dumps.wikimedia.org/other/pagecounts-raw/";
var limit = 15;

var compressedRequest = function(options) {
  var req = request(options);
  return req.pipe(zlib.createGunzip());
};

var parseLine = function(line) {
  var parts = line.split(' ');
  if (parts.length === 4) {
    return {
      language: parts[0],
      page: parts[1],
      requestCount: parseInt(parts[2], 10),
      size: parseInt(parts[3], 10),
    };
  } else {
    return null;
  }
};

//  See: http://en.wikipedia.org/wiki/Wikipedia:Wikipedia_records#Article_with_longest_title
//
//  This will change over time, but if we exclude the longest wiki page name
//  from showing up on the homepage, that's not a big deal.
var longestPlausiblePageName = 217;

var isRealPage = function(pageName) {
  if (pageName.length > longestPlausiblePageName) {
    return false;
  }

  for (var i = 0; i < ignore.length; i++) {
    if (pageName.indexOf(ignore[i]) === 0) {
      return false;
    }
  }

  return true;
};

function fetchArticleStats(time) {
  if (!time) {
    time = moment.utc().subtract(1, 'hour');
  }

  var folders = time.format("YYYY") + "/" + time.format("YYYY-MM") + "/";
  var filename = "pagecounts-" + time.format("YYYYMMDD-HH") + "0000.gz";

  var options = {url: url_prefix + folders + filename};
  var req = compressedRequest(options);

  var deferred = Q.defer();

  var histogram = {};

  var lineCache = "";
  req.on('data', function(data) {
    var lines = (lineCache + data.toString()).split("\n");
    lineCache = lines[lines.length - 1];

    for (var i = 0; i < lines.length - 1; i++) {
      var parsed = parseLine(lines[i]);
      if (parsed) {
        if (parsed.language === "en" && isRealPage(parsed.page)) {
          if (!(parsed.page in histogram)) {
            histogram[parsed.page] = 0;
          }
          histogram[parsed.page] += parsed.requestCount;
        }
      }
    }
  });

  req.on('end', function() {
    var sorted = [];
    for (var page in histogram) {
      sorted.push([page, histogram[page]]);
    }

    sorted.sort(function(a, b) {
      return a[1] - b[1];
    });

    sorted.reverse();
    deferred.resolve(sorted.slice(0, limit));
  });

  req.on('error', function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

fetchArticleStats.topArticlesFilename = "topArticles.json";

module.exports = fetchArticleStats;

//  If running this file directly on the command line, print out the data.
if (require.main === module) {
  fetchArticleStats().then(function(data) {
    console.log(JSON.stringify(data, null, 2));
  });
}