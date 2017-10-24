'use strict';

const { Router } = require('express');
const responseTime = require('response-time');

const version = require('../version');
const sherpa = require('../lib/sherpa');
const User = require('../models/User');
const librato = require('../lib/librato');


const router = new Router();


// Log request count and response time to librato
router.use(responseTime((req, res, time) => {
  // General counts and meassurements
  librato.increment(null, 'count');
  librato.measure(null, 'response-time', time);

  // Path specific measurements
  librato.increment(req, 'count');
  librato.measure(req, 'response-time', time);
}));


// Helpers
const setTokenHeaders = (res, user) => {
  if (
    user.OAuthTokens &&
    user.OAuthTokens.access_token &&
    user.OAuthTokens.refresh_token
  ) {
    res.header('ADMIN-AT', user.OAuthTokens.access_token);
    res.header('ADMIN-RT', user.OAuthTokens.refresh_token);
  }
};


// Add version header
router.use((req, res, next) => {
  res.header('ADMIN-VERSION', version.tag);
  next();
});


// Return version
router.get('/version', (req, res, next) => {
  res.json({version: version.tag});
});


// Get user data from Sherpa
router.get('/user/me', (req, res, next) => {
  const accessToken = req.get('ADMIN-AT');
  const refreshToken = req.get('ADMIN-RT');

  if (!accessToken || !refreshToken) {
    // Tokens are not set, return empty user object (logout)
    librato.increment(req, 'missing-tokens');
    res.json({user: {}});
  } else {
    // Attempt to load user data from sherpa using tokens

    // Initiate user
    const user = User();
    user.setTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Load sherpa data
    user.loadSherpaData()
      .then(() => {
        // Set access and refresh token as header values
        setTokenHeaders(res, user);

        // Return user data
        if (user.id) {
          librato.increment(req, 'ok');
          res.json({user: user.getAPIRepresentation()});
        } else {
          librato.increment(req, 'invalid-tokens');
          res.json({user: {}});
        }
      })
      .catch((err) => {
        const error = err.message || 'error';
        librato.increment(req, 'error');
        res.json({error});
      });
  }
});


module.exports = router;
