# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

マーダーミステリーやTRPGのシナリオ通過記録を管理・共有するWebアプリケーション「Scenario Tuker」

## コマンド

```bash
pnpm install    # 依存関係のインストール
pnpm dev        # 開発サーバー起動 (http://localhost:3000)
pnpm build      # プロダクションビルド
pnpm lint       # ESLint実行
```

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **状態管理**: Jotai
- **スタイリング**: Tailwind CSS + Sass
- **認証**: Firebase Authentication
- **フォーム**: React Hook Form
- **テーブル**: TanStack Table

## アーキテクチャ

### ディレクトリ構成

```
src/
├── @types/           # 型定義ファイル (.d.ts)
├── app/              # Next.js App Router
│   ├── (toppage)/    # トップページルートグループ
│   └── (other)/      # その他ページルートグループ
│       ├── authors/      # 著者管理
│       ├── game-systems/ # ゲームシステム管理
│       ├── participates/ # 参加記録
│       ├── rule-books/   # ルールブック管理
│       ├── scenarios/    # シナリオ管理
│       └── users/        # ユーザー管理
└── components/
    ├── api/          # APIクライアント関数
    ├── auth/         # Firebase認証関連
    ├── button/       # ボタンコンポーネント
    ├── form/         # フォーム入力コンポーネント
    ├── layout/       # レイアウトコンポーネント
    ├── lib/          # ライブラリ設定 (dayjs, firebase, markdown, react-select)
    ├── modal/        # モーダルコンポーネント
    ├── notification/ # 通知コンポーネント
    ├── pages/        # ページ固有コンポーネント
    └── table/        # テーブルコンポーネント
```

### APIクライアント

`src/components/api/api.ts` に共通のリクエスト関数（`getRequest`, `postRequest`, `putRequest`, `deleteRequest`）があり、各リソース用のAPIファイル（`scenario-api.ts`, `user-api.ts`等）がそれを利用する。

認証トークンは `src/components/auth/` でFirebase認証と連携して管理。

### パスエイリアス

`@/*` → `./src/*` として設定済み
