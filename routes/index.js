'use strict;'

// Express.jsのRouterをロード ----------------------------------------
const router = require('express').Router();

// 同じディレクトリにある全部の経路モジュールをロード ----------------
const userRoutes = require('./userRoutes');
const usersRoutes = require('./usersRoutes');
const sessionRoutes = require('./sessionRoutes');
const homeRoutes = require('./homeRoutes');
const errorRoutes = require('./errorRoutes');

// 関連する経路モジュールからの経路を、名前空間付きで使う ------------
router.use('/user', userRoutes);
router.use('/users', usersRoutes);
router.use('/session', sessionRoutes);

router.use('/', homeRoutes);
router.use('/', errorRoutes);

// index.jsからルータをエクスポート ----------------------------------
module.exports = router;
