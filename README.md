## 環境構築
### claspにログインする
1. コンテナの中に入り以下のコマンドを実行します。
```shell
clasp login
```
2. コマンド実行後に表示されたURLにアクセスしgoogleログインします。
3. ログイン後、リダイレクトされたURLをコピーします。
4. 別のターミナルでコンテナの中に入り、curlコマンドでリダイレクトされたURLにアクセスします。
```shell
curl http://localhost:xxxx/?code=xxx
```
5. ログインが完了します。

### .clasp.jsonを生成する
1. ログイン後以下コマンドを実行し、.clasp.jsonを作成します。
```shell
clasp cleate
```
2. 「Create which script?」と質問されるので以下を選択してください。
```shell
standalone
```
3. appディレクトリー配下に以下ファイルが生成されたら完了です。
- .clasp.json
- appsscript.json

