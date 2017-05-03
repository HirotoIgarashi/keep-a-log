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
  http          = require( 'http' ),
  express       = require( 'express'        ),
  path          = require( 'path'           ),
  favicon       = require( 'serve-favicon'  ),
  logger        = require( 'morgan'         ),
  cookieParser  = require( 'cookie-parser'  ),
  bodyParser    = require( 'body-parser'    ),

  routes        = require( './lib/routes'   ),

  app           = express(                  ),
  server        = http.createServer( app );
// ---------------- モジュールスコープ変数終了 -------------------

// ---------------- サーバ構成開始 -------------------------------
app.set('port', process.env.PORT || 3000 );
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

});

// routes.jsのconfigRoutesメソッドを使ってルートを設定する
routes.configRoutes( app, server );

// ---------------- サーバ構成終了 -------------------------------

// ---------------- サーバ起動開始 -------------------------------
server.listen(app.get( 'port' ), function() {
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});
// ---------------- サーバ起動終了 -------------------------------
