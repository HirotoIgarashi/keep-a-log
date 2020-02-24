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

// ---------------- モジュールスコープ変数開始 -------------------
'use strict';
var
  http          = require( 'http'             ),
  express       = require( 'express'          ),
  path          = require( 'path'             ),
  favicon       = require( 'serve-favicon'    ),
  logger        = require( 'morgan'           ),
  session       = require( 'express-session'  ),
  bodyParser    = require( 'body-parser'      ),
  redis         = require( 'redis'            ),
  RedisStore    = require( 'connect-redis'    )( session ),
  client        = redis.createClient(         ),
  routes        = require( './lib/routes'     ),
  app           = express(                    ),
  server        = http.createServer( app      ),
  expire_time   = 1000 * 60 * 60 * 24 * 30;               // 30日
  // io            = require( 'socket.io'        )( server ),
  // send_date,
  // countIdx = 0;
// ---------------- モジュールスコープ変数終了 -------------------

// ---------------- ユーティリティメソッド開始 -------------------
// ---------------- ユーティリティメソッド終了 -------------------

// ---------------- サーバ構成開始 -------------------------------
app.set('port', process.env.PORT || 8000 );

// uncomment after placing your favicon in /public
app.use( favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger('dev'));
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended: false }));
// app.use( cookieParser());
app.use( session({
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
}) );
app.use( express.static( path.join(__dirname, '/public' )));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
// 
// });

// routes.jsのconfigRoutesメソッドを使ってルートを設定する
routes.configRoutes( app, server );

// ---------------- サーバ構成終了 -------------------------------

// ---------------- サーバ起動開始 -------------------------------
server.listen( app.get( 'port' ) );

console.log( 'Express server listening on port ' + app.get( 'port' ));

// ---------------- サーバ起動終了 -------------------------------
