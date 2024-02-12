/*
 * app.js - Expressサーバ
*/
'use strict';

// -----------------------------------------------------------------------------
// ---------------- モジュールスコープ変数開始 ---------------------------------
const express        = require('express');   // expressのモジュールをロードする
const app            = express();     // expressアプリケーションをapp定数に代入
const logger         = require('morgan');
const methodOverride = require('method-override');

const port           = 8000    // 待ち受けるポートを8000に設定する
const path           = require('path');
const favicon        = require('serve-favicon');
const connectFlash   = require('connect-flash');
// セッションのタイムアウト時間を30日に設定する
//                     1秒  * 分 * 時 * 日 * 30日
const expire_time    = 1000 * 60 * 60 * 24 * 30;
// ---------------- モジュールスコープ変数終了 ---------------------------------

// ---------------- サーバ構成開始 ---------------------------------------------
// ejsテンプレートを使う
// app.set('view engine', 'ejs');
console.log(
  `Server Message: Expressが使っているビューエンジンは\
${app.get('view engine')}です。`
);

// ミドルウェアとして使うようにアプリケーションルータを設定
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.static('public'));    // appの設定 start
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// sessionの処理
const session        = require('express-session');    // sessionの設定
const RedisStore     = require('connect-redis')(session);
// TODO: redisのバージョンは3.0.0である必要があります
const redisClient    = require('redis').createClient();
app.set('trust proxy', 1); // trust first proxy
app.use(session(
  { 
    store             : new RedisStore({ client: redisClient}),
    secret            : 'keepalog',
    resave            : false,
    saveUninitialized : false,
    cookie : {
      secure   : false,
      httpOnly : false,
      expires  : new Date(Date.now() + expire_time)
    } 
  }
));
// URLエンコードされたデータを解析する
app.use(express.json());
app.use(express.urlencoded( { extended: false } ));
app.use(connectFlash());      // connect-flashをミドルウェアとして使う
// フラッシュメッセージをレスポンスのローカル変数flashMessagesに代入
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
// morganのcombinedフォーマットでログを出すように指示します。
app.use(logger('combined'));

const router = require('./routes/router.js');
app.use('/', router);

// ---------------- サーバ構成終了 ---------------------------------------------

// ---------------- サーバ起動開始 ---------------------------------------------
let server;
if (process.env.NODE_ENV === 'test') {
  server = app.listen('8001', () => {
    console.log(
'Server Message: The Express.js server has started and is listening on port \
number:' + `${app.get('port')}`); 
  });
}
else {
  server = app.listen(
    port,
    () => {
      console.log(
'Server Message: The Express.js server has started and is listening on port \
number:' + port
      ); 
    }
  );
}

// サーバのインスタンスをsocket.ioに渡す
const io = require('socket.io')(server);
require('./controllers/eventController')(io);

module.exports = server;
// ---------------- サーバ起動終了 ---------------------------------------------
