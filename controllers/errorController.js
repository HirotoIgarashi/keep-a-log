// http-status-codesモジュールを追加
const httpStatus = require('http-status-codes');

// ステータスコード404でレスポンス
exports.respondNoResouceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.send(`${errorCode} | The page does not exist!`);
};

// すべてのエラーをキャッチし、ステータスコード500でレスポンス
exports.respondInternalError = (error, req, res) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  console.log(`ERROR occurred: ${error.statck}`);
  res.status(errorCode);
  res.send(`${errorCode} | Sorry, our application is experiencing a problem`);
};

// エラー処理用のミドルウェアを追加
exports.logError = (error, req, res, next) => {
  // エラースタックをログ出力
  console.error(error.statck);
  // エラーを次のミドルウェア関数に渡す
  next(error);
};
