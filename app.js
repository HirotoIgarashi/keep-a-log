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

// この行は70桁です --------------------------------------------------
// ---------------- モジュールスコープ変数開始 -----------------------
'use strict';
// 待ち受けるポートの8000を定義する
const port = 8000;

// expressのモジュールをロードする
const express = require('express');

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
const router = require('./routes/index');

const morgan = require('morgan');

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
  console.log(
    'Server Message: Mongooseを使ってMongoDBに接続しました！'
  );
});

// Userモデルをロードする
const User = require('./models/user');

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

app.use(
  express.urlencoded({
    extended: false
  })
);

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
passport.use(User.createStrategy());

// ユーザデータのシリアライズ／デシリアライズを行うように、
// passportを設定する
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
app.use('/', router);
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

require('./controllers/chatController')(io);
require('./controllers/eventController')(io);

module.exports = server;
// ---------------- サーバ起動終了 ---------------------------------------------
