var _ = require('lodash');
var gdiff = require('googlediff');
var htmlparser = require("htmlparser2");
var log = require('../config/log').createLoggerForFile(__filename);
var HTMLDiffProcessor = require('../helpers/HTMLDiffProcessor');

var getOpeningTagName = function(tag) {
  var tagName = null;
  
  var parser = new htmlparser.Parser({
      onopentag: function(_tagName) {
        tagName = _tagName;
      }
  });
  parser.write(tag);
  parser.end();

  return tagName;
};

var getClosingTagName = function(tag) {
  var regex = new RegExp("\\</([a-zA-Z+]).*?\\>", "g");
  var match;
  while ((match = regex.exec(tag)) !== null) {
    // javascript RegExp has a bug when the match has length 0
    if (match.index === regex.lastIndex) {
      ++regex.lastIndex;
    }
    return match[1];
  }
};

function Difference(part) {
  this.isAddition = part[0] === 1;
  this.isDeletion = part[0] === -1;
  this.content = part[1];

  var openingTagName = getOpeningTagName(this.content);
  this.isOpeningTag = !!openingTagName;

  var closingTagName = getClosingTagName(this.content);
  this.isClosingTag = !!closingTagName;

  this.tagName = openingTagName || closingTagName;
}

function DiffFormatter(revHtml, prevHtml) {
  //  Remove end comments
  this.revHtml  = revHtml;
  this.prevHtml = prevHtml;

  this.contentParts = [];
  this.totalAdded = 0;
  this.totalRemoved = 0;
  this.editCount = 0;
}

var getDiffParts = function(revHtml, prevHtml) {
  var diff = new gdiff();
  var convert = new HTMLDiffProcessor();

  var file1 = convert.plainTextFromHTML(prevHtml);
  var file2 = convert.plainTextFromHTML(revHtml);

  var diffParts = diff.diff_main(file1, file2);
  diff.diff_cleanupSemantic(diffParts);

  var beforeFilter = +new Date();
  diffParts = _(diffParts)
    .reduce(function(acc, part) {
      var htmlChunk = convert.htmlFromPlainText(part[1]);
      var htmlTags = htmlChunk.split(/(<.*?>)/g);
      var newParts = _(htmlTags)
        .filter()
        .map(function(subpart) { return new Difference([part[0], subpart]); })
        .value();
      return acc.concat(newParts);
    }, []);

  var afterFilter = +new Date();
  log.info("Filtering", diffParts.length, "differences took", (afterFilter - beforeFilter), "msec.");

  return diffParts;
};

DiffFormatter.prototype.findClosingTagIndexWithName = function(name, startIndex) {
  for (closingTagIndex = startIndex + 1; closingTagIndex < this.diffParts.length; closingTagIndex++) {
    if (this.diffParts[closingTagIndex].isClosingTag && this.diffParts[closingTagIndex].tagName === name) {
      return closingTagIndex;
    }
  }

  return -1;
};

var getOldContentString = function(parts) {
  return _(parts)
    .filter(function(part) { return !part.isAddition; })
    .map(function(part) { return part.content; })
    .toArray().join('');
};

var getNewContentString = function(parts) {
  return _(parts)
    .filter(function(part) { return !part.isDeletion; })
    .map(function(part) { return part.content; })
    .toArray().join('');
};

DiffFormatter.prototype.processChangeInOpenTag = function(openTagIndex, closingTagIndex) {
  //  If there is no corresponding change in close tag, then this tag itself must have
  //  been modified. Let's find the corresponding changed tag, which should immediately
  //  follow this tag.
  var oldOpenTag = this.diffParts[openTagIndex];
  var newOpenTag = this.diffParts[openTagIndex + 1];
  var closingTag = this.diffParts[closingTagIndex];
  var partsWithinTag = this.diffParts.slice(openTagIndex + 1, closingTagIndex);

  var oldContent = getOldContentString(partsWithinTag);
  var newContent = getNewContentString(partsWithinTag);

  this.pushSubtraction(oldOpenTag.content + oldContent + closingTag.content);
  this.pushAddition(newOpenTag.content + newContent + closingTag.content);
};

DiffFormatter.prototype.pushAddition = function(html) {
  this.contentParts.push(this.wrapInAdditionSpan(html));
};

DiffFormatter.prototype.pushSubtraction = function(html) {
  this.contentParts.push(this.wrapInSubtractionSpan(html));
};

DiffFormatter.prototype.wrapInAdditionSpan = function(html) {
  this.totalAdded += html.length;
  return this.wrapInSpan('additions', html);
};

DiffFormatter.prototype.wrapInSubtractionSpan = function(html) {
  this.totalRemoved += html.length;
  return this.wrapInSpan('subtractions', html);
};

DiffFormatter.prototype.wrapInSpan = function(klass, html) {
  return (
    '<span class="ww-edit ' + klass + '" id="edit-' + (this.editCount++) + '">' +
    ((html.indexOf("<") === 0) ? (" " + html + " ") : html) +
    '</span>'
  );
};

DiffFormatter.prototype.processTagAdditionOrDeletion = function(openTagIndex, closingTagIndex) {
  var tagAdded   = this.diffParts[openTagIndex].isAddition,
      tagRemoved = this.diffParts[openTagIndex].isDeletion;

  var openingTag = this.diffParts[openTagIndex];
  var closingTag = this.diffParts[closingTagIndex];
  var partsWithinTag = this.diffParts.slice(openTagIndex, closingTagIndex);

  var oldContent = getOldContentString(partsWithinTag);
  var newContent = getNewContentString(partsWithinTag);

  if (tagAdded) {
    if (oldContent) {
      this.pushSubtraction(oldContent);
    }
    this.pushAddition(openingTag.content + newContent + closingTag.content);
  } else {
    this.pushSubtraction(openingTag.content + oldContent + closingTag.content);
    if (newContent) {
      this.pushAddition(newContent);
    }
  }
};

DiffFormatter.prototype.process = function() {
  var revHtml  = this.revHtml.split("\n\n<!--")[0];
  var prevHtml = this.prevHtml.split("\n\n<!--")[0];

  try {
    this.diffParts = getDiffParts(revHtml, prevHtml);

    var startTime = +new Date();
    for (var i = 0; i < this.diffParts.length; i++) {
      var difference = this.diffParts[i];

      if (difference.isAddition || difference.isDeletion) {
        if (difference.isOpeningTag) {
          var closingTagIndex = this.findClosingTagIndexWithName(difference.tagName, i);

          if (closingTagIndex !== -1) {
            var closingTag = this.diffParts[closingTagIndex];

            if (closingTag.isAddition || closingTag.isDeletion) {
              this.processTagAdditionOrDeletion(i, closingTagIndex);
            } else {
              this.processChangeInOpenTag(i, closingTagIndex);
            }

            i += closingTagIndex - i;
            continue;
          }
        }

        if (difference.isAddition) {
          this.pushAddition(difference.content);
        } else {
          this.pushSubtraction(difference.content);
        }
      } else {
        this.contentParts.push(difference.content);
      }
    }
    var endTime = +new Date();
    log.info("Formatted diff into HTML in " + (endTime - startTime) + " msec.");
  } catch (err) {
    log.error(err);
    this.contentParts = ['Diff unavailable'];
  }
};

DiffFormatter.prototype.generateDiff = function() {
  this.process();
  return {
    content:   this.contentParts.join(""),
    added:     this.totalAdded,
    removed:   this.totalRemoved,
    editCount: this.editCount,
  };
};

module.exports = DiffFormatter;