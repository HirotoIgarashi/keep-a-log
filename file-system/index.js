'use strice';

const fs = require('fs');
const { extname } = require('path');
const { readdir, readFile, writeFile, unlink } = require('fs').promises;

// userディレクトリがなければ作成する
if (!fs.existsSync(`${__dirname}/user`)) {
  console.log('userディレクトリが存在しないので作成します')
  fs.promises.mkdir(`${__dirname}/user`);
}

exports.fetchAll = async (savePath) => {
  // 同一ディレクスト内に存在するJSONファイルをすべて取得
  const files = (await readdir(`${__dirname}/${savePath}`))
    .filter(file => extname(file) === '.json')

  return Promise.all(
    files.map(file =>
      readFile(`${__dirname}/${savePath}/${file}`, 'utf8').then(JSON.parse)
    )
  )
}

exports.fetchByMailaddress = (mailAddress, savePath) => exports.fetchAll(savePath)
  .then(all => all.filter(item => item.email === mailAddress))

exports.create = (user, savePath) =>
  writeFile(`${__dirname}/${savePath}/${user.id}.json`, JSON.stringify(user))

exports.update = async (id, update, savePath) => {
  const fileName = `${__dirname}/${savePath}/${id}.json`
  return readFile(fileName, 'utf8').then(
    content => {
      const user = {
        ...JSON.parse(content),
        ...update
      };
      return writeFile(fileName, JSON.stringify(user)).then(() => user);
    },
    err => err.code === 'ENOENT' ? null : Promise.reject(err)
  )
}

exports.remove = (id, savePath) => unlink(`${__dirname}/${savePath}/${id}.json`)
  .then(
    () => id,
    // ファイルが存在しない場合はnullを返し、それ以外はそのままエラーにする
    err => err.code === 'ENOENT' ? null : Promise.reject(err)
  )
