/*
 * routes.js
 * ルーティングを提供するモジュール
 */

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true, unparam : true
*/

/*global */
//------ モジュールスコープ変数開始 -----------
'use strict';
var
  configRoutes;
  // express = require('express'),
  // path    = require( 'path' ),
  // router  = express.Router();
//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 ---------------
configRoutes = function ( app, server ) {

  app.get('/', function( request, response ) {
    response.redirect( 'index.html' );
  });

};
//------ パブリックメソッド終了 ---------------
/* GET home page. */
// router.get('/', function( request, response ) {
//   // response.sendFile(
//   //   'pal.html',
//   //   { root: path.join( __dirname, '../public' ) }
//   // );
//   response.redirect( 'index.html' );
// 
// });
// 
// router.get('/users', function(request, response, next) {
//   response.send( "I'm the users page!" );
// });

// module.exports = router;
module.exports = { configRoutes: configRoutes };
