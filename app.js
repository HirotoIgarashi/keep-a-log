/*
 * app.js - 汎用ルーティングを備えたExpressサーバ
*/
'use strict';

// ---------------- モジュールスコープ変数開始 -----------------------
// 待ち受けるポートの8000を定義する
const port = 8000;
// expressのモジュールをロードする
const express = require('express');
// expressアプリケーションをapp定数に代入
const app = express();
const { v4: uuidv4 } = require('uuid');
// 実行されたスクリプトの名前に応じてデータストレージの実装を使い分ける
const dataStorage = require(`./${process.env.npm_lifecycle_event}`);
// method-overrideモジュールをロードして
const methodOverride = require('method-override');
const path = require('path');
const favicon = require('serve-favicon');
// sessionの設定
const session = require('express-session');
// express-mysql-sessionを使う
const MySQLStore = require('express-mysql-session')(session);
const connectFlash = require('connect-flash');

// FIX: redis以外のストレージを使うようにする
// const redis = require('redis');
// const redisClient = redis.createClient();
// const RedisStore = require('connect-redis')(session);

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

// appの設定 start
app.use(express.static('public'));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// ミドルウェアとして使うようにアプリケーションルータを設定
app.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));
app.set('trust proxy', 1);

const options = {
    host: 'localhost',
    port: 3306,
    user: 'test_user',
    password: 'user_password',
    database: 'user_app'
};

app.use(session({
  secret: 'keepalog',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false,
    expires   : new Date(Date.now() + expire_time)
  },
// TODO: redis以外のストレージを使うようにする
  // store   : new RedisStore({
  //   host       : 'localhost',
  //   port       : 6379,
  //   client     : redisClient,
  //   disableTTL : true
  // })
// express-mysql-sessionを使ってみる
  store   : new MySQLStore(options)
}));
// URLエンコードされたデータを解析する
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
// connect-flashをミドルウェアとして使う -----------------------------
app.use(connectFlash());
// フラッシュメッセージをレスポンスのローカル変数flashMessagesに代入 -
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
// morganの「combined」フォーマットでログを出すように指示します。 ----
app.use(morgan('combined'));
// appの設定 end

// ホームページの経路を作る、pal.htmlの配信
app.get('/', (req, res) => {
  const options = {
    root: path.join(__dirname, './public'),
    dotfiles: 'deny',
    headers: { 'x-timestamp': Date.now(), 'x-sent': true }
  };

  res.sendFile('pal.html', options, (error) => {
    if (error) {
      res.end();
    }
    else {
      console.log('Server Message: Send:', 'pal.html');
    }
  });
});

// --- Ajaxでpostされたときの/user/loginのpostの処理 ------------
app.post('/session/create', (req, res, next) => {
  console.log('ログイン処理開始');

  // データストレージからemailに一致するデータを取得する
  dataStorage.fetchByMailaddress(req.body.email, 'user')
    .then(records => {
      const user = records[0];

      // 一致するemailがなければ401を返す
      if (user === undefined) {
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
            // req.session.username = user.email;
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

// ------ 認証されているかどうかの判定処理 ---------------------------
app.get('/session/read', (req, res) => {
  if (req.session.user) {
    console.log('Server Message: GET /session/read に200(Authenticatd)を返しました');
    res.status(200);
    res.send(JSON.stringify(req.session.user));
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

// ------ Ajaxの/user/logoutのget処理 --------------------------------
app.get('/session/delete', (req, res) => {
  // ------ ログアウトの処理 -----------------------------------------
  req.session.destroy(() => {
    res.status(200);
    res.end();
    return;
  });
});

// Ajaxリクエストのフォームデータを処理する
app.post('/user/create', (req, res, next) => {
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
    .then(dupulicated => {
      if (dupulicated) {
        console.log('重複したメールアドレスがあります')
        // status 409: Emailがすでに登録されている
        const err = new Error('入力されたメールアドレスはすでに使われています');
        err.statusCode = 409;
        res.status(409)
        .json([{
          value: 'req.body.email',
          msg: err.message, param: 'email'
        }]);
        res.end();
        return;
      }
      else {
        // バリデーションが成功していればデータストレージに格納する
        const user = {
          id: uuidv4(),
          first: first, last: last,
          email: email, password: password
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
// app.post('/user/creat', () => {
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
// app.use((err, req, res, next) => {
app.use((err, req, res ) => {
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
