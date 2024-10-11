# express-output-crud

express サンプル API

CRUD 処理と以下の機能を実装

- 静的解析
- 単体テスト
- E2E テスト
- CI

## 技術構成

- typescript
- express
- typeorm
- mysql
- jest
- [testcontainers](https://node.testcontainers.org/)

## API 構成

- API の接続確認は postman を用いて確認してみてください。
- https://www.postman.com/

### Todo

|                                             | メソッド | URI            |
| :------------------------------------------ | :------- | :------------- |
| 全 Todo データを取得                        | GET      | /api/todos     |
| Todo の ID に紐づく単一の Todo データを取得 | GET      | /api/todos/:id |
| Todo 新規作成                               | POST     | /api/todos     |
| Todo 更新                                   | PUT      | /api/todos/:id |
| Todo 削除                                   | DELETE   | /api/todos/:id |

## 環境構築

### 1. env ファイルを作成

- ルートディレクトリ直下に「.env」ファイルを作成
- 「.env.sample」の記述をコピー

```
touch .env
```

- backend ディレクトリに移動し、「.env」ファイルを作成
- backend/.env.sample」ファイルの記述をコピー

```
cd backend
touch .env
```

### 2. docker 起動

- ビルド

```
docker compose build
```

- コンテナ起動

```
docker compose up
```

## 3. データ用意

### migration 実行　(テーブル作成)

```
<!-- 事前にdbコンテナを起動しておく -->
docker compose up -d

cd backend

<!-- migration 実行コマンド -->

npm run migration:run

```

- migration が正しく実行されたか確認

```
<!-- 事前にdbコンテナを起動しておく -->
docker compose up -d

<!-- rootディレクトリに移動 -->

<!-- dbコンテナにログイン -->
make db-sh

<!-- mysqlにログイン -->
mysql -u root -p

'Enter password:'と聞かれるので、自分で設定したパスワードを入力 (デフォルトだとpass)

<!-- データベースを選択 -->
use DATABASE_NAME;
<!-- 例: デフォルトだとEXPRESS_OUTPUT_CRUD_DB -->
use EXPRESS_OUTPUT_CRUD_DB;

<!-- テーブルを閲覧 -->
show tables;

todosのテーブルがあればOK

```

### seeding 実行　(初期データ作成)

```
<!-- 事前にdbコンテナを起動しておく -->
docker compose up -d

cd backend

<!-- seeding実行 -->
npm run seed:run

```

### 4. API 接続

- 以下の url に接続し、レスポンスが返ってくる事を確認
  - http://localhost:4000/api/todos

## 開発手順

### migration ファイル生成

```
<!-- 事前にdbコンテナを起動しておく -->
docker compose up -d

cd backend

<!-- migration ファイル生成コマンド -->
NAME=TableName npm run migration:generate

<!-- todosテーブルを作りたい場合 -->
NAME=TodoTable npm run migration:generate

```

### rollback 実行

```
<!-- 事前にdbコンテナを起動しておく -->
docker compose up -d

cd backend

<!-- rollback実行 -->
npm run migration:revert

```

### テスト

- backend ディレクトリで実行してください

```
cd backend
```

- 単体テスト

```
npm run test
```

- E2E テスト

```
npm run test:e2e
```

## フロントエンドとの繋ぎ込みの確認

```
cd frontend

npm run dev

```

- http://localhost:5173 に接続
