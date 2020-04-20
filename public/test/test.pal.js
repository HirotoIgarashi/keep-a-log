/*eslint-env mocha, expect */
/*global expect util pal*/

const testUserParam = {
  first: '五十嵐', last: '浩人', email: 'hiroto@gmail.com', password: 'hiroto3768', zipCode: '1350004'
};

const noEmailUserParam = {
  first: '五十嵐',
  last: '浩人',
  password: 'hiroto3768',
  zipCode: '1350004'
};

describe('pal test', () => {
  it('shold 1+1 = 2', () =>{
    expect(1 + 1).to.equal(2);
  });
});

describe('util test', () => {
  it('sey hello world', () => {
    expect(util.dom.helloWorld()).to.equal('hello world!');
  });
});

describe('createElement test', () => {
  it('make h1 tag', () =>{
    let frag = util.dom.createFragment();
    let h1Element = util.dom.createElement('h1');
    h1Element = util.dom.innerHTML(h1Element, '新しいユーザを作成する:');

    expect(util.dom.appendChild(frag, h1Element).outerHTML).to.equal('<h1>新しいユーザを作成する:</h1>');
  });

  it('make p tag', () => {
    let frag = util.dom.createFragment();
    let pElement = util.dom.createElement('p');
    pElement = util.dom.innerHTML(pElement,'これはpタグです');

    expect(util.dom.appendChild(frag, pElement)
      .outerHTML)
      .to
      .equal('<p>これはpタグです</p>');
  });

  it('make h2 tag', () => {
    let frag = util.dom.createFragment();
    let h2Element = util.dom.createElement('h2');
    h2Element = util.dom.innerHTML(h2Element, '新しいユーザを作成する:');
    frag = util.dom.appendChild(frag, h2Element);

    expect(frag.outerHTML).to
      .equal('<h2>新しいユーザを作成する:</h2>');
  });

  it('make div tag', () => {
    let frag = util.dom.createFragment();
    let divElement = util.dom.createElement('div');
    divElement = util.dom.setAttribute(divElement, 'class', 'data-form');

    frag = util.dom.appendChild(frag, divElement);

    expect(frag.outerHTML).to
      .equal('<div class="data-form"></div>');
  });

  it('make form tag', () => {
// この行は80桁です ------------------------------------------------------------
    let frag = util.dom.createFragment();
// -----divタグの作成 ----------------------------------------------------------
    let divElement = util.dom.createElement('div');
    util.dom.setAttribute(divElement, 'class', 'data-form');

    let h2Element = util.dom.createElement('h2');
    h2Element = util.dom.innerHTML(h2Element, '新しいユーザを作成する:');

// -----formタグの作成 ---------------------------------------------------------
    let formElement = util.dom.createElement('form');
    util.dom.setAttribute(formElement, 'action', '/users/create');
    util.dom.setAttribute(formElement, 'method', 'POST');

// -----姓のlabelとinput -------------------------------------------------------
    let firstLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputFirstName',
      'innerHTML': '姓',
      'type': 'text',
      'name': 'first',
      'id': 'inputFirstName',
      'placeholder': '姓',
      'required': false,
      'autofocus': true
    });
// -----姓のlabelとinput -------------------------------------------------------

// -----名のlabelとinput -------------------------------------------------------
    let lastLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputLastName',
      'innerHTML': '名',
      'type': 'text',
      'name': 'last',
      'id': 'inputLastName',
      'placeholder': '名',
      'required': false,
      'autofocus': false
    });
// -----名のlabelとinput -------------------------------------------------------
    let passwordLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputPassword',
      'innerHTML': 'パスワード',
      'type': 'password',
      'name': 'password',
      'id': 'inputPassword',
      'placeholder': 'パスワード',
      'required': true,
      'autofocus': false
    });

// -----Eメールのlabelとinput --------------------------------------------------
    let emailLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputEmail',
      'innerHTML': 'Email address',
      'type': 'email',
      'name': 'email',
      'id': 'inputEmail',
      'placeholder': 'Email Address',
      'required': true,
      'autofocus': false
    });

// -----郵便番号のlabelとinput -------------------------------------------------
    let zipCodeLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputZipCode',
      'innerHTML': '郵便番号',
      'type': 'text',
      'name': 'zipCode',
      'id': 'inputZipCode',
      'placeholder': '郵便番号',
      'required': true,
      'autofocus': false
    });

// -----ボタンを生成 -----------------------------------------------------------
    let submitButton = util.dom.createElement('button');
    util.dom.setAttribute(submitButton, 'type', 'submit');
    util.dom.innerHTML(submitButton, 'サインイン');
    // <button type="submit">サインイン</button>

// -----パスワードを表示するcheckboxとlabelを生成 ------------------------------
    let showPasswordCheckbox = util.dom.createElement('input');
    util.dom.setAttribute(showPasswordCheckbox, 'type', 'checkbox');
    util.dom.setAttribute(showPasswordCheckbox, 'id', 'showPassword');
    let showPasswordLabel = util.dom.createElement('label');
    util.dom.innerHTML(showPasswordLabel, 'パスワードを表示');


    util.dom.appendChild(divElement, formElement);
    util.dom.appendChild(formElement, h2Element);
    util.dom.appendChild(formElement, firstLabelAndInput[0]);
    util.dom.appendChild(formElement, firstLabelAndInput[1]);
    util.dom.appendChild(formElement, lastLabelAndInput[0]);
    util.dom.appendChild(formElement, lastLabelAndInput[1]);
    util.dom.appendChild(formElement, passwordLabelAndInput[0]);
    util.dom.appendChild(formElement, passwordLabelAndInput[1]);
    util.dom.appendChild(formElement, emailLabelAndInput[0]);
    util.dom.appendChild(formElement, emailLabelAndInput[1]);
    util.dom.appendChild(formElement, zipCodeLabelAndInput[0]);
    util.dom.appendChild(formElement, zipCodeLabelAndInput[1]);
    util.dom.appendChild(formElement, submitButton);
    util.dom.appendChild(formElement, showPasswordCheckbox);
    util.dom.appendChild(formElement, showPasswordLabel);

    frag = util.dom.appendChild(frag, divElement);

// この行は80桁です ------------------------------------------------------------
    expect(frag.outerHTML).to
      .equal(
        '<div class="data-form"><form action="/users/create" method="POST">\
<h2>新しいユーザを作成する:</h2>\
<label for="inputFirstName">姓</label>\
<input type="text" name="first" id="inputFirstName" placeholder="姓" autofocus="">\
<label for="inputLastName">名</label>\
<input type="text" name="last" id="inputLastName" placeholder="名">\
<label for="inputPassword">パスワード</label>\
<input type="password" name="password" id="inputPassword" placeholder="パスワード" \
required="">\
<label for="inputEmail">Email address</label>\
<input type="email" name="email" id="inputEmail" placeholder="Email Address" \
required="">\
<label for="inputZipCode">郵便番号</label>\
<input type="text" name="zipCode" id="inputZipCode" placeholder="郵便番号" \
required="">\
<button type="submit">サインイン</button>\
<input type="checkbox" id="showPassword">\
<label>パスワードを表示</label>\
</form></div>'
      );

  });

  describe('ユーザ登録のテスト', () => {
    it('Ajaxでユーザの登録のstatus codeが200になるはず', (done) => {
      let request = null;
      const responseHandle = () => {
        if (request && request.readyState === 4) {
          expect(request.status).to.be.equal(201);
          done();
        }
      };

      // XMLHttpRequestによる送信
      request = pal.util_b.sendXmlHttpRequest(
        'POST',
        '/user/create',
        true,
        responseHandle,
        JSON.stringify(testUserParam)
      );
    });

    it('Ajaxでユーザの登録失敗するはず', (done) => {
      let request = null;
      const responseHandle = () => {
        if (request && request.readyState === 4) {
          expect(request.status).to.be.equal(422);
          expect(request.status).to.not.equal(200);
          done();
        }
      };

      // XMLHttpRequestによる送信
      request = pal.util_b.sendXmlHttpRequest(
        'POST',
        '/user/create',
        true,
        responseHandle,
        JSON.stringify(noEmailUserParam)
      );
    });

  });

  describe('Date関連のテスト', () => {
    it('get nowで日付が返ってくるはず', (done) => {
      let now = util.date.getNowDate();
      expect(typeof now).to.be.equal('object');
      done();
    })
  });
});

