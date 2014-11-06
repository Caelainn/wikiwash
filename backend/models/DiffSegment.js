var getOpeningTagName = function(tag) {
  if (tag.indexOf("<") === 0 && tag.indexOf("</") === -1) {
    return tag.split(" ")[0].replace('<', '').replace('>', '');
  }
};

var getClosingTagName = function(tag) {
  if (tag.indexOf("</") === 0) {
    return tag.split(" ")[0].replace('</', '').replace('>', '');
  }
};

var getSelfClosingTagName = function(tag) {
  if (tag.indexOf("/>") === (tag.length - 2)) {
    return tag.split(" ")[0].replace('<', '').replace('/>', '');
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

  if (!this.isClosingTag) {
    closingTagName = getSelfClosingTagName(this.content);
    this.isClosingTag = !!closingTagName;
  }

  this.tagName = openingTagName || closingTagName;
}

Difference.prototype.toString = function() {
  var prefix = " ";
  if (this.isAddition) prefix = "+";
  if (this.isDeletion) prefix = "-";
  return prefix + " " + this.content;
};

module.exports = Difference;