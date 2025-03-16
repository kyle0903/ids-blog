# IDS BLOG

## 簡介

本專案是一個基於 ReactJS 和 Express.js 開發的部落格網站，提供文章發布、留言、按讚以及會員管理功能，目的是讓研究所所上的同學如果壓力大可以匿名在網站上抒發心情，或是講一些屬於所上的八卦，不用怕會被發現。

## 技術棧

- **程式語言**：JavaScript、HTML、CSS
- **前端框架**：ReactJS
- **後端框架**：Express.js
- **資料庫**：MySQL
- **版本控制**：Git

## 系統功能

- 文章管理
    - 發布文章
    - 修改文章
- 互動功能
    - 文章留言
    - 文章按讚
- 會員管理
    - 會員註冊、登入、登出
    - 忘記密碼功能
    - 會員個人檔案與文章修改
    - 會員歷史文章與按讚內容查詢

## 安裝與使用

### 1. 環境需求

- Node.js (推薦使用 LTS 版本)
- MySQL
- Git

### 2. 安裝步驟

1. Clone 專案至本地端
    
    ```bash
    git clone https://github.com/kyle0903/ids-blog.git
    cd ids-blog
    
    ```
    
2. 安裝前端相依套件：
    
    ```bash
    npm install
    ```
    
3. **安裝後端相依套件**：
    
    ```bash
    cd server
    npm install
    ```
    

### 3. 模型系統

- CommonJS(若要使用ES6標準，在package.json加上type:”module”
- 以下為模型系統差異：
    
    
    | 特性 | `require` | `import` |
    | --- | --- | --- |
    | 語法 | `const module = require('module')` | `import module from 'module'` |
    | 模組系統 | CommonJS (CJS) | ES Modules (ESM) |
    | 執行時機 | 動態載入 (運行時解析) | 靜態載入 (編譯時解析) |
    | 適用環境 | Node.js (預設 CommonJS) | ES6+ (現代前端, Node.js 需 `type: "module"` 或 `.mjs` 副檔名) |

### 4. 資料庫設定

- 更新 `server/config/config.js` 中的資料庫連線設定
- 確保 MySQL 正常運行，以及能夠與資料庫連線

### 5. 資料庫結構

- **accounts**
    
    用於存儲用戶的基本資訊和帳號管理。
    
    - **id** (INT, PRIMARY KEY) - 用戶唯一識別碼
    - **user** (VARCHAR) - 帳號名稱
    - **password** (VARCHAR) - 密碼（加密儲存）
    - **email** (VARCHAR) - 電子郵件
    - **introduction** (TEXT) - 用戶個人簡介

---

- **random_table**
    
    用於存儲用戶認證或重設密碼的驗證碼。
    
    - **id** (INT, PRIMARY KEY)
    - **account_id** (INT, FOREIGN KEY) - 對應 `accounts.id`
    - **randomCode** (VARCHAR) - 隨機碼，用於認證或忘記密碼驗證

---

- **posts**
    
    儲存用戶發佈的文章內容及互動資訊。
    
    - **post_id** (INT, PRIMARY KEY) - 文章唯一識別碼
    - **account_id** (INT, FOREIGN KEY) - 對應 `accounts.id`
    - **title** (VARCHAR) - 文章標題
    - **post_text** (TEXT) - 文章內容
    - **date_posted** (DATETIME) - 發佈日期
    - **likes** (INT) - 按讚數

---

- **tb_likes**
    
    用於記錄每篇文章的按讚資訊。
    
    - **post_id** (INT, FOREIGN KEY) - 對應 `posts.post_id`
    - **account_id** (INT, FOREIGN KEY) - 對應 `accounts.id`

---

- **tb_comment**
    
    儲存用戶對貼文的留言。
    
    - **id** (INT, PRIMARY KEY)
    - **post_id** (INT, FOREIGN KEY) - 對應 `posts.post_id`
    - **comment** (TEXT) - 留言內容
    - **account** (VARCHAR) - 留言者帳號（對應 `accounts.user`）

### 6. 伺服器啟動

- 前端： `http://localhost:3000`
    
    ```bash
    npm run start
    ```
    
- 後端 API： `http://localhost:8081`
    
    ```bash
    cd server
    npm run start
    ```
    
