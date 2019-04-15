const { Users } = require('../database/model.js');
const { saltPassword, comparePassword } = require('./bcrypt.js');

const postSignupInfo = (req, res) => {
  let { username, password, name, email } = req.body;
  Users.findOne({ username }, (err, user) => {
    if (err) console.error('error finding user for signup', err);
    else {
      if (user) res.status(201).send(false);
      else {
        saltPassword(password, hash => {
          new Users({
            username: username,
            password: hash,
            name: name,
            email: email,
            gamesPlayed: 0,
            fastestWpm: 0,
            averageWpm: 0
          }).save((err) => {
            if (err) console.error('error creating new user', err);
            else res.status(201).send(true);
          })
        })
      }
    }
  })
}

const postLoginInfo = (req, res) => {
  let { username, password } = req.body;
  Users.findOne({ username }, (err, user) => {
    if (err) console.error('error finding user for login', err);
    else {
      if (!user) res.status(201).send(false);
      else {
        comparePassword(password, user.password, result => {
          if (result) res.status(201).send(true);
          else res.status(201).send(false);
        })
      }
    }
  })
}

const getGameStats = (req, res) => {
  let { username } = req.params;
  Users.findOne({ username }, (err, user) => {
    if (err) console.error('error finding user for getting stats', err);
    else {
      if (user) {
        let { gamesPlayed, fastestWpm, averageWpm } = user;
        let userStats = {
          gamesPlayed,
          fastestWpm,
          averageWpm
        }
        res.status(200).send(userStats);
      } else {
        res.status(201).send('error getting stats');
      }
    }
  })
}

const postGameStats = (req, res) => {
  let { username, wpm } = req.body;
  Users.findOne({ username }, (err, user) => {
    if (err) console.error('error finding user for update stats', err);
    else {
      if (user) {
        let { gamesPlayed, fastestWpm, averageWpm } = user;
        fastestWpm = wpm > fastestWpm ? wpm : fastestWpm;
        averageWpm = ((averageWpm * gamesPlayed) + wpm) / (gamesPlayed + 1);
        Users.updateOne({ username }, {
          gamesPlayed: gamesPlayed + 1,
          fastestWpm: fastestWpm,
          averageWpm: averageWpm
        }, (err) => {
          if (err) console.error('error updating user stats', err);
          else res.status(201).send('successfully updated stats')
        })
      } else {
        res.status(201).send('error updating stats');
      }
    }
  })
}

module.exports = { postSignupInfo, postLoginInfo, getGameStats, postGameStats };