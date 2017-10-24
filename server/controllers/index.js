'use strict';

const { Router } = require('express');
const morgan = require('morgan');

const apiController = require('./api');


const router = new Router();

// Access logs
router.use(morgan('combined'));


// Return React app if user is authenticated or redirect to login
router.get('/', (req, res, next) => {
  res.render('app.html');
});


router.get('/robots.txt', (req, res, next) => {
  res.type('text/plain').send('User-agent: *\r\nDisallow: /');
});


// Add controllers
router.use('/api', apiController);


module.exports = router;
