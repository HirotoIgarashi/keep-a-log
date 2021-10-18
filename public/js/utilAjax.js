'use strict';

// XMLHttpRequestオブジェクトのインスタンスを返す
export const createXMLHttpRequest = () => {
  let xhr; // XMLHttpReqestオブジェクト

  if (window.XMLHttpRequest) {
    // Mozillaベースのブラウザの場合
    xhr = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    // Internet Explorerの場合
    xhr = new ActiveXObject("Msxml2.XMLHTTP");
    if (!xhr) {
      xhr = new ActiveXObject("Miforsoft.XMLHTTP");
    }
  }
  return xhr;
};

export const openXMLHttpRequest = (request, requestType, url, async) => {
  try {
    request.open(requestType, url, async);
  }
  catch (err) {
    alert(`サーバーに接続できません。しばらくたってからやり直して下さい。\n\
エラーの詳細: ${err.message}`);
  }
  return request;
}

// イベントリスナーを設定する
export const setOnreadystatechange = (request, responseHandler) => {
  request.onreadystatechange = responseHandler;
  return request;
}

// リクエストヘッダーをセットする
export const setRequestHeader = (request, contentType) => {
  request.setRequestHeader( 'Content-Type', contentType );
  return request;
}

export const sendGetRequest = (request) => {
  request.send(null);
  return request;
}
export const sendPostRequest = (request, requestData) => {
  request.send(requestData);
  return request;
}

export const onReceiveRequest = (xhr, callback) => {
  console.log('onReceiveRequestが呼ばれました');
  console.log(callback);
  console.log(xhr);
  if (xhr && xhr.readyState === 0) {
    console.log('open()はまだ呼び出されていない。')
  }
  else if (xhr && xhr.readyState === 1) {
    console.log('open()が呼び出された。')
  }
  else if (xhr && xhr.readyState === 2) {
    console.log('ヘッダを受け取った。')
  }
  else if (xhr && xhr.readyState === 3) {
    console.log('レスポンスボディを受信中である。')
  }
  else if (xhr && xhr.readyState === 4) {
    console.log('レスポンスの受信が完了した。')
  }
};
