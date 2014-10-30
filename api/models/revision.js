var gdiff = require('googlediff');
var _ = require('lodash');
var fs = require('fs');
var HTMLDiffProcessor = require('../helpers/HTMLDiffProcessor');
var WikipediaHelper = require('../helpers/WikipediaHelper');

var revisionDiffData = function (revHtml, prevHtml) {
  var content = "";

  try {
    var diff = new gdiff();
    var convert = new HTMLDiffProcessor();

    var file1 = convert.plainTextFromHTML(prevHtml);
    var file2 = convert.plainTextFromHTML(revHtml);

    var diffParts = diff.diff_main(file1, file2);
    diff.diff_cleanupSemantic(diffParts);
    
    var editCount = 0;
    var totalAdded = 0;
    var totalRemoved = 0;

    var contentParts = [];
    diffParts.forEach(function (part, index) {
      html = convert.htmlFromPlainText(part[1]);

      if (part[0] > 0) {
        contentParts.push('<span class="ww-edit additions" id=edit-' +
                 editCount + '>' + html + '</span>');
        totalAdded += html.length;
        editCount++;
      } else if (part[0] < 0) {
        contentParts.push('<span class="ww-edit subtractions" id=edit-' +
                 editCount + '>' + html + '</span>');
        totalRemoved += html.length;
        editCount++;
      } else {
        contentParts.push(html);
      }
    });
    content = contentParts.join('');
  } catch (err) {
    console.log(err);
    content = 'Diff unavailable';
  }

  return {content: content, added: totalAdded, removed: totalRemoved, editCount: editCount};
};

module.exports.find = function (revisionIDs, callback) {
  if (!Array.isArray(revisionIDs)) {
    revisionIDs = [revisionIDs];
  }

  WikipediaHelper.getAndCacheRevisions(revisionIDs).then(function(blobs) {
    var data = {};

    if (blobs.length === 2) {
      var prevHtml = blobs[1];
      var revHtml = blobs[0];
      return revisionDiffData(revHtml, prevHtml);
    } else {
      return {content: blobs[0], added: 0, removed: 0};
    }
  }).then(function(data) {
    callback(data);
  }).catch(function(err) {
    console.log(err);
    callback({content: "An error occurred.", added: 0, removed: 0});
  });
};
