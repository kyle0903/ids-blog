# IDS BLOG

## 簡介

本專案是一個基於 ReactJS 和 Express.js 開發的部落格系統，提供文章發布、留言、按讚以及會員管理功能，目的是讓研究所所上的同學如果壓力大可以匿名在網站上抒發心情，或是講一些屬於所上的八卦，不用怕會被發現。

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

### 2. 模型系統

- CommonJS(若要使用ES6標準，在package.json加上type:”module”
- 以下為模型系統差異：
    
    
    | 特性 | `require` | `import` |
    | --- | --- | --- |
    | 語法 | `const module = require('module')` | `import module from 'module'` |
    | 模組系統 | CommonJS (CJS) | ES Modules (ESM) |
    | 執行時機 | 動態載入 (運行時解析) | 靜態載入 (編譯時解析) |
    | 適用環境 | Node.js (預設 CommonJS) | ES6+ (現代前端, Node.js 需 `type: "module"` 或 `.mjs` 副檔名) |

### 3. 資料庫設定

確保 MySQL 正常運行，並在index.js中初始化資料庫。

### 4. 伺服器啟動

- 前端： `http://localhost:3000`
- 後端 API： `http://localhost:8081`
