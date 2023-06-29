'use strict';

const path           = require('path');
// Express.jsのRouterをロード -------------------------------------------------
const router         = require('express').Router();
const dataStorage    = require(`../${process.env.npm_lifecycle_event}`);
const { v4: uuidv4 } = require('uuid');

// ホームページの経路を作る、public/index.htmlの配信
router.get('/', (req, res) => {
  const options = {
    root     : path.join(__dirname, '../public'),
    dotfiles : 'deny',
    headers  : { 'x-timestamp': Date.now(), 'x-sent': true }
  };
  res.sendFile('index.html', options, (error) => {
    if (error) { res.end(); }
    else { console.log('Server Message: Send:', 'index.html'); }
  });
});

router.post('/session/create', (req, res, next) => {
  // Ajaxでpostされたときの/user/loginのpostの処理
  console.log('ログイン処理開始');
  // データストレージからemailに一致するデータを取得する
  dataStorage.fetchByMailaddress(req.body.email, 'user')
    .then(records => {
      const user = records[0];
      if (user === undefined) {
        // 一致するemailがなければ401を返す
        console.log('一致するメールアドレスがありません')
        res.status(401);
        res.end();
        return;
      }

      // 該当するemailがありパスワードが一致していれば200を返す
      if (req.body.password === user.password) {
        console.log('ログイン処理を行います')
        req.session.regenerate((err) => {
          if (!err) {
            console.log('セッションにユーザ情報を追加しました')
            console.log(user);
            req.session.user = user;
            res.status(200).json(user);
            res.end();
            return;
          }
          else {
            console.log('Session処理でエラーが発生しました')
            res.status(401);
            res.end();
            return;
          }
        });
      }
      // パスワードが一致していなければ401を返す
      else {
        console.log('パスワードが一致しません')
        res.status(401);
        res.end();
        return;
      }
    }, next)
});

// ------ 認証されているかどうかの判定処理 -------------------------------------
router.get('/session/read', (req, res) => {
  if (req.session.user) {
    console.log(
      'Server Message: GET /session/readに200(Authenticatd)を返しました'
    );
    res.status(200);
    res.send(JSON.stringify(req.session.user));
    res.end();
  }
  else {
    // Non-Authoritative Informationのコード 203を返す
    console.log(
      'Server Message: GET /session/read に203(Non-Authoritative)を返しました'
    );
    res.status(203);
    res.send({ email: 'anonymous' });
    res.end();
  }
});

// ------ Ajaxの/user/logoutのget処理 ------------------------------------------
// ログアウトの処理
router.get('/session/delete', (req, res) => {
  req.session.destroy(() => {
    res.status(200);
    res.end();
    return;
  });
});

// Ajaxリクエストのフォームデータを処理する
router.post('/user/create', (req, res, next) => {
  const { first, last, email, password } = req.body;
  // バリデーションが失敗したらステータスコード400(Bad Request)を返す
  if (typeof first !== 'string' || !first) {
    const err = new Error('first is required');
    err.statusCode = 400;
    return next(err);
  }
  if (typeof last !== 'string' || !last) {
    const err = new Error('last is required');
    err.statusCode = 400;
    return next(err);
  }
  if (typeof email !== 'string' || !email) {
    const err = new Error('email is required');
    err.statusCode = 400;
    return next(err);
  }
  if (typeof password !== 'string' || !password) {
    const err = new Error('password is required');
    err.statusCode = 400;
    return next(err);
  }
  dataStorage.isDupulicated({ email: email }, 'user')
    // status 409: Emailがすでに登録されている
    .then(dupulicated => {
      if (dupulicated) {
        console.log('重複したメールアドレスがあります')
        const err = new Error('入力されたメールアドレスはすでに使われています');
        err.statusCode = 409;
        res.status(409)
        .json([{
            value : 'req.body.email',
            msg   : err.message, param : 'email'
          }]);
        res.end();
        return;
      }
      else {
        // バリデーションが成功していればデータストレージに格納する
        const user = {
          id       : uuidv4(),
          first    : first,
          last     : last,
          email    : email,
          password : password
        }
        dataStorage.create(user, 'user')
          .then(() => {
            req.session.user = user;
            res.status(201).json(user);
          }, next)
      }
    })
  return next;
});

// 同じディレクトリにある全部の経路モジュールをロード ----------------
// const userRoutes = require('./userRoutes');
// const usersRoutes = require('./usersRoutes');
// const sessionRoutes = require('./sessionRoutes');
// const errorRoutes = require('./errorRoutes');

// 関連する経路モジュールからの経路を、名前空間付きで使う ------------
// router.use('/user', userRoutes);
// router.use('/users', usersRoutes);
// router.use('/session', sessionRoutes);

// router.use('/', errorRoutes);

// index.jsからルータをエクスポート ----------------------------------
module.exports = router;
