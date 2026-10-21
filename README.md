# Scenario Tuker

マーダーミステリーや TRPG のシナリオ通過記録を管理・共有する Web アプリケーション「Scenario Tuker」の monorepo。

## 構成

```
.
├── frontend/   # Next.js 14 (App Router) / pnpm 製のWebフロントエンド (旧 scenario-tuker as a separate repo)
├── backend/    # Kotlin / Gradle / Spring Boot 製のAPIサーバ (旧 scenario-tuker-api)
└── e2e/        # E2Eテスト (Playwright 想定、未整備)
```

旧 `scenario-tuker-api` の履歴は `git-filter-repo` で `backend/` 配下に取り込まれています。
個別ファイルの履歴は `git log --follow frontend/...` のように `--follow` を付けると追跡できます。

## 開発

### frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### backend
```bash
cd backend
docker compose up -d --wait  # ローカル用 MySQL（127.0.0.1:4306、初回起動時にテーブルを作成）
./gradlew bootRun
./gradlew build              # テストも MySQL が起動している必要がある
```

テーブル定義を変えたときは `docker compose down -v` でデータを消してから起動し直す。

## 旧リポジトリ

- https://github.com/h-orito/scenario-tuker-api (backend のオリジナル / archive 予定)
