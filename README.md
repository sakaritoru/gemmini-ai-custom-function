# スプレッドシートカスタム関数（GEMINI）
## get started
### 1. Dockerのイメージをビルドする
```
docker-compose build
```
### 2. Dockerを起動する
```
docker-compose up -d
```
### 3. 必要なモジュールをインストールする
```
docker exec -it gemmini-ai-custom-function yarn initenv
```
### 4. claspにログインする
1. コンテナに入る
```
docker exec -it gemmini-ai-custom-function bash
```
2. 以下のコマンドを実行します。
```shell
clasp login
```
3. コマンド実行後に表示されたURLにアクセスしgoogleログインします。
4. ログイン後、リダイレクトされたURLをコピーします。
5. 別のターミナルでコンテナの中に入り、curlコマンドでリダイレクトされたURLにアクセスします。
```shell
curl http://localhost:xxxx/?code=xxx
```
### 5. clasp.jsonを生成する
```shell
clasp create --type sheets
```
### 6. .clasp.jsonのrootDirの値を以下に書き換える
```
/usr/src/app/dist
```
### 7. コードをビルドする
```shell
yarn build
```
### 8. Google App script に push する
```
yarn deploy
```