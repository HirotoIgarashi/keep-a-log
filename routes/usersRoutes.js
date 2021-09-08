'use strict';

// Express.jsのRouterと、ユーザコントローラをロードする --------------
const router = require('express').Router();
const usersController = require('../controllers/usersController');

// Createリクエストの処理でフォームを供給する
router.get('/new', usersController.new);

// どのリクエストでも処理の前にtokenの検証を実行する -----------------
// router.use(usersController.verifyToken);

// ------ /user/createのpostの処理 -----------------------------------
// /users/loginに向かうGETリクエストを処理する経路
router.get('/login', usersController.login);

// 同じパスに向かうPOSTリクエストを処理する経路
router.post('/login', usersController.authenticate);

// Createのフォームからデータを送出するリクエストを処理し、
// ビューを表示する
router.post(
  '/create',
  usersController.validateItem(),
  usersController.validate,
  usersController.create,
  usersController.redirectView
);

// インデックス経路を作成
router.get('/', usersController.index, usersController.indexView);

// ユーザをshowで表示する
router.get('/:id', usersController.show, usersController.showView);

// 編集リクエストを処理する経路
router.get('/:id/edit', usersController.edit);

// Editフォームからのデータを処理して、ユーザShowページを表示
router.put(
  '/:id/update',
  usersController.validateItem(),
  usersController.validate,
  usersController.update,
  usersController.redirectView
);

// ユーザdelete処理を追加
router.delete(
  '/:id/delete',
  usersController.delete,
  usersController.redirectView
);

// このモジュールのルータをエクスポート ------------------------------
module.exports = router;
