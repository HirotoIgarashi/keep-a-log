'use strict;'

/*global util */
// domを操作するユーティリティ ---------------------------------------
util.date = (() => {
  // 現在の日付をDateオブジェクトで返す
  const getNowDate = () => new Date();

  // 年と月からDateオブジェクトを返す
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

  // Dataオブジェクトから年のstringを返す
  const getYear = (date) => date.getFullYear();

  // Dataオブジェクトから月のstringを返す
  const getMonth = (date) => date.getMonth() + 1;

  // Dataオブジェクトから曜日のnumberを返す
  const getDayOfTheWeek = (date) => date.getDay();

  // getBeginingOfTheWeek開始 ----------------------------------------
  // ある日付を与えての週の始まり(月曜日)のDateオブジェクトを返す
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
  // getDaysLater終了 ----------------------------------------

  // toISOString開始 -------------------------------------------------
  // Dateオブジェクトを与えてISO8601形式の文字列を求める
  const toISOString = (date) => date.toISOString();

  // Dateオブジェクトを与えて現在のロケールに変換する
  const toLocaleDateString =
    (dateObject) => dateObject.toLocaleDateString()

  const getYearString = (date) => date.getFullYear();
  const getMonthString = (date) => date.getMonth() + 1;
  const getDateString = (date) => date.getDate();

  // Dateオブジェクトを与えてYYYY-MM-DD形式の文字列を求める
  const getYMDString = (date) => `${getYearString(date)}-\
${getMonthString(date)}-\
${getDateString(date)}`;

  // 何年何月(2020-1)を与えられてその月の日付のリストを返す ----------
  const getMonthArray = ((arg) => {

    console.log(arg);

    let result = [];
    let year = arg.split('-')[0];
    let month = arg.split('-')[1];
    let date = new Date(year, month - 1);
    let nextMonthdate = new Date(year, month);

    while (date < nextMonthdate) {
      result.push(toCalendarDates(date));
      date = new Date(date.setDate(date.getDate() + 1));
    }

    return result;
  });

  // Dateオブジェクト引数からISO8601のCalendar dates: 2020-01-01を返す
  const toCalendarDates =
    // (dateObject) => dateObject.toLocaleDateString()
    (dateObject) => toLocaleDateString(dateObject)

  // 何年何月(2020-1)と曜日を与えてその月の日付のリストを返す ------
  const getMonthByDayArray = (object) => {
    const stringToDay = {
      'Sunday'    : 0,
      'Monday'    : 1,
      'TuesDay'   : 2,
      'Wednesday' : 3,
      'Thursday'  : 4,
      'Friday'    : 5,
      'Saturday'  : 6
    };
    let year = object.year;
    let month = object.month;
    let day = stringToDay[object.day]
    let array = getMonthArray(`${year}-${month}`);
    let result = [];

    array.forEach((date) => {
      let array = date.split('/');
      let d = new Date(array[0], array[1] - 1, array[2]);
      if (d.getDay() === day) {
        result.push(date);
      }
    });
    return result;
  };

  // 何年何月(2020-1)と第何何曜日を与えてその日を返す --------------
  const getDateByWhatNumberDay =
    (object) => getMonthByDayArray(object)[object.whatNumber - 1]
  // 関数をエクスポートする ------------------------------------------
  return {
    // 現在の日付をDateオブジェクトで返す
    getNowDate: getNowDate,
    // 年と月からDateオブジェクトを返す
    getDate: getDate,
    getPrviousMonthDate: getPrviousMonthDate,
    getNextMonthDate: getNextMonthDate,
    // Dataオブジェクトから年のstringを返す
    getYear: getYear,
    // Dataオブジェクトから月のstringを返す
    getMonth: getMonth,
    // Dataオブジェクトから曜日のnumberを返す
    getDayOfTheWeek: getDayOfTheWeek,
    // ある日付を与えての週の始まり(月曜日)のDateオブジェクトを返す

    // Dateオブジェクトを与えてISO8601形式の文字列を求める
    toISOString: toISOString,

    // Dateオブジェクト引数からISO8601のCalendar dates: 2020-01-01を返す
    toCalendarDates: toCalendarDates,
    getYearString: getYearString,
    getMonthString: getMonthString,
    getDateString: getDateString,
    // Dateオブジェクトを与えてYYYY-MM-DD形式の文字列を求める
    getYMDString: getYMDString,
    getBeginingOfTheWeek: getBeginingOfTheWeek,
    getDaysLater: getDaysLater,
    // 何年何月(2020-1)を与えてその月の日付のリストを返す ------------
    getMonthArray: getMonthArray,
    // 何年何月(2020-1)と曜日を与えてその月の日付のリストを返す ------
    getMonthByDayArray: getMonthByDayArray,
    // 何年何月(2020-1)と第何何曜日を与えてその日を返す --------------
    getDateByWhatNumberDay: getDateByWhatNumberDay
  };
})();
