'use strict;'

// Express.jsのRouterと、ユーザコントローラをロードする --------------
const router = require('express').Router();
const usersController = require('../controllers/usersController');

// ------ Ajaxでpostされたときの/user/loginのpostの処理 --------------
router.post('/session/create', usersController.authenticateAjax);

// ------ Ajaxの/user/logoutのget処理 --------------------------------
router.get('/session/delete', (req, res) => {
  // ------ ログアウトの処理 -----------------------------------------
  req.logout();

  res.status(200);
  res.end();
  return;
});

// ------ 認証されているかどうかの判定処理 ---------------------------
router.get('/session/read', (req, res) => {
  // ------ req.isAuthenticated()は認証されていればtrueを返す --------
  if (req.isAuthenticated()) {
    res.status(200);
    res.send( JSON.stringify( req.user ) );
    res.end();
  }
  else {
    // Non-Authoritative Informationのコード 203を返す
    res.status(203);
    res.send({ email: 'anonymous' });
    res.end();
  }
});
// ------ ここからAjaxの処理/終了 ------------------------------------
// このモジュールのルータをエクスポート ------------------------------
module.exports = router;
