# keep-a-log

## 機能

手帳として使えるWebアプリ

Ubuntu 20.04で動作確認
Ubuntu 20.10からはMongoDBがリポジトリから外されられたので動作しない。

~~MongoDBのインストール~~

~~sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common~~

~~wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -~~

~~sudo add-apt-repository 'deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse'~~

~~sudo apt install mongodb-org~~

~~MongoDBデーモンをシステム起動時に起動するようにする~~
~~sudo systemctl enable --now mongod~~

~~MongoDBを起動する
$ mongod~~

~~あと~~
redisのインストールが必要。
Ubuntuの場合、redisのインストールは

~~~bash
sudo apt install -y mysql-server
~~~

``` sudo apt install redis ```

redisの使い方がよくわからいのでmysql-serverを使って見る。

~~~bash
sudo apt install -y mysql-server
~~~

TODO: ユーザーとテーブルの作成

- MySQLにログイン

~~~bash
sudo mysql -u root
~~~

- ユーザの作成

~~~sql
CREATE USER test_user@'localhost' IDENTIFIED BY 'user_password';
GRANT ALL PRIVILEGES ON *. * TO test_user@'localhost';
~~~

- 作成したユーザでログインする

~~~bash
mysql -u test_user -p
~~~

- テーブルを作成する

~~~sql
CREATE DATABASE user_app;
show databases;
~~~

nodemonをインストールする。

~~~bash
npm install -g nodemon
~~~

githubからクローンする

```bash
git clone https://github.com/HirotoIgarashi/keep-a-log.git
```

```bash
cd keep-a-log
```

```bash
npm install
```

```bash
npm run file-system
```
