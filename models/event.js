const mongoose = require('mongoose');
const {Schema} = mongoose;

const EventSchedule = require('./eventSchedule.js');

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
    type : mongoose.Schema.Types.ObjectId,
    ref : "EventSchedule"
  }
},{
  // createAtとupdateAtの日時を記録するタイムスタンププロパティを追加
  timestamps: true
});

eventSchema.methods.getJson = async function() {
  let result = {};
  result.eventSchedule = {};

  result.name = this.name;
  result.description = this.description;

  await EventSchedule.findOne({_id: this.eventSchedule})
    .then((data) => {
      result.eventSchedule.byMonth = data.byMonth;
      result.eventSchedule.byMonthDay = data.byMonthDay;
      result.eventSchedule.repeatFrequency = data.repeatFrequency;
    })
    .catch(error => console.log(`error: ${error.message}`))

  return result;
};

module.exports = mongoose.model('Event', eventSchema);
