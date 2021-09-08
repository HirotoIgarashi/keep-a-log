'use strict';

// Express.jsのRouterをロード ----------------------------------------
const router = require('express').Router();
const errorController = require('../controllers/errorController');

// エラー処理のミドルウェアをmain.jsに追加
router.use(errorController.logError);
router.use(errorController.respondNoResouceFound);
router.use(errorController.respondInternalError);

module.exports = router;
