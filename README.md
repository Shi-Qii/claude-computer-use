# Claude Computer Use

用 Claude AI 自動操控瀏覽器完成任務。你給一句話描述，Claude 會自己看畫面、點擊、輸入、捲動，直到任務完成。

---

## 原理

```
你輸入任務描述
  → 截圖當前頁面
  → 傳給 Claude API
  → Claude 回傳動作（點哪裡、打什麼字）
  → Playwright 執行動作
  → 再截圖
  → 重複，直到 Claude 說完成
```

---

## 環境需求

- Node.js v18 以上（[下載](https://nodejs.org)）
- Anthropic API Key（[取得](https://console.anthropic.com/settings/keys)）

---

## 安裝步驟

**1. 安裝依賴套件**

```bash
npm install
```

**2. 安裝 Chromium 瀏覽器**

```bash
npx playwright install chromium
```

**3. 建立 `.env` 設定檔**

```bash
cp .env.example .env
```

用任何編輯器打開 `.env`，把 `your_api_key_here` 換成你的 Anthropic API Key：

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> `.env` 已加入 `.gitignore`，不會被上傳到 GitHub。

---

## 使用方式

```bash
npm start "<任務描述>" "<目標網址>"
```

**範例：**

```bash
# 用 Google 搜尋
npm start "搜尋 Anthropic 官網並點進去" "https://www.google.com"

# 操作特定網站
npm start "找到登入按鈕並點擊" "https://example.com"
```

執行後會自動打開 Chrome 視窗，你可以看著 Claude 實際操作畫面。

---

## 專案結構

```
claude-computer-use/
├── src/
│   ├── index.js    # 入口，讀取 CLI 參數
│   ├── loop.js     # 主迴圈（截圖 → Claude → 執行 → 重複）
│   ├── claude.js   # 呼叫 Anthropic API
│   └── actions.js  # Playwright 動作執行
├── .env.example    # API Key 設定範本
├── .gitignore
└── package.json
```

---

## 注意事項

- 每個步驟都會傳一張截圖給 Claude，**token 消耗較快**，建議先用簡單任務測試
- 預設最多執行 **50 步**，避免無限迴圈
- 視窗解析度固定 **1280 × 800**，不受螢幕大小影響

---

## 常見問題

**Q: 出現 `ANTHROPIC_API_KEY` 錯誤？**
確認 `.env` 檔案存在，且 key 格式正確（`sk-ant-` 開頭）。

**Q: Chromium 沒有打開？**
執行 `npx playwright install chromium` 重新安裝瀏覽器。

**Q: Claude 一直做錯動作？**
任務描述越具體越好，例如「點擊右上角的登入按鈕」優於「登入」。
