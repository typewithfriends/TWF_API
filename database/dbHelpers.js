const { sequelize } = require('./index.js');
const Sequelize = require('sequelize');

const Quotes = sequelize.define('quotes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  quote: Sequelize.TEXT
}, {
  timestamps: false
});

sequelize.sync();


const getQuote = (id, callback) => {
  Quotes.findAll({ where: { id } })
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err);
    })
}

module.exports = { getQuote, Quotes }