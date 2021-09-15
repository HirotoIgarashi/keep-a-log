'use strice';

const { extname } = require('path');
const { readdir, readFile, writeFile } = require('fs').promises;

exports.fetchAll = async () => {
  // 同一ディレクスト内に存在するJSONファイルをすべて取得
  const files = (await readdir(__dirname))
    .filter(file => extname(file) === '.json')
  return Promise.all(
    files.map(file =>
      readFile(`${__dirname}/${file}`, 'utf8').then(JSON.parse)
    )
  )
}

exports.create = user =>
  writeFile(`${__dirname}/${user.id}.json`, JSON.stringify(user))
  
