/*
 * app.js - 汎用ルーティングを備えたExpressサーバ
*/

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true, unparam : true
*/
/*global */

// この行は80桁です ------------------------------------------------------------
// ---------------- モジュールスコープ変数開始 ---------------------------------
'use strict';
// 待ち受けるポートの8000を定義する
const port = 8000;

// expressのモジュールをロードする
const express = require('express');

// expressアプリケーションをapp定数に代入
const app = express();

// method-overrideモジュールをロードして
const methodOverride = require('method-override');

const favicon = require('serve-favicon');

const expressSession = require('express-session');

const connectFlash = require('connect-flash');

// passportモジュールをロード
const passport = require('passport');

const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);
const client = redis.createClient();

// userControllをロードする
const usersController = require('./controllers/usersController');

// Express.jsのRouterモジュールを使う
const router = express.Router();

const errorController = require('./controllers/errorController');

const path = require('path');

const morgan = require('morgan');
  // io            = require( 'socket.io'        )( server ),
  // send_date,
  // countIdx = 0;
// mongooseをロード
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// データベース接続を設定
// テスト環境ではテスト用データベースを使う
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(
    'mongodb://localhost:27017/pal_test_db',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  );
}
// デフォルトでは公開用のデータベースを使う
else {
  mongoose.connect(
    'mongodb://localhost:27017/pal',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  );
}

// データベースをdb変数に代入
const db = mongoose.connection;

db.once('open', () => {
  // 「Mongooseを使ってMongoDBに接続できました！」
  console.log('Server Message: Mongooseを使ってMongoDBに接続しました！');
});

// Userモデルをロードする
const User = require('./models/user');

// セッションのタイムを30日に設定する
const expire_time = 1000 * 60 * 60 * 24 * 30;

const {validationResult} = require('express-validator');
// ---------------- モジュールスコープ変数終了 ---------------------------------

// ---------------- ユーティリティメソッド開始 ---------------------------------
// ---------------- ユーティリティメソッド終了 ---------------------------------

// ---------------- サーバ構成開始 ---------------------------------------------
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

console.log(`Server Message: Expressが使っているビューエンジンは ${app.get('view engine')} です`);

app.use(express.static('public'));

app.use(errorController.logError);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// ミドルウェアとして使うようにアプリケーションルータを設定
router.use(methodOverride('_method', {
  methods: ['POST', 'GET']
}));

// URLエンコードされたデータを解析する
router.use(express.json());

router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(expressSession({
  secret  : 'keepalog',
  cookie  : {
    secure    : false,
    httpOnly  : false,
    // expires   : new Date(Date.now() + 4 * 404800000) 
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

// connect-flashをミドルウェアとして使う
router.use(connectFlash());

// フラッシュメッセージをレスポンスのローカル変数flashMessagesに代入
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

// ------------------ passportの設定開始 ---------------------------------------
// passportを初期化
router.use(passport.initialize());

// Express.jsのセッションを使うようにpassportを設定する
router.use(passport.session());

// Userのログインストラテジーを設定
passport.use(User.createStrategy());

// ユーザデータのシリアライズ／デシリアライズを行うように、passportを設定する
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ------------------ passportの設定終了 ---------------------------------------

// morganの「combined」フォーマットでログを出すように指示します。
app.use(morgan('combined'));

// ミドルウェアとルーティングのシステムとしてrouterオブジェクトを使う
app.use('/', router);

// ホームページの経路を作る
router.get('/', (req, res) => {
  const options = {
    root      : path.join( __dirname, '/public' ),
    dotfiles  : 'deny',
    headers   : { 'x-timestamp': Date.now(), 'x-sent': true }
  };

  console.log(options.root);

  res.sendFile('pal.html', options, (error) => {
      if (error) {
        console.log(error);
        // res.status(error.status).end();
        res.end();
      }
      else {
        console.log( 'Server Message: Send:', 'pal.html' );
      }
    }
  );
});

router.post('/session/create', (request, response) => {
    let email = request.body.email;

    // 開発用に全てのリクエストに200を返す
    request.session.user = { email: email };
    response.status(200);
    response.end();
  }
);

router.get('/session/read', (request, response) => {
    if ( request.session.user ) {
      response.status(200);
      response.send( JSON.stringify( request.session.user ) );
      response.end();
    }
    else {
      // Non-Authoritative Informationのコード 203を返す
      response.status(203);
      response.send( { email: 'anonymous' } );
      response.end();
    }
  }
);

router.get('/session/delete', (request, response) => {
    if ( request.session.user ) {
      request.session.destroy((err) => {
        if (err) {
          response.status( 500 );
          response.end();
        }
        else {
          response.status( 200 );
          response.end();
        }
      });
    }
  }
);

// ------ /user/createのpostの処理 -----------------------------------
// Ajaxリクエストのフォームデータを処理する
router.post(
  '/user/create',
  usersController.validateItem(),
  // usersController.validateAjax
  (req, res) => {
    const getUserParams = body => {
      return {
        name: {
          first: body.first,
          last: body.last
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode
      };
    };

    // 検証
    const result = validationResult(req);

    if (!result.isEmpty()) {
      let messages = result.array().map(e => {
        return {value: e.value, msg: e.msg, param: e.param};
      });

      res.status(422).jsonp(messages);
      res.end();
    }
    else {
      // Ajaxのパラメータでユーザを作る
      let newUser = new User(getUserParams(req.body));

      // フォームのパラメータでユーザを作る
      User.register(newUser, req.body.password, (error, user) => {
        if (user) {
          res.status(200);
          res.end();
        }
        else {
          if (error.name === 'UserExistsError') {
            console.log(`ユーザアカウントの作成のエラー: ${error.message}`);
            res.status(422).jsonp([{value: 'req.body.email', msg: error.message, param: 'email'}]);
            res.end();
          }
          else {
            console.log(`不明のエラー: ${error.name}`);
            console.log(`不明のエラー: ${error.message}`);
            res.status(422).jsonp(error.message);
            res.end();
          }
        }
      });
    }
    return;
  }
);

// インデックス経路を作成
router.get('/users', usersController.index, usersController.indexView);

// /users/loginに向かうGETリクエストを処理する経路
router.get('/users/login', usersController.login);

// 同じパスに向かうPOSTリクエストを処理する経路
// router.post('/users/login', usersController.authenticate,
//             usersController.redirectView);
router.post('/users/login', usersController.authenticate);

// Createリクエストの処理でフォームを供給する
router.get('/users/new', usersController.new);

// Createのフォームからデータを送出するリクエストを処理し、ビューを表示する
router.post(
  '/users/create',
  usersController.validateItem(),
  usersController.validate,
  usersController.create,
  usersController.redirectView
);

// ユーザをshowで表示する
router.get('/users/:id', usersController.show, usersController.showView);

// 編集リクエストを処理する経路
router.get('/users/:id/edit', usersController.edit);

// Editフォームからのデータを処理して、ユーザShowページを表示
router.put(
  '/users/:id/update',
  usersController.validateItem(),
  usersController.validate,
  usersController.update,
  usersController.redirectView
);

// ユーザdelete処理を追加
router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

// エラー処理のミドルウェアをmain.jsに追加
app.use(errorController.respondNoResouceFound);
app.use(errorController.respondInternalError);

// ---------------- サーバ構成終了 ---------------------------------------------

// ---------------- サーバ起動開始 ---------------------------------------------
let server;
if (process.env.NODE_ENV === 'test') {
  server = app.listen('8001', () => {
  console.log( 'Server Message: The Express.js server has started and is listening on port number:' + `${app.get('port')}`);
  });
}
else {
  server = app.listen(port, () => {
  console.log( 'Server Message: The Express.js server has started and is listening on port number:' + `${app.get('port')}`);
  });
}

// サーバのインスタンスをsocket.ioに渡す
const io = require('socket.io')(server);

module.exports = server;
// ---------------- サーバ起動終了 ---------------------------------------------
