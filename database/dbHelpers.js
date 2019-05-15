const { Quotes } = require('./model.js');

const getQuote = (id, callback) => {
  Quotes.findById(id, (err, quote) => {
    if (err) callback(err);
    else callback(null, quote);
  })
}

module.exports = { getQuote }