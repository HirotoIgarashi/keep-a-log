var cradle = require('cradle');

var db = new(cradle.Connection)(
  'localhost',
  5984,
  { auth: { username: 'admin', password: 'password' } }
).database('quotes');

var params = { author: process.argv[2], quote: process.argv[3] };

function errorHandler(err) {
  if (err) {
    console.log(err);
    process.exit();
  }
}

function checkAndSave(err) {
  errorHandler(err);
  if (params.author && params.quote ) {
    db.save({ author: params.author, quote: params.quote }, errorHandler);
  }
}

// データベースに書き込む前に、データベースが存在するか確認する
db.exists(function(err, exists) {
  errorHandler(err);
  if (!exists) {
    db.create(checkAndSave);
    return;
  }
});
