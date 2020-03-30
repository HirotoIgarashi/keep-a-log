// ユーザモデルをロードする
const User = require('../models/user');
const {body, check, validationResult} = require('express-validator');

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
  index: (req, res, next) => {
    User.find({})
      // ユーザデータをレスポンスに格納し、次のミドルウェア関数を呼び出す
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
  // 別のアクションでビューのレンダリングを行う
  indexView: (req, res) => {
    res.render('users/index', {
      flashMessages: {
        success: 'すべてのユーザ情報をロードしました。'
      }
    });
  },
  // フォームをレンダリングするnewアクションを追加
  new: (req, res) => {
    res.render('users/new');
  },
  // フォームのパラメータでユーザを作る
  create: (req, res, next) => {
    let userParams = new User(getUserParams(req.body));

    // フォームのパラメータでユーザを作る
    User.create(userParams)
      .then(user => {
        // 成功のフラッシュメッセージで応答する
        req.flash(
          'success',
          `${user.fullName}のアカウントの生成が成功しました。`
        );
        res.locals.redirect = '/users';
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`ユーザアカウントの作成のエラー: ${error.message}`);
        res.locals.redirect = '/users/new';
        // 失敗のフラッシュメッセージで応答する
        req.flash(
          'error',
          `ユーザアカウントの作成に失敗しました。理由: ${error.message}.`
        );
        next();
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
        // エラーはロギングして次の関数に渡す
        console.log(`Error fetchin user by ID; ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
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

        // next(error);
        next();
      });
  },
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
  authenticate: (req, res, next) => {
    // メールアドレスでユーザ1人を問い合わせる
    User.findOne({email: req.body.email})
      // フォームとデータベースの間でパスワードを比較
      .then(user => {
        // ユーザが見つかったら、
        if (user) {
          // Userモデルでパスワード比較メソッドを呼び出す
          user.passwordComparison(req.body.password)
            .then(passwordsMatch => {
              // パスワードが一致したら、
              console.log('passwordsMatch: ' + passwordsMatch);

              if (passwordsMatch) {
                res.locals.redirect = `/users/${user._id}`;
                req.flash('success', `${user.fullName}のログインが成功しました`);
                res.locals.user = user;
              }
              else {
                req.flash(
                  'error',
                  'ログインに失敗しました: パスワードが正しくありません.'
                );
                res.locals.redirect = '/users/login';
              }
              // リダイレクトパスとフラッシュメッセージが
              // 設定された状態で次のミドルウェア関数を呼び出す
              next();
            })
            .catch(error => {
              console.log('passwordComparison error: ' + error.message);
              next(error);
            });
        }
        else {
          req.flash(
            'error',
            'Failed to log in user account: User account not found.'
          );
          res.locals.redirect = '/users/login';
          next();
        }
      })
      // エラーならコンソールにロギングしてリダイレクト
      .catch(error => {
        console.log(`ログインに失敗しました: ${error.message}`);
        next(error);
      });
  },
  // validate関数を追加
  validate: (req, res, next) => {

    body('email')
      .isEmail()
      .normalizeEmail(),
    body('text')
      .not().isEmpty()
      .trim(),
    body('password')
      .notEmpty();

    check('zipCode')
      .isLength({min: 8}).withMessage('must be 7 chars long');

    check('password')
      .isLength({min: 5}).withMessage('must be at least 5 char long')
      .matches(/\d/).withMessage('must contain number');

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let messages = errors.array().map(e => e.msg);
      req.skip = true;
      req.flash('error', messages.join(' and '));

      res.locals.redirect = '/users.new';
      next();
    }
    else {
      next();
    }
  }
};
