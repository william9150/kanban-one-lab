# Kanban 看板管理系統

一個輕量級的 Kanban 看板單頁應用程式，讓使用者透過視覺化介面管理代辦事項。支援新增、編輯、刪除卡片，以及透過拖拉方式在不同狀態欄位間移動卡片。

## 功能特色

- **四欄位看板**：待處理、進行中、待驗收、已完成，每欄以狀態色彩標記區分
- **新增卡片**：輸入標題與描述，卡片自動加入「待處理」欄位
- **編輯卡片**：透過 Modal 彈窗修改標題、描述與狀態，狀態變更時卡片自動移動至對應欄位
- **刪除卡片**：二次確認機制防止誤刪
- **拖拉移動**：跨欄拖拉卡片，狀態自動同步更新，支援拖放至欄位標題與空白區域
- **拖拉視覺回饋**：目標欄位顯示半透明高亮效果
- **Toast 通知**：卡片異動時右上角即時顯示提示訊息
- **資料持久化**：所有資料儲存於瀏覽器 localStorage，重新整理後不遺失
- **預設資料集**：首次造訪自動載入 8 張範例卡片
- **響應式設計 (RWD)**：桌面 4 欄 / 平板 2 欄 / 手機 1 欄（accordion 摺疊模式）
- **無頁面捲軸**：頁面本身不產生捲軸，僅欄位內部可滾動（捲軸隱藏）

## 技術選擇

| 類別 | 技術 | 選擇原因 |
|------|------|----------|
| 框架 | Vue 3 + TypeScript | Composition API + `<script setup>` 語法，型別安全 |
| 建置工具 | Vite | 快速冷啟動與 HMR，開發體驗佳 |
| 樣式方案 | Tailwind CSS v4 | Utility-first，快速實現 RWD，CSS-first 設定免配置檔 |
| 狀態管理 | Pinia | Vue 官方推薦，支援 DevTools 除錯 |
| 拖拉功能 | vue-draggable-plus | 基於 SortableJS，原生支援觸控裝置，Vue 3 Composition API 整合 |
| 資料持久化 | localStorage | MVP 無需後端，資料即時儲存於瀏覽器 |

## 安裝

確保已安裝 Node.js 18+，然後執行：

```bash
npm install
```

## 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 http://localhost:3000

## 建置生產版本

```bash
npm run build
```

打包產出位於 `dist/` 資料夾。

## 預覽生產版本

```bash
npm run preview
```

## 專案文件

- [PRD 開發規格需求書](docs/PRD.md)
- [人工測試 Checklist](docs/checklist.md)
