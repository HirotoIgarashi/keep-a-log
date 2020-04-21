'use strict;'

/*global util */
// domを操作するユーティリティ ---------------------------------------
util.date = (() => {
  // 現在の日付を返す
  const getNowDate = () => new Date();

  const getDate = (year, month) => new Date(year, month - 1);

  // getPrviousMonthDate開始 -----------------------------------------
  // ある月のDateオブジェクトを与えて先月のDateオブジェクトを求める
  const getPrviousMonthDate =
    (date) => new Date(date.getFullYear(), date.getMonth() - 1);
  // getPrviousMonthDate終了 -----------------------------------------

  // getNextMonthDate開始 --------------------------------------------
  // ある月のDateオブジェクトを与えて翌月のDateオブジェクトを求める
  const getNextMonthDate =
    (date) => new Date( date.getFullYear(), date.getMonth() + 1);
  // getNextMonthDate終了 --------------------------------------------

  const getYear = (date) => date.getFullYear();

  const getMonth = (date) => date.getMonth() + 1;

  const getDayOfTheWeek = (date) => date.getDay();

  // getBeginingOfTheWeek開始 ----------------------------------------
  // ある日付を与えての週の始まり(月曜日)を返す
  const getBeginingOfTheWeek = (date) => {
    // 引数をbeginingDateにコピーする
    let beginingDate = new Date(date.getTime());

    // 曜日を求める、0:日曜日、1:月曜日、2:火曜日、3:水曜日、4:木曜日、
    // 5:金曜日、6:土曜日、
    let dayOfTheWeek = getDayOfTheWeek(beginingDate);

    // 月曜日を求める
    if (dayOfTheWeek === 0) {
      // 与えられた日付が日曜だったら6日前が週の初め
      beginingDate.setDate(beginingDate.getDate() - 6);
    }
    else {
      // 与えられた日付が日曜以外、例えば月曜日だったら
      // 1を引いて1を足す
      beginingDate.setDate(beginingDate.getDate() - dayOfTheWeek + 1);
    }

    return beginingDate;
  };
  // getBeginingOfTheWeek終了 ----------------------------------------

  // getDaysLater開始 ----------------------------------------
  // ある日付と数を与えてある日付から数の値の前の日付を返す
  const getDaysLater =
    (date, num) => new Date(date.getTime() + (1000*60*60*24)*num);
  // toISOString開始 -------------------------------------------------

  // Dateオブジェクトを与えてISO8601形式の文字列を求める
  const toISOString = (date) => date.toISOString();
  // toISOString終了 -------------------------------------------------

  // 関数をエクスポートする ------------------------------------------
  return {
    getNowDate: getNowDate,
    getDate: getDate,
    getPrviousMonthDate: getPrviousMonthDate,
    getNextMonthDate: getNextMonthDate,
    getYear: getYear,
    getMonth: getMonth,
    getDayOfTheWeek: getDayOfTheWeek,
    getBeginingOfTheWeek: getBeginingOfTheWeek,
    getDaysLater: getDaysLater,
    toISOString: toISOString
  };
})();
