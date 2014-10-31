/*
 *  HTML Diff Processor
 *  ===================
 * 
 *  This class allows the conversion of HTML to plaintext, replacing each tag
 *  with a Unicode character not in public usage, to allow for the use of standard
 *  diff algorithms on the resulting HTML. Note that after using this class,
 *  any resulting HTML may still be invalid - although it is guaranteed not to contain
 *  *syntactically* invalid HTML, it may contain *semantically* invalid HTML (i.e.: improperly
 *  nested tags, missing closing or starting tags, etc.).
 */

//  0xE000 is the start of the private use area in the Unicode Standard
DefaultCharacterCode = 0xE000;

function HTMLDiffProcessor() {
    this.tagToCharacterMap = {};
    this.currentCharacterCode = DefaultCharacterCode;
}

HTMLDiffProcessor.prototype.getCharForTag = function(tag) {
  if (!(tag in this.tagToCharacterMap)) {
    this.tagToCharacterMap[tag] = String.fromCharCode(this.currentCharacterCode++);
  }
  return this.tagToCharacterMap[tag];
};

HTMLDiffProcessor.prototype.reset = function() {
  this.tagToCharacterMap = {};
  this.currentCharacterCode = DefaultCharacterCode;
};

HTMLDiffProcessor.prototype.plainTextFromHTML = function(html) {
  return html.replace(/<(S*?)[^>]*>.*?|<.*?\/>/g, this.getCharForTag.bind(this));
};

HTMLDiffProcessor.prototype.htmlFromPlainText = function(plain) {
  for (var tag in this.tagToCharacterMap) {
    plain = plain.replace(RegExp(this.tagToCharacterMap[tag], 'g'), tag);
  }

  return plain;
};

module.exports = HTMLDiffProcessor;