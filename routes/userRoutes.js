'use strict';

// Express.jsのRouterをロード ----------------------------------------
const router = require('express').Router();
const usersController = require('../controllers/usersController');

// Ajaxリクエストのフォームデータを処理する
router.post('/create',
            usersController.validateItem(),
            usersController.validateAjax
           );

module.exports = router;
