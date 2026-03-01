# Kanban Board — 開發規格需求書 (PRD)

## 1. 產品概述

### 1.1 產品名稱
Kanban Board（看板管理工具）

### 1.2 產品目標
建立一個 MVP 等級的 Kanban 看板單頁應用程式（SPA），讓使用者可以透過視覺化的看板介面管理代辦事項。使用者可以新增、編輯、刪除卡片，並透過拖拉方式在不同狀態欄位間移動卡片。

### 1.3 產品範圍
- **包含**：前端 SPA，資料儲存於瀏覽器 localStorage
- **不包含**：後端伺服器、使用者認證、多人協作、API 串接

### 1.4 目標使用者
需要輕量級任務管理工具的個人使用者。

---

## 2. 技術規格

### 2.1 技術棧

| 類別 | 技術選型 | 說明 |
|------|----------|------|
| Framework | Vue 3 + TypeScript | Composition API，`<script setup>` 語法 |
| Build Tool | Vite | 快速開發與打包 |
| CSS 方案 | Tailwind CSS v4 | `@tailwindcss/vite` plugin，CSS-first 設定 |
| 狀態管理 | Pinia | Vue 官方推薦，支援 DevTools |
| 拖拉功能 | vue-draggable-plus | 基於 SortableJS，原生支援觸控裝置 |
| 資料持久化 | localStorage | 每次資料變動後立即寫入 |
| ID 生成 | crypto.randomUUID() | 瀏覽器原生 API，無需額外套件 |

### 2.2 瀏覽器支援
- Chrome 92+
- Firefox 95+
- Safari 15.4+
- Edge 92+

---

## 3. 功能需求

### 3.1 頁面結構

頁面為單頁應用，包含兩大區塊：

```
┌────────────────────────────────────────────┐
│              新增代辦事項卡片區塊              │
├────────────────────────────────────────────┤
│                 卡片管理區塊                  │
│  ┌────────┬────────┬────────┬────────┐     │
│  │ 待處理  │ 進行中  │ 待驗收  │ 已完成  │     │
│  │(To Do) │(In     │(In     │(Done)  │     │
│  │        │Progress│Review) │        │     │
│  │ [卡片]  │ [卡片]  │ [卡片]  │ [卡片]  │     │
│  │ [卡片]  │        │        │        │     │
│  │  ↕滾動  │  ↕滾動  │  ↕滾動  │  ↕滾動  │     │
│  └────────┴────────┴────────┴────────┘     │
└────────────────────────────────────────────┘
```

### 3.2 功能一：新增卡片（對應 User Story 1）

#### 需求描述
使用者可以透過「新增代辦事項卡片」區塊，建立新的卡片到看板中。

#### 驗收條件（Acceptance Criteria）

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-1.1 | 畫面上方提供「新增卡片」專屬輸入區塊 | 包含標題輸入欄位、描述輸入欄位、新增按鈕 |
| AC-1.2 | 使用者填寫標題（必填）與描述（選填），點擊「新增」按鈕 | 卡片成功建立 |
| AC-1.3 | 新卡片建立時未指定狀態 | 預設狀態為「待處理 (To Do)」 |
| AC-1.4 | 卡片新增成功後 | 立即顯示在「待處理」欄位中，無需手動刷新 |
| AC-1.5 | 卡片新增成功後 | 輸入表單自動清空，方便連續新增 |
| AC-1.6 | 使用者未填寫標題就點擊新增 | 顯示驗證提示，阻止新增 |

#### 資料規格

```typescript
// 新增卡片時產生的資料
{
  id: string          // 自動生成 UUID
  title: string       // 使用者輸入，必填
  description: string // 使用者輸入，選填（預設空字串）
  status: 'todo'      // 固定為待處理
  createdAt: number   // 建立時間戳
  updatedAt: number   // 更新時間戳（初始等於 createdAt）
}
```

---

### 3.3 功能二：卡片狀態管理（對應 User Story 2）

#### 需求描述
看板介面以視覺化方式劃分四個獨立欄位，每張卡片歸屬且僅歸屬其中一個狀態。

#### 驗收條件

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-2.1 | 看板介面 | 明確劃分「待處理」「進行中」「待驗收」「已完成」四個獨立欄位 |
| AC-2.2 | 每個欄位 | 顯示欄位名稱與該欄位卡片數量 |
| AC-2.3 | 每張卡片 | 只能歸屬於四個狀態之一 |
| AC-2.4 | 欄位無卡片時 | 顯示空狀態提示（如虛線區域或提示文字） |

#### 四個狀態定義

| 狀態值 | 顯示名稱 | 視覺色彩標記 |
|--------|----------|-------------|
| `todo` | 待處理 (To Do) | 紅色 |
| `in-progress` | 進行中 (In Progress) | 橘色 |
| `in-review` | 待驗收 (In Review) | 藍色 |
| `done` | 已完成 (Done) | 綠色 |

---

### 3.4 功能三：編輯卡片（對應 User Story 3）

#### 需求描述
使用者可以編輯卡片的標題、描述與狀態。透過滑鼠 hover 卡片時出現的「編輯」按鈕觸發編輯模式。

#### 驗收條件

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-3.1 | 滑鼠 hover 卡片時 | 顯示「編輯」與「刪除」按鈕 |
| AC-3.2 | 滑鼠離開卡片時 | 「編輯」與「刪除」按鈕隱藏 |
| AC-3.3 | 點擊「編輯」按鈕 | 開啟編輯 Modal（彈出視窗） |
| AC-3.4 | 編輯 Modal 內容 | 包含：標題輸入欄、描述輸入欄、狀態下拉選單、儲存按鈕、取消按鈕 |
| AC-3.5 | 編輯 Modal 開啟時 | 自動帶入該卡片現有的標題、描述、狀態 |
| AC-3.6 | 修改內容後點擊「儲存」 | 卡片資訊立即更新，Modal 關閉 |
| AC-3.7 | 在編輯 Modal 中更改狀態並儲存 | 卡片自動移至對應的新狀態欄位 |
| AC-3.8 | 點擊「取消」或 Modal 外部區域 | Modal 關閉，不儲存任何變更 |
| AC-3.9 | 按下 ESC 鍵 | Modal 關閉，不儲存任何變更 |
| AC-3.10 | 行動裝置（觸控螢幕） | 編輯/刪除按鈕常駐顯示（因無 hover 事件） |

---

### 3.5 功能四：刪除卡片

#### 需求描述
使用者可以刪除卡片，刪除前需經過二次確認。

#### 驗收條件

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-4.1 | 滑鼠 hover 卡片，點擊「刪除」按鈕 | 跳出確認對話框 |
| AC-4.2 | 確認對話框內容 | 顯示提示訊息，確認使用者是否真的要刪除 |
| AC-4.3 | 點擊「確認刪除」 | 卡片從看板中移除，資料同步刪除 |
| AC-4.4 | 點擊「取消」 | 對話框關閉，卡片保留不變 |

---

### 3.6 功能五：拖拉移動卡片（對應 User Story 4）

#### 需求描述
使用者可以透過滑鼠拖拉方式，將卡片在不同狀態欄位間移動，移動後卡片狀態自動同步更新。

#### 驗收條件

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-5.1 | 滑鼠按住卡片並拖動 | 卡片跟隨滑鼠移動，原位置顯示佔位效果 |
| AC-5.2 | 將卡片拖曳至另一欄位並放開 | 卡片穩定停留在新欄位中 |
| AC-5.3 | 卡片移至新欄位後 | 卡片的狀態屬性自動更新為新欄位對應的狀態 |
| AC-5.4 | 在同一欄位內拖動卡片 | 可調整卡片排序 |
| AC-5.5 | 拖動過程中 | 提供視覺回饋（如半透明效果、目標區域高亮） |
| AC-5.6 | 觸控裝置 | 支援觸控拖拉（SortableJS 原生支援） |

---

### 3.7 功能六：資料持久化

#### 需求描述
所有卡片資料儲存於瀏覽器 localStorage，頁面重新整理後資料不遺失。

#### 驗收條件

| AC 編號 | 條件 | 預期結果 |
|---------|------|----------|
| AC-6.1 | 任何資料變動（新增/編輯/刪除/移動） | 立即寫入 localStorage |
| AC-6.2 | 頁面重新整理 | 所有卡片恢復至上次儲存的狀態與位置 |
| AC-6.3 | localStorage 資料損壞或無法解析 | 以空陣列初始化，不影響應用運作 |

---

## 4. 非功能需求

### 4.1 響應式設計 (RWD)

| 螢幕寬度 | 欄位配置 | 說明 |
|----------|----------|------|
| < 640px（手機） | 1 欄 | 四個狀態區塊垂直堆疊，Board 區域可垂直滾動 |
| 640px - 1023px（平板） | 2 欄 | 2×2 grid 排列 |
| ≥ 1024px（桌機） | 4 欄 | 四欄並排顯示 |

### 4.2 捲軸規則

| 規則 | 說明 |
|------|------|
| 頁面本身 | **不可出現**水平（X 軸）與垂直（Y 軸）捲軸 |
| 各狀態欄位內部 | 當卡片數量超過可視範圍時，**允許** Y 軸滾動 |
| 手機模式 | Board 區域整體允許 Y 軸滾動（因欄位垂直堆疊） |

### 4.3 佈局實作方式

```
頁面結構（使用 Flexbox）：
┌──────────────────────────── h-screen, overflow-hidden ┐
│  新增卡片區塊（shrink-0，固定高度）                       │
│  ──────────────────────────────────────────────────── │
│  看板區塊（flex-1, min-h-0）                            │
│    各欄位內部 → overflow-y-auto                         │
└──────────────────────────────────────────────────────┘
```

---

## 5. 資料模型

### 5.1 TypeScript 型別定義

```typescript
// 卡片狀態列舉
enum CardStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  IN_REVIEW = 'in-review',
  DONE = 'done',
}

// 卡片資料結構
interface Card {
  id: string           // UUID，唯一識別碼
  title: string        // 卡片標題（必填）
  description: string  // 卡片描述（選填）
  status: CardStatus   // 卡片狀態
  createdAt: number    // 建立時間（Date.now()）
  updatedAt: number    // 更新時間（Date.now()）
}

// 欄位定義
interface ColumnDefinition {
  status: CardStatus   // 對應的卡片狀態
  label: string        // 欄位顯示名稱
  color: string        // 欄位色彩標記（Tailwind class）
}
```

### 5.2 欄位定義

```typescript
const COLUMNS: ColumnDefinition[] = [
  { status: CardStatus.TODO,        label: '待處理 (To Do)',       color: 'bg-red-500' },
  { status: CardStatus.IN_PROGRESS, label: '進行中 (In Progress)', color: 'bg-orange-500' },
  { status: CardStatus.IN_REVIEW,   label: '待驗收 (In Review)',   color: 'bg-blue-500' },
  { status: CardStatus.DONE,        label: '已完成 (Done)',        color: 'bg-green-500' },
]
```

### 5.3 localStorage 儲存格式

- **Key**: `kanban-cards`
- **Value**: `JSON.stringify(Card[])`

---

## 6. 元件架構

### 6.1 元件樹狀結構

```
App.vue                          ← 根佈局（h-screen flex flex-col）
├── AddCardForm.vue              ← 新增卡片表單
├── KanbanBoard.vue              ← 看板容器（RWD grid）
│   └── KanbanColumn.vue (×4)    ← 單一狀態欄位（含拖拉區域）
│       └── KanbanCard.vue (×N)  ← 單張卡片（含 hover 按鈕）
├── EditCardModal.vue            ← 編輯卡片 Modal
└── ConfirmDialog.vue            ← 刪除確認對話框
```

### 6.2 各元件職責

| 元件 | 職責 |
|------|------|
| **App.vue** | 頁面根佈局，`h-screen flex flex-col overflow-hidden`，組合所有子元件 |
| **AddCardForm.vue** | 提供標題（必填）與描述輸入欄位、「新增」按鈕；呼叫 store 的 `addCard()`；新增後清空表單 |
| **KanbanBoard.vue** | 看板容器，從 constants 讀取欄位定義，以 RWD grid 渲染 4 個 `KanbanColumn` |
| **KanbanColumn.vue** | 顯示欄位標頭（色彩標記 + 名稱 + 卡片數量）；使用 `<VueDraggable>` 包裹卡片列表，支援跨欄拖拉；內部 `overflow-y-auto` 支援滾動 |
| **KanbanCard.vue** | 顯示卡片標題與截斷描述；hover 時顯示編輯/刪除按鈕（手機常駐）；觸發編輯 Modal 與刪除確認 |
| **EditCardModal.vue** | Teleport 至 body 的 Modal；含標題、描述、狀態下拉選單表單；儲存時呼叫 `store.updateCard()` |
| **ConfirmDialog.vue** | 通用確認對話框；接收 props（visible, title, message）；emit confirm / cancel |

---

## 7. 狀態管理（Pinia Store）

### 7.1 Store 結構

```
useKanbanStore
├── State
│   └── cards: Card[]                      ← 所有卡片（從 localStorage 初始化）
├── Getters
│   └── cardsByStatus: Record<CardStatus, Card[]>  ← 按狀態分組
└── Actions
    ├── addCard(title, description)         ← 新增卡片（預設 TODO）
    ├── updateCard(id, updates)             ← 更新卡片屬性
    ├── deleteCard(id)                      ← 刪除卡片
    └── reorderCards(status, newList)        ← 拖拉後更新欄位卡片（同步 status）
```

### 7.2 持久化策略
- **載入**：Store 初始化時從 localStorage 讀取
- **儲存**：每次 action 執行完畢後立即寫入 localStorage
- **錯誤處理**：`JSON.parse` 包裹 try/catch，解析失敗以空陣列初始化

---

## 8. 拖拉機制設計

### 8.1 技術方案
使用 `vue-draggable-plus` 的 `<VueDraggable>` 元件，搭配 writable computed 連接 Pinia store。

### 8.2 核心邏輯

```vue
<!-- KanbanColumn.vue -->
<VueDraggable
  v-model="columnCards"
  group="kanban"
  :animation="200"
  ghost-class="opacity-30"
>
  <KanbanCard v-for="card in columnCards" :key="card.id" :card="card" />
</VueDraggable>
```

- 所有欄位共用 `group="kanban"`，實現跨欄拖拉
- `v-model` 綁定 writable computed，setter 呼叫 `store.reorderCards()`
- `reorderCards()` 自動將卡片 status 更新為目標欄位狀態
- `animation: 200` 提供平滑過渡動畫
- `ghost-class: "opacity-30"` 提供拖動佔位視覺回饋

---

## 9. UI/UX 規格

### 9.1 新增卡片區塊
- 位於頁面頂部，固定高度不隨內容變化
- 桌面版：水平排列（標題輸入 + 描述輸入 + 新增按鈕）
- 手機版：垂直堆疊排列
- 標題欄位帶有 placeholder 提示文字
- 新增按鈕在標題為空時禁用（disabled 狀態）

### 9.2 卡片樣式
- 白色背景、圓角、陰影邊框
- 標題以粗體顯示
- 描述文字截斷（最多顯示 2 行，使用 `line-clamp-2`）
- Hover 時右上角浮現編輯/刪除按鈕
- 拖動時卡片呈半透明效果

### 9.3 欄位樣式
- 每個欄位標頭含圓形色彩標記 + 欄位名稱 + 卡片數量
- 欄位背景為淺灰色，與卡片形成對比
- 空欄位顯示虛線區域或「暫無卡片」提示

### 9.4 Modal 樣式
- 半透明黑色遮罩覆蓋全頁
- 居中白色彈窗，圓角陰影
- 寬度不超過 `max-w-md`，手機上自適應
- 支援點擊遮罩或按 ESC 關閉

---

## 10. 專案結構

```
Kanban/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── public/
│   └── favicon.ico
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   │   └── main.css
│   ├── types/
│   │   └── kanban.ts
│   ├── constants/
│   │   └── kanban.ts
│   ├── stores/
│   │   └── useKanbanStore.ts
│   ├── components/
│   │   ├── AddCardForm.vue
│   │   ├── KanbanBoard.vue
│   │   ├── KanbanColumn.vue
│   │   ├── KanbanCard.vue
│   │   ├── EditCardModal.vue
│   │   └── ConfirmDialog.vue
│   └── utils/
│       └── id.ts
```

---

## 11. 開發階段規劃

| 階段 | 內容 | 產出 |
|------|------|------|
| Phase 1 | 專案建置 | Vite + Vue 3 + TS + Tailwind + Pinia 環境就緒 |
| Phase 2 | 資料層 | types、constants、Pinia store（含 localStorage） |
| Phase 3 | 佈局骨架 | App、Board、Column、Card 元件基本渲染 |
| Phase 4 | 新增卡片 | AddCardForm 完整功能 |
| Phase 5 | 卡片互動 | 編輯 Modal、刪除確認、hover 按鈕 |
| Phase 6 | 拖拉功能 | vue-draggable-plus 整合，跨欄拖拉 + 狀態同步 |
| Phase 7 | 收尾優化 | 空狀態、動畫、觸控裝置、RWD 最終測試 |

---

## 12. 驗收測試清單

### 功能測試

| 編號 | 測試項目 | 預期結果 |
|------|----------|----------|
| T-01 | 新增卡片（填寫標題與描述） | 卡片出現在「待處理」欄位，表單清空 |
| T-02 | 新增卡片（標題為空） | 顯示驗證提示，無法新增 |
| T-03 | 頁面重新整理 | 所有卡片仍在正確欄位 |
| T-04 | Hover 卡片 | 顯示編輯/刪除按鈕 |
| T-05 | 點擊編輯 → 修改標題/描述 → 儲存 | 卡片資訊立即更新 |
| T-06 | 編輯 Modal 中更改狀態 → 儲存 | 卡片移至對應欄位 |
| T-07 | 點擊刪除 → 取消 | 卡片保留 |
| T-08 | 點擊刪除 → 確認 | 卡片從看板移除 |
| T-09 | 拖拉卡片至不同欄位 | 卡片移動成功，狀態同步更新 |
| T-10 | 同欄內拖拉排序 | 卡片排序更新 |
| T-11 | 拖拉至空欄位 | 卡片正確進入空欄位 |
| T-12 | 拖拉後重新整理頁面 | 卡片仍在新欄位 |

### 非功能測試

| 編號 | 測試項目 | 預期結果 |
|------|----------|----------|
| T-13 | 桌面版（≥ 1024px） | 四欄並排顯示 |
| T-14 | 平板（640-1023px） | 2×2 grid 排列 |
| T-15 | 手機（< 640px） | 單欄堆疊 |
| T-16 | 頁面無捲軸 | 頁面本身不出現 X/Y 軸捲軸 |
| T-17 | 欄位內卡片過多 | 欄位內部可垂直捲動 |
| T-18 | 行動裝置觸控拖拉 | 正常運作 |
| T-19 | 行動裝置編輯/刪除按鈕 | 常駐顯示（無需 hover） |
