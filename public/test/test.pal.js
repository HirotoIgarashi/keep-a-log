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
          expect(request.status).to.be.equal(409);
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
// -------------------------------------------------------------------
describe('エラー、警告、情報を出力するテスト', () => {
  it('fail, warn, noteのテスト', (done) => {
    expect(() => {util.core.fail('引数は文字列である必要があります')})
      .to.throw();
    expect(() => {util.core.warn('ageを数値に変換できませんでした')})
      .to.not.throw();
    expect(() => {util.core.note('ageを数値に変換しようとしています')})
      .to.not.throw();
    done();
  });
});

describe('インデックス指定するテスト', () => {
  it('nthのテスト', (done) => {
    const letters = ['a', 'b', 'c'];
    expect(util.core.nth(letters, 1)).to.be.equal('b');
    expect(util.core.nth('abc', 0)).to.be.equal('a');
    expect(() =>
      {util.core.nth({}, 2)})
        .to
        .throw(
          Error,
          'インデックス指定可能ではないデータ型は' +
            'サポートされていません'
        );
    expect(() =>
      {util.core.nth(letters, 4000)})
        .to.throw(Error, '指定されたインデックスは範囲外です');
    expect(() => {util.core.nth(letters, 'aaaa')})
      .to.throw(Error, 'インデックスは整数である必要があります');
    done();
  });
  it('secondのテスト', (done) => {
    expect(util.core.second(['a', 'b'])).to.be.equal('b');
    expect(util.core.second('fogus')).to.be.equal('o');
    expect(() =>
      {util.core.second({})})
        .to
        .throw(
          Error,
          'インデックス指定可能ではないデータ型は' +
            'サポートされていません'
        );
    done();
  });
});

describe('関数型プログラミングのテスト', () => {
  it('関数合成のテスト', (done) => {
    const f = (x) => x * x + 1;
    const g = (x) => x - 2;

    expect(util.core.compose(f, g)(2)).to.eql(f(g(2)));
    done();
  });
  it('関数(function)かどうか', (done) => {
    const add = (x, y) => x + y;
    expect(util.core.isFunction(add)).true;
    expect(util.core.isFunction({})).false;
    expect(util.core.isFunction(1)).false;
    expect(util.core.isFunction([])).false;
    done();
  });
  it('配列(Array)かどうか', (done) => {
    expect(util.core.isArray([1, 2, 3])).true;
    expect(util.core.isArray({foo: 123})).false;
    expect(util.core.isArray('foobar')).false;
    expect(util.core.isArray(undefined)).false;
    done();
  });
  it('文字列(String)かどうか', (done) => {
    expect(util.core.isString(1)).false;
    expect(util.core.isString('Hello')).true;
    expect(util.core.isString(true)).false;
    expect(util.core.isString(undefined)).false;
    done();
  });
  it('整数(Integer)かどうか', (done) => {
    expect(util.core.isInteger(1)).true;
    expect(util.core.isInteger(-1)).true;
    expect(util.core.isInteger('1')).true;
    expect(util.core.isInteger(1.5)).false;
    expect(util.core.isInteger(-1.5)).false;
    expect(util.core.isInteger('Hello')).false;
    expect(util.core.isInteger(true)).false;
    expect(util.core.isInteger(undefined)).false;
    done();
  });
  it('インデックス可能(StringかArray)かどうか', (done) => {
    expect(util.core.isIndexed([1, 2, 3])).true;
    expect(util.core.isIndexed('Hello')).true;
    expect(util.core.isIndexed(1)).false;
    expect(util.core.isIndexed(true)).false;
    expect(util.core.isIndexed(undefined)).false;
    done();
  });
  it('偶数かどうか', (done) => {
    expect(util.core.isEven(2)).true;
    expect(util.core.isEven(1)).false;
    done();
  });
  it('奇数かどうか', (done) => {
    expect(util.core.isOdd(2)).false;
    expect(util.core.isOdd(1)).true;
    done();
  });
  it('存在する(existy)かどうか', (done) => {
    expect(util.core.existy(null)).false;
    expect(util.core.existy(undefined)).false;
    expect(util.core.existy({}.notHere)).false;
    expect(util.core.existy((function(){})())).false;
    expect(util.core.existy(0)).true;
    expect(util.core.existy(false)).true;
    done();
  });
  it('true(truthy)かどうか', (done) => {
    expect(util.core.truthy(false)).false;
    expect(util.core.truthy(undefined)).false;
    expect(util.core.truthy(0)).true;
    expect(util.core.truthy('')).true;
    done();
  });
  it('comparatorのテスト', (done) => {
    expect([2, 3, -6, 0, -108, 42].sort()).deep.equal([ -108, -6, 0, 2, 3, 42 ]);
    expect([0, -1, -2].sort()).deep.equal([-1, -2, 0]);
    expect([2, 3, -1, -6, 0, -108, 42, 10].sort(util.core.compareLessThanOrEqual))
      .deep.equal([ -108, -6, -1, 0, 2, 3, 10, 42 ]);
    expect([2, 3, -1, -6, 0, -108, 42, 10]
      .sort(util.core.comparator(util.core.lessOrEqual)))
      .deep.equal([ -108, -6, -1, 0, 2, 3, 10, 42 ]);
    done();
  });
// この行は80桁です ------------------------------------------------------------
  it('Functionだったら実行する', (done) => {
    expect(util.core.executeIfHasFunction([1,2,3], 'reverse'))
      .deep.equal([3,2,1]);
    expect(util.core.executeIfHasFunction({foo: 42}, 'foo'))
      .deep.equal(42);
    expect(util.core.executeIfHasFunction([1, 2, 3], 'notHere'))
      .deep.equal(undefined);
    done();
  });
  it('existyのテスト', (done) => {
    expect([null, undefined, 1, 2, false].map(util.core.existy))
      .deep.equal([false , false, true, true, true]);
    done();
  });
  it('truthyのテスト', (done) => {
    expect([null, undefined, 1, 2, false].map(util.core.truthy))
      .deep.equal([false , false, true, true, false]);
    done();
  });
});

