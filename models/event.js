const mongoose = require('mongoose');
const {Schema} = mongoose;

// eventScheduleのスキーマを作る -------------------------------------
const eventSchema = new Schema({
  name: {
    type      : String,
    required  : true
  },
  description: {
    type      : String
  },
  eventSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventSchedule"
  }
},{
  // createAtとupdateAtの日時を記録するタイムスタンププロパティを追加
  timestamps: true
});
module.exports = mongoose.model('Event', eventSchema);
