const mongoose = require('./index.js');

const quotesSchema = new mongoose.Schema({
  _id: Number,
  quote: String
});

const Quotes = mongoose.model('quotes', quotesSchema);

const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  gamesPlayed: Number,
  fastestWpm: Number,
  averageWpm: Number
});

const Users = mongoose.model('users', usersSchema);

module.exports = { Quotes, Users };
