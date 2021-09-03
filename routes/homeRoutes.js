'use strict;'

const path = require('path');

const homeController = require('../controllers/homeController');

// Express.jsのRouterをロード ----------------------------------------
const router = require('express').Router();

// ホームページの経路を作る
router.get('/', (req, res) => {
  const options = {
    root: path.join( __dirname, '../public' ),
    dotfiles: 'deny',
    headers: { 'x-timestamp': Date.now(), 'x-sent': true }
  };

  res.sendFile('pal.html', options, (error) => {
    if (error) {
      res.end();
    }
    else {
      console.log( 'Server Message: Send:', 'pal.html' );
    }
  });
});

router.get('/chat', homeController.chat);

module.exports = router;
