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
  path    = require( 'path' ),
  fs      = require( 'fs' ),
  // crud    = require( './crud' ),
  action  = require( './action' ),
  configRoutes;

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 ---------------
configRoutes = function ( app, server ) {

  app.get('/', function( request, response ) {
    var
      options = { root      : path.join( __dirname, '../public' ),
                  dotfiles  : 'deny',
                  headers   : { 'x-timestamp': Date.now(), 'x-sent': true }
      };

    console.log( path.join( __dirname, '../public' ) );

    response.sendFile(
      'pal.html',
      options,
      function ( error ) {
        if ( error ) {
          console.log( error );
          response.status( error.status ).end();
        }
        else {
          console.log( 'Send:', 'pal.html' );
        }
      }
    );

  });

  app.post(
    '/session/create',
    function( request, response ) {
      var
        // email = request.body.email,
        email = request.body.email;
        // password = request.body.password,
        // find_map = { 'email'  : request.body.email };

      // 開発用に全てのリクエストに200を返す
      console.log(request);
      request.session.user = { email: email };
      response.status( 200 );
      response.end();

      // console.log ( find_map );
      // crud.read(
      //   'user',
      //   find_map,
      //   {},
      //   function( map_list ) {
      //     // console.log( map_list );
      //     if ( map_list.length !== 0 ) {
      //       // request.session.user = { email  : email };
      //       response.send( map_list );
      //     }
      //     else {
      //       // status Unauthorizedを返す
      //       response.status( 401 );
      //       response.end();
      //     }
      //   }
      // );
    }
  );

  app.get( '/markdown_image/:image_name', function( request, response ) {
    var
      headers,
      file_path;

    file_path = 'markdown_image/' + request.params.image_name;
    console.log( file_path + 'が呼ばれました' );

    fs.exists( file_path, function( exists ) {
      if ( exists ) {
        fs.readFile( file_path, function( err, data ) {
          // ここでコンテンツ配信とエラーハンドリングを行う
          if ( err ) {
            // エラーハンドリング
            response.writeHead( 500 );
            response.end( 'Server Error!' );
            return;
          }
          headers = { 'Content-Type': 'image/png' };
          console.log( 'headers:' );
          console.log( headers );
          response.writeHead( 200, headers );
          response.end( data );
        });
        return;
      }
      response.status( 404 );
      response.end( 'コンテンツが見つかりません' );
    });


  });

  app.all(
    '/:object/*?',
    function( request, response, next ) {
      response.contentType( 'json' );
      next();
    }
  );

  app.get(
    '/session/read',
    function (request, response) {
      console.log(request.session);
      console.log(request.query);
      if ( request.session.user ) {
        response.status( 200 );
        response.send( JSON.stringify( request.session.user ) );
        response.end();
      }
      else {
        // Non-Authoritative Informationのコード 203を返す
        response.status( 203 );
        response.send( { email: 'anonymous' } );
        response.end();
      }
    }
  );

  app.get(
    '/session/delete',
    function (request, response) {
      if ( request.session.user ) {
        request.session.destroy( function ( err ) {
          if ( err ) {
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

  action.connect( server );

};

module.exports = { configRoutes: configRoutes };
