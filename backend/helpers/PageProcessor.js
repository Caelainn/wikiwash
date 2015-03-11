var cheerio = require('cheerio');

function process(html) {
  var doc = cheerio.load(html);

  doc('a').each(function(i, e) {
    e = doc(e);
    // /w/index.php?title=George_Clooney&redirect=no

    var href = e.attr('href');

    href = href.replace(/^\/w\/index.php\?title=/, '/wiki/').replace(/\&.*/, '')

    doc(e).attr('href', href);
  })

  return doc.html();
}

module.exports = {
  process: process
};
