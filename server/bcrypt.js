const bcrypt = require('bcryptjs');

const saltPassword = (password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) console.error(err);
    else {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) console.error(err);
        else callback(hash);
      })
    }
  })
}

const comparePassword = (passwordToCheck, hash, callback) => {
  bcrypt.compare(passwordToCheck, hash, (err, result) => {
    if (result) callback(result); // if res === true
    else console.error(err);
  })
}

module.exports = { saltPassword, comparePassword };