'use strict';

/* eventController.js */

const EventSchedule = require('../models/eventSchedule.js');
const Event = require('../models/event.js');

// チャットコントローラの内容をエクスポートする ----------------------
module.exports = io => {
  // 新しいユーザ接続を監視する --------------------------------------
  io.on('connection', client => {
    console.log('new event connection');

    // ユーザーの接続断を監視する ------------------------------------
    client.on('disconnect', () => {
      console.log('user disconnected');
    });

    // イベントの作成 ------------------------------------------------
    client.on('event create', (data) => {
      let event;
      let eventSchedule;

      // eventScheduleを先に作成する ---------------------------------
      eventSchedule = new EventSchedule(data.eventSchedule);

      // メッセージを保存する ----------------------------------------
      eventSchedule.save()
        .then((savedData) => {
          data.eventSchedule = savedData;
          event = new Event(data);
        })
        .then(() => {
          return event.save();
        })
        .then((result) => {
          // 保存に成功したらメッセージの値を送出
          client.emit('event create complete', result);
        })
        .catch(error => console.log(`event create error: ${error.message}`));
    });

    // イベントの参照 ------------------------------------------------
    client.on('event readAll', () => {

      Event.find({})
        .then((data)=> client.emit('event readAll complete', data))
        .catch(error => console.log(`event readAll error: ${error.message}`));

    });

    // イベントの参照 ------------------------------------------------
    client.on('event read', (id) => {
      let event = {};
      Event.findOne({_id: id})
        .then((data) => {
          event = data;
          return EventSchedule.findOne({_id: data.eventSchedule})
        })
        .then((eventSchedule) => {
          event.eventSchedule = eventSchedule;
          client.emit('event read complete', event);
        })
        .catch(error => console.log(`event read error: ${error.message}`));

    });

    // イベントの更新 ------------------------------------------------
    client.on('event update', (data) => {
      console.log(data);
      client.emit('event update complete', data);
    });

    // イベントの削除 ------------------------------------------------
    client.on('event delete', (id) => {
      Event.findOne({_id: id})
        .then((event) => {
          return EventSchedule.findByIdAndRemove(event.eventSchedule);
        })
        .then(() => Event.findByIdAndRemove(id))
        .catch(
          error => console.log(`event delete error: ${error.message}`));

      client.emit('event delete complete', id);
    });

    // イベントスケジュールを全て読み込む ----------------------------
    client.on('eventSchedule readAll', () => {
      EventSchedule.find({})
        .then((eventScheduleArray) => {
          client.emit(
            'eventSchedule readAll complete',
            eventScheduleArray
          );
        })
        .catch(
          error => console.log(
            `eventSchedule readAll error: ${error.message}`
          )
        );
    });

    // イベントスケジュールをidをキーとして読み込む ------------------
    client.on('eventSchedule read', (id) => {
      EventSchedule.findOne({_id: id})
        .then((eventSchedule) => {
          client.emit('eventSchedule read complete', eventSchedule);
        })
        .catch(
          error => console.log(
            `eventSchedule read error: ${error.message}`
          )
        );
    });

  });
};

