# keep-a-log

## 機能

手帳として使えるWebアプリ

Ubuntu 20.04で動作確認
Ubuntu 20.10からはMongoDBがリポジトリから外されられたので動作しない。

### MongoDBのインストール

~~sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common~~

~~~bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
~~~

~~~bash
sudo add-apt-repository 'deb [arch=amd64]\
https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse'
~~~

~~~bash
sudo apt install mongodb-org
~~~

#### MongoDBデーモンをシステム起動時に起動するようにする

~~~bash
sudo systemctl enable --now mongod
~~~

#### MongoDBを起動する

~~~bash
mongod
~~~

#### その後の作業

redisのインストールが必要。
Ubuntuの場合、redisのインストールは

~~~bash
sudo apt install redis
~~~

redisの使い方がよくわからないのでmysql-serverを使って見る。

MX Linuxの場合はデフォルトのリポジトリにmysql-serverがないので
以下の手順に従います。

TODO: MX Linuxにmysql-serverをインストールする手順がわかりません。

~~~bash
sudo apt update
sudo apt install gnupg
wget https://dev.mysql.com/get/mysql-apt-config_0.8.25-1_all.dev
~~~

左上に「mysql-apt-configを設定します」というウインドウが表示されます。
「which MySQL product do you wish to configure?」でリストボックスにOkを
選択して右上のNextをクリックします。

~~~bash
sudo apt install -y mysql-server
~~~

ウィンドウが表示されますがrootのパスワードを設定して終了します。

~~~bash
sudo /etc/init.d/mysql start
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

~~~bash
git clone https://github.com/HirotoIgarashi/keep-a-log.git
~~~

~~~bash
cd keep-a-log
~~~

~~~bash
npm install
~~~

~~~bash
npm run file-system
~~~
