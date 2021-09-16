'use strice';

const { extname } = require('path');
const { readdir, readFile, writeFile, unlink } = require('fs').promises;

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

exports.update = async (id, update) => {
  const fileName = `${__dirname}/${id}.json`
  return readFile(fileName, 'utf8').then(
    content => {
      const user = {
        ...JSON.parse(content),
        ...update
      }
    },
    err => err.code === 'ENOENT' ? null : Promise.reject(err)
  )
}

exports.remove = id => unlink(`${__dirname}/${id}.json`)
  .then(
    () => id,
    // ファイルが存在しない場合はnullを返し、それ以外はそのままエラーにする
    err => err.code === 'ENOENT' ? null : Promise.reject(err)
  )
