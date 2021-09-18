/*
 * app.js - 汎用ルーティングを備えたExpressサーバ
*/

// ---------------- モジュールスコープ変数開始 -----------------------
'use strict';
// 待ち受けるポートの8000を定義する
const port = 8000;

// expressのモジュールをロードする
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// 実行されたスクリプトの名前に応じてデータストレージの実装を使い分ける
const dataStorage = require(`./${process.env.npm_lifecycle_event}`);
// const { check, validationResult } = require('express-validator');

// expressアプリケーションをapp定数に代入
const app = express();

// method-overrideモジュールをロードして
const methodOverride = require('method-override');

const path = require('path');

const favicon = require('serve-favicon');

const expressSession = require('express-session');

const connectFlash = require('connect-flash');

// passportモジュールをロード
const passport = require('passport');

const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);
const client = redis.createClient();

// Express.jsのRouterをロード ----------------------------------------
// const router = require('./routes/index');

const morgan = require('morgan');

// Userモデルをロードする
// const User = require('./models/user');

// セッションのタイムアウト時間を30日に設定する
const expire_time = 1000 * 60 * 60 * 24 * 30;

// ---------------- モジュールスコープ変数終了 -----------------------

// ---------------- ユーティリティメソッド開始 -----------------------
// ---------------- ユーティリティメソッド終了 -----------------------

// ---------------- サーバ構成開始 -----------------------------------
// トークンを利用する ------------------------------------------------
app.set('token', process.env.TOKEN || 'paltoken');

// テストなら、ポート8001を使う
if (process.env.NODE_ENV === 'test') {
  app.set('port', 8001 );
}
// デフォルトは、port変数に従う
else {
  app.set('port', process.env.PORT || port );
}

// ejsテンプレートを使う
app.set('view engine', 'ejs');

console.log(`Server Message: Expressが使っているビューエンジンは\
${app.get('view engine')} です`);

app.use(express.static('public'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// ミドルウェアとして使うようにアプリケーションルータを設定
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));

// URLエンコードされたデータを解析する
app.use(express.json());

app.use(express.urlencoded(
  { extended: false }
));

app.use(expressSession({
  secret  : 'keepalog',
  cookie  : {
    secure    : false,
    httpOnly  : false,
    expires   : new Date(Date.now() + expire_time)
  },
  store   : new RedisStore({
    host       : 'localhost',
    port       : 6379,
    client     : client,
    disableTTL : true
  }),
  saveUninitialized : false,
  resave            : false
}));

// connect-flashをミドルウェアとして使う -----------------------------
app.use(connectFlash());

// フラッシュメッセージをレスポンスのローカル変数flashMessagesに代入 -
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

// ------------------ passportの設定開始 -----------------------------
// passportを初期化
app.use(passport.initialize());

// Express.jsのセッションを使うようにpassportを設定する
app.use(passport.session());

// Userのログインストラテジーを設定
// passport.use(User.createStrategy());

// ユーザデータのシリアライズ／デシリアライズを行うように、
// passportを設定する
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// ------------------ passportの設定終了 -----------------------------
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

// morganの「combined」フォーマットでログを出すように指示します。 ----
app.use(morgan('combined'));

// routes/index.jsを使う ---------------------------------------------
// app.use('/', router);

// const homeController = require('./controllers/homeController');

// pal.htmlの配信
// ホームページの経路を作る
app.get('/', (req, res) => {
  const options = {
    root: path.join( __dirname, './public' ),
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

// ------ Ajaxでpostされたときの/user/loginのpostの処理 --------------
app.post('/session/create', (req, res, next) => {
  // usersController.authenticateAjax
  // ----- Ajaxのときのpassportのローカルストレージでユーザを認証-----
  // function(req, res) {
  console.log('authenticateAjax処理開始');
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(401);
      res.end();
      return;
    }

    if (user) {
      // ----- ログイン処理 ------------------------------------------
      // req.login(user, function(err) {
      req.login(user, (err) => {
        if (err) {
          res.status(401);
          res.end();
          return;
        }
        res.status(200).jsonp(user);
        res.end();
        return;
      });
    }
    else {
      res.status(401).jsonp(info);
      res.end();
      return;
    }
    })(req, res);
  },
);

// ------ Ajaxの/user/logoutのget処理 --------------------------------
app.get('/session/delete', (req, res) => {
  // ------ ログアウトの処理 -----------------------------------------
  req.logout();
  res.status(200);
  res.end();
  return;
});

// ------ 認証されているかどうかの判定処理 ---------------------------
app.get('/session/read', (req, res) => {
  // ------ req.isAuthenticated()は認証されていればtrueを返す --------
  if (req.isAuthenticated()) {
    console.log('Server Message: GET /session/read に200(Authenticatd)を返しました');
    res.status(200);
    res.send( JSON.stringify( req.user ) );
    res.end();
  }
  else {
    // Non-Authoritative Informationのコード 203を返す
    console.log('Server Message: GET /session/read に203(Non-Authoritabive)を返しました');
    res.status(203);
    res.send({ email: 'anonymous' });
    res.end();
  }
});

// Ajaxリクエストのフォームデータを処理する
app.post('/user/create', (req, res, next) => {
  const { first, last, email, password } = req.body;
  console.log(first);
  console.log(last);
  console.log(email);
  console.log(password);
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

  dataStorage.fetchAll('user')
    .then(users => {
      console.log(`users: ${users}`);
      // メールアドレスが重複していたらステータスコード509()を返す
      for (const user of users) {
        if (user.email === email) {
          console.log('重複したメールアドレスがあります')
          // status 409: Emailがすでに登録されている
          const err = new Error('email addres is duplicated');
          err.statusCode = 409;
          res.status(409)
            .json([{
              value: 'req.body.email',
              msg: err.message, param: 'email'
          }]);
          res.end();
          // return next(err);
          return;
        }
      }
      // バリデーションが成功していればデータストレージに格納する
      const user = {
        id: uuidv4(),
        first: first, last: last,
        email: email, password: password
      }
      console.log(user);
      dataStorage.create(user, 'user')
        .then(() => res.status(201).json(user), next)
    })

  // データストレージへの格納が失敗したらステータスコード500(?)を返す
  // データストレージへの格納が成功したらステータスコード201(Created)を返す
  // res.status(201).json({ first: first, last: last, email: email, password: password })
  // res.end();
});
// app.post('/user/create', () => {
//   // usersController.validateItem(),
//   // ----- validateする項目を定義する --------------------------------
//   // バリデーションルール
//   return [
//     // textフィールドの前後の空白を取り除きHTMLエスケープします
//     check('text').trim().escape(),
//     check('email')
//       .isEmail().withMessage(
//         '正しいEメールアドレスである必要があります'
//       )
//       .normalizeEmail(),
//     check('password').isLength({min: 5}).withMessage(
//       'パスワードは少なくとも5桁必要です。'
//     ),
//     check('zipCode')
//       .isLength({min: 7, max: 7}).withMessage(
//         '郵便番号は7桁必要です。'
//       )
//       .isInt().withMessage('郵便番号には数字を入力して下さい。')
//   ];
// },
// // ----- validate関数を定義する ------------------------------------
// // usersController.validateAjax
// // ------ Ajaxでpostされたときのvalidate関数を追加 -----------------
// (req, res) => {
//   const getUserParams = body => {
//     return {
//       name: {
//         first: body.first,
//         last: body.last
//       },
//       email: body.email,
//       password: body.password,
//       zipCode: body.zipCode
//     };
//   };
//   //------ 検証結果を格納する --------------------------------------
//   const result = validationResult(req);
//
//   // 検証結果にエラーがあれば --------------------------------------
//   if (!result.isEmpty()) {
//     let messages = result.array().map(e => {
//       return {value: e.value, msg: e.msg, param: e.param};
//     });
//     res.status(422).jsonp(messages);
//     res.end();
//   }
//   else {
//     //----- Ajaxのパラメータでユーザを作る -------------------------
//     let newUser = new User(getUserParams(req.body));
//
//     // フォームのパラメータでユーザを作る
//     User.register(newUser, req.body.password, (error, user) => {
//       if (user) {
//         // status 201: Created リクエストは成功し、その結果新たな
//         // リソースが作成された
//         res.status(201);
//         res.end();
//       }
//       else {
//         if (error.name === 'UserExistsError') {
//           console.log(
//             `ユーザアカウントの作成のエラー: ${error.message}`
//           );
//           // status 409: Emailがすでに登録されている
//           res.status(409)
//             .jsonp([{
//               value: 'req.body.email',
//               msg: error.message, param: 'email'
//           }]);
//           res.end();
//         }
//         else {
//           console.log(`不明のエラー: ${error.name}`);
//           console.log(`不明のエラー: ${error.message}`);
//           res.status(422).jsonp(error.message);
//           res.end();
//         }
//       }
//     });
//   }
//   return;
// }
// );
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({ error: err.message });
});

// app.get('/chat', homeController.chat);

// ---------------- サーバ構成終了 -----------------------------------

// ---------------- サーバ起動開始 -----------------------------------
let server;
if (process.env.NODE_ENV === 'test') {
  server = app.listen('8001', () => {
  console.log(
    'Server Message: The Express.js server has started and is\
 listening on port number:' + `${app.get('port')}`);
  });
}
else {
  server = app.listen(port, () => {
  console.log(
    'Server Message: The Express.js server has started and is\
 listening on port number:' + `${app.get('port')}`);
  });
}

// サーバのインスタンスをsocket.ioに渡す -----------------------------
const io = require('socket.io')(server);

// require('./controllers/chatController')(io);
require('./controllers/eventController')(io);

module.exports = server;
// ---------------- サーバ起動終了 ---------------------------------------------
