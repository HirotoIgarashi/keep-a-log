const mongoose = require('mongoose');
const {Schema} = mongoose;

// eventScheduleのスキーマを作る -------------------------------------
const eventScheduleSchema = new Schema({
  byDay: {
    type: String
  },
  byMonth: {
    type      :Number,
    min       : 1,
    max       : 12,
    required  : true
  },
  byMonthDay: {
    type      :Number,
    min       : 1,
    max       : 31,
    required  : true
  },
  startDate: {
    type:String
  },
  repeatFrequency : {
    type:String
  }
},{
  // createAtとupdateAtの日時を記録するタイムスタンププロパティを追加
  timestamps: true
});
module.exports = mongoose.model('EventSchedule', eventScheduleSchema);

