'use strict';
require('dotenv');
var axios = require('axios');
var crypto = require('crypto');

function parseError(err) {
  try {
    return new Error(err.response.data.error_description)
  } catch (e) {
    return err
  }
}

exports.getFacebookProfile = function (fields, accessToken, cb) {
  var appSecretProof = crypto.createHmac('sha256', process.env.FB_APP_SECRET).update(accessToken).digest('hex');
  var fieldsString = fields.join();

  axios.request({
    method: 'GET',
    url: 'https://graph.facebook.com/me?fields=' + fieldsString + '&access_token=' + accessToken + '&appsecret_proof=' + appSecretProof,
  }).then(function (res) {
    if (res && res.data) {
      cb(null, res.data);
    } else {
      var msg = 'Could not get Facebook profile.';
      return cb(new Error(msg));
    }
  }).catch(function(err){
    cb(parseError(err))
  })
};
