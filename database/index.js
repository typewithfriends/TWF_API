const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twf', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', () => console.error('Error connecting to db'));
db.once('open', () => console.log('Successfully connected to database bruh'));

module.exports = mongoose; 
