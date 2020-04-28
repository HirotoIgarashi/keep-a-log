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
          console.log(`${result}を保存しました`);
          console.log(`_idは${result._id}です`);
          // 保存に成功したらメッセージの値を送出
          client.emit('event create complete', result);
        })
        .catch(error => console.log(`error: ${error.message}`));
    });

    // イベントの参照 ------------------------------------------------
    client.on('event readAll', () => {
      Event.find({})
        .then((result) => {
          client.emit('event readAll complete', result);
        })
        .catch(error => console.log(`error: ${error.message}`));
    });

    // イベントの参照 ------------------------------------------------
    client.on('event read', (id) => {
      console.log(id);
      client.emit('event read complete', id);
    });

    // イベントの更新 ------------------------------------------------
    client.on('event update', (data) => {
      console.log(data);
      client.emit('event update complete', data);
    });

    // イベントの削除 ------------------------------------------------
    client.on('event delete', (data) => {
      console.log(data);
      client.emit('event delete complete', data);
    });
  });
};

