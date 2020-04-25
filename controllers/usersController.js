// passportをロードする
const passport = require('passport');

// ----- ユーザモデルをロードする ------------------------------------
const User = require('../models/user');
const {check, validationResult} = require('express-validator');

// トークンをセットする ----------------------------------------------
// const token = process.env.TOKEN || 'paltoken';

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

module.exports = {
  getUserParams,
  // ----- 全てのユーザを取得してレスポンスする ----------------------
  index: (req, res, next) => {
    User.find({})
      // ユーザデータをレスポンスに格納し、次のミドルウェア関数を
      // 呼び出す
      .then(users => {
        res.locals.users = users;
        next();
      })
      // エラーをキャッチしたら次のミドルウェア関数に渡す
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  // ----- 別のアクションでビューのレンダリングを行う ----------------
  indexView: (req, res) => {
    res.render('users/index', {
      flashMessages: {
        success: 'すべてのユーザ情報をロードしました。'
      }
    });
  },
  // ----- フォームをレンダリングするnewアクションを追加 -------------
  new: (req, res) => {
    res.render('users/new');
  },
  // ----- Ajaxのパラメータでユーザを作る ----------------------------
  createByAjax: (req, res) => {
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
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      let messages = errors.array().map(e => e.msg);

      console.log(messages);

      // 422: Unprocessable Entity: 入力値の検証の失敗 ---------------
      res.status(422).jsonp(messages);
      res.end();
    }
    else {
      // Ajaxのパラメータでユーザを作る
      let newUser = new User(getUserParams(req.body));

      // フォームのパラメータでユーザを作る
      User.register(newUser, req.body.password, (error, user) => {

        console.log('user:');
        console.log(user);

        if (user) {
          res.status(201);
          res.end();
        }
        else {
          console.log(`ユーザアカウントの作成のエラー: ${error.message}`);
          // 409: Conflict: 競合 現在のリソースと競合する ------------
          res.status(409);
          res.end();
        }
      });
    }
    return;
  },
  // ----- フォームのパラメータでユーザを作る ------------------------
  create: (req, res, next) => {
    let newUser = new User(getUserParams(req.body));

    // バリデーションエラーが発生したので、ユーザデータを処理せず、
    // redirectViewアクションまでスキップする
    if (req.skip) {
      next();
      return;
    }

    // フォームのパラメータでユーザを作る
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        // 成功のフラッシュメッセージで応答する
        req.flash(
          'success',
          `${user.fullName}のアカウントの生成が成功しました。`
        );
        res.locals.redirect = '/users';
        next();
      }
      else {
        console.log(`ユーザアカウントの作成のエラー: ${error.message}`);
        // 失敗のフラッシュメッセージで応答する
        req.flash(
          'error',
          `次の理由でユーザアカウントの作成に失敗しました。: ${error.message}.`
        );
        res.locals.redirect = '/users/new';
        next();
      }
    });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;

    if (redirectPath) {
      res.redirect(redirectPath);
    }
    else {
      next();
    }
  },
  show: (req, res, next) => {
    // リクエストのパラメータからユーザIDを取り出す
    let userId = req.params.id;

    // そのIDを持つユーザを探す
    User.findById(userId)
      .then(user => {
        // レスポンスオブジェクト経由でユーザを次のミドルウェア関数に渡す
        res.locals.user = user;
        next();
      })
      .catch(error => {
        // 次の処理(showView)をスキップする
        req.skip = true;
        // エラーはロギングして次の関数に渡す
        console.log(`Error fetchin user by ID; ${error.message}`);
        next();
      });
  },
  showView: (req, res, next) => {
    if (req.skip) {
      next();
      return;
    }
    // showのビューをレンダリングする
    res.render('users/show');
  },
  // 編集のアクション
  edit: (req, res, next) => {
    let userId = req.params.id;

    // findByIdを使って、データベース内のユーザをIDで探す
    User.findById(userId)
      .then(user => {
        // 特定のユーザのためにユーザ編集ページをレンダリングする
        res.render('users/edit', {
          user: user
        });
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  // 更新のアクション
  update: (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };

    // バリデーションエラーが発生したので、ユーザデータを処理せず、
    // redirectViewアクションまでスキップする
    if (req.skip) {
      res.locals.redirect = `/users/${userId}/edit`;
      next();
    }
    else {
    // findByIdAndUpdateを使って、ユーザをIDで見つけた後
    // そのドキュメントレコードの更新を行う
      User.findByIdAndUpdate(userId, {
        $set: userParams
      })
        .then(user => {
          // 成功のフラッシュメッセージで応答する
          req.flash(
            'success',
            `${user.fullName}のアカウント情報の更新が成功しました。`
          );
          // ユーザをローカル変数としてレスポンスに追加し
          res.locals.redirect = `/users/${userId}`;
          res.locals.user = user;

          // 次のミドルウェア関数を呼び出す
          next();
        })
        .catch(error => {
          // 失敗のフラッシュメッセージで応答する
          req.flash(
            'error',
            `ユーザアカウント情報の更新に失敗しました。理由: ${error.message}.`
          );
          console.log(`IDによるユーザ情報の更新が失敗しました。: ${error.message}`);

          res.locals.redirect = `/users/${userId}/edit`;

          next();
        });
    }
  },
  // ----- ユーザを削除する ------------------------------------------
  delete: (req, res, next) => {
    let userId = req.params.id;
    // ユーザをfindByIdAndRemoveで削除

    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = '/users';
        next();
      })
      .catch(error => {
        console.error(`Error deleting user by ID: ${error.message}`);
        next(error);
      });
  },
  // ログインアクションを追加
  login: (req, res) => {
    res.render('users/login');
  },
  // ----- passportのローカルストレージでユーザを認証-----------------
  authenticate: passport.authenticate('local', {
    // 認証状態が成功か失敗で異なるフラッシュメッセージと
    // リダイレクトのパスを準備
    failureRedirect: '/users/login',
    failureFlash: 'Failed to login',
    successRedirect: '/',
    successFlash: 'Logged in!'
  }),

  // ----- Ajaxのときのpassportのローカルストレージでユーザを認証-----
  authenticateAjax: function(req, res) {
    console.log('authenticateAjax処理開始');
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        res.status(401);
        res.end();
        return;
      }

      if (user) {
        // ----- ログイン処理 ------------------------------------------
        req.login(user, function(err) {
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
  // ----- validateする項目を定義する --------------------------------
  validateItem: () => {
    // バリデーションルール
    return [
      // textフィールドの前後の空白を取り除きHTMLエスケープします
      check('text').trim().escape(),
      check('email')
        .isEmail().withMessage(
          '正しいEメールアドレスである必要があります'
        )
        .normalizeEmail(),
      check('password').isLength({min: 5}).withMessage(
        'パスワードは少なくとも5桁必要です。'
      ),
      check('zipCode')
        .isLength({min: 7, max: 7}).withMessage(
          '郵便番号は7桁必要です。'
        )
        .isInt().withMessage('郵便番号には数字を入力して下さい。')
    ];
  },
  // ----- validate関数を定義する ------------------------------------
  validate: (req, res, next) => {
      // 検証
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = errors.array().map(e => e.msg);

        // 次の処理(create)をスキップして、directViewを実行する
        req.skip = true;
        req.flash('error', messages.join(' また '));

        res.locals.redirect = '/users/new';
      }
      next();
  },
  // ------ Ajaxでpostされたときのvalidate関数を追加 -----------------
  validateAjax: (req, res) => {
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
    //------ 検証結果を格納する --------------------------------------
    const result = validationResult(req);

    // 検証結果にエラーがあれば --------------------------------------
    if (!result.isEmpty()) {
      let messages = result.array().map(e => {
        return {value: e.value, msg: e.msg, param: e.param};
      });

      res.status(422).jsonp(messages);
      res.end();
    }
    else {
      //----- Ajaxのパラメータでユーザを作る -------------------------
      let newUser = new User(getUserParams(req.body));

      // フォームのパラメータでユーザを作る
      User.register(newUser, req.body.password, (error, user) => {
        if (user) {
          // status 201: Created リクエストは成功し、その結果新たな
          // リソースが作成された
          res.status(201);
          res.end();
        }
        else {
          if (error.name === 'UserExistsError') {
            console.log(
              `ユーザアカウントの作成のエラー: ${error.message}`
            );
            // status 409: Emailがすでに登録されている
            res.status(409)
              .jsonp([{
                value: 'req.body.email',
                msg: error.message, param: 'email'
              }]);
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
  // // APIトークンを検証するミドルウェア関数 ---------------------------
  // verifyToken: (req, res, next) => {
  //   let token = req.query.apiToken;

  //   // クエリパラメータにトークンが存在するか
  //   if (token) {
  //     // 提供されたAPIトークンを持つユーザを探す
  //     User.findOne({apiToken: token})
  //       .then(user => {
  //         // そのAPIトークンを持つユーザが存在すればnextをコール
  //         if (user) {
  //           next();
  //         }
  //         else {
  //           next(new Error('Invalid API token.'));
  //         }
  //       })
  //       // エラーをエラーハンドルに渡す
  //       .catch(error => {
  //         next(new Error(error.message));
  //       });
  //   }
  //   else {
  //     // トークンが一致しなかったらエラーメッセージを返す
  //     next(new Error('Invalid API token.'));
  //   }
  // }
};

