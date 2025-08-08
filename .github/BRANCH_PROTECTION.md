# ブランチ保護ルールの設定

このリポジトリでは、PRでマージする際にテストが全て通らないとマージできないようにするため、ブランチ保護ルールを設定する必要があります。

## 設定手順

### 1. GitHubリポジトリの設定ページにアクセス
- リポジトリのメインページで「Settings」タブをクリック
- 左サイドバーから「Branches」をクリック

### 2. ブランチ保護ルールを追加
- 「Add rule」ボタンをクリック
- 「Branch name pattern」に `master` または `main` を入力

### 3. 保護オプションを設定
以下のオプションを有効にしてください：

#### 必須のステータスチェック
- 「Require status checks to pass before merging」をチェック
- 「Require branches to be up to date before merging」をチェック
- 以下のステータスチェックを追加：
  - `test (18.x)`
  - `test (20.x)`
  - `build`

#### その他の保護オプション
- 「Require pull request reviews before merging」をチェック
- 「Require conversation resolution before merging」をチェック
- 「Require signed commits」をチェック（推奨）

### 4. ルールを保存
- ページ下部の「Create」または「Save changes」ボタンをクリック

## CI/CDワークフロー

このリポジトリには以下のCI/CDワークフローが設定されています：

- **テスト**: Jestを使用したユニットテスト
- **型チェック**: TypeScriptの型チェック
- **リンティング**: ESLintによるコード品質チェック
- **ビルド**: Next.jsアプリケーションのビルド

## テストが失敗した場合

テストが失敗した場合、以下の手順で修正してください：

1. ローカルでテストを実行：`npm test`
2. 型チェックを実行：`npm run type-check`
3. リンティングを実行：`npm run lint`
4. 全てのチェックが通るまで修正を繰り返す
5. 修正をコミットしてプッシュ
6. CI/CDパイプラインが成功することを確認
7. PRをマージ

## 注意事項

- ブランチ保護ルールが有効になると、テストが失敗しているPRはマージできません
- CI/CDパイプラインが完了するまでマージボタンが無効になります
- 緊急時は管理者権限でブランチ保護ルールを一時的に無効にできます
