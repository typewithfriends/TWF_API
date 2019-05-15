const router = require('express').Router();
const { postSignupInfo, postLoginInfo, getGameStats, postGameStats } = require('./controller.js');

router.route('/users/signup')
  .post(postSignupInfo);

router.route('/users/login')
  .post(postLoginInfo)

router.route('/users/stats/:username')
  .get(getGameStats)

router.route('/userstats')
  .post(postGameStats)

module.exports = router;