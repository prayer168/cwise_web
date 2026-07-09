# Session Handoff: CWISE 生態探員互動網站

更新日期：2026-07-09  
專案位置：`D:\我的雲端硬碟\google drive\000000000backup\00000000計畫比賽\114cwise\cwise_web`

## 專案目標

本專案是「生態探員任務：用測量證據解開生物適應密碼」互動網站，服務國小高年級自然科學探究課程與教案比賽展示。

定位：
- 可投影、可用平板操作的課堂互動網站。
- 小組用組別代碼進入，不做複雜帳號系統。
- 學生資料存在瀏覽器 localStorage。
- 支援 Excel 匯入/匯出，方便小組資料交換與班級彙整。
- 同時具備比賽展示用的教師儀表板與成果頁。

## 目前狀態

GitHub repo：
- `https://github.com/prayer168/cwise_web`

GitHub Pages：
- `https://prayer168.github.io/cwise_web/`

本機開發網址：
- `http://127.0.0.1:5173/`

最新 commits：
- `36b799e` `Switch group exchange to Excel workbooks`
- `2657809` `Add classroom dashboard and assessment workflow`
- `1dbe5df` `Add eco detective web app`

目前工作樹：
- `main` 分支乾淨，已同步 `origin/main`。

## 技術棧

- Vite
- React
- Chart.js / react-chartjs-2
- lucide-react
- xlsx
- GitHub Pages

主要檔案：
- `src/main.jsx`：全部互動邏輯與主要元件。
- `src/styles.css`：所有版面與視覺樣式。
- `public/assets/course-schedule.jpg`：課程時程圖。
- `vite.config.js`：GitHub Pages 使用 `base: "./"`。
- `package.json`：scripts 與 dependencies。

常用指令：

```powershell
cd "D:\我的雲端硬碟\google drive\000000000backup\00000000計畫比賽\114cwise\cwise_web"
& "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" dev
& "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" build
```

## 已完成功能

### 第一版

- 任務總覽。
- 小組代碼與調查地點。
- 學生任務表單。
- 生物適應配對。
- 測量與觀察紀錄。
- 即時圖表。
- 成果頁列印。
- 教師展示頁。

### 第二版

- 任務完成進度與任務卡勾選。
- 小組資料加入班級展示。
- 最強適應生物設計：
  - 環境卡。
  - 生物名稱。
  - 適應特徵。
  - 作品圖上傳。
- 評量與反思：
  - 測量紀錄。
  - 證據推論。
  - 合作分工。
  - 創作應用。
  - 同儕回饋。
  - 自評三題。
- 教師班級儀表板：
  - 小組數。
  - 平均種類數。
  - 平均完成度。
  - 平均評量分。
  - 各組生物種類圖表。
  - 各組評量圖表。
  - 小組成果牆。

### Excel 匯入/匯出

使用者要求將小組 JSON 匯入/匯出改成 `.xls/.xlsx`。

目前狀態：
- 工具列顯示「匯入小組 Excel」。
- 接受 `.xls` / `.xlsx`。
- 工具列顯示「匯出 Excel」。
- 匯出檔名：`eco-detective-組別.xlsx`。
- 匯出後狀態列顯示「Excel 已匯出」。
- 仍保留 CSV 匯出，供測量資料分析。

Excel 工作表：
- `小組資訊`
- `小組分工`
- `適應配對`
- `測量紀錄`
- `生物觀察`
- `適應生物特徵`
- `任務進度`
- `評量規準`
- `自我反思`
- `_raw`：隱藏工作表，保留完整 JSON 狀態，匯回網站時可完整還原。

注意：
- localStorage 內部仍使用 JSON 字串，這是內部儲存格式，不是使用者交換格式。
- `xlsx` 已改成 dynamic import，避免首頁初始 bundle 過大。

## 部署流程

原始碼推到 `main`：

```powershell
git add .
git commit -m "..."
git push origin main
```

GitHub Pages 部署使用 `gh-pages` 分支，內容來自 `dist`。

已使用過的部署方式：

```powershell
$deploy = Join-Path $env:TEMP 'cwise_web_gh_pages_deploy'
Set-Location $deploy
git fetch origin
git checkout gh-pages
git pull --ff-only origin gh-pages
Get-ChildItem -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
Copy-Item -Path 'D:\我的雲端硬碟\google drive\000000000backup\00000000計畫比賽\114cwise\cwise_web\dist\*' -Destination $deploy -Recurse -Force
New-Item -ItemType File -Path (Join-Path $deploy '.nojekyll') -Force | Out-Null
git add .
git commit -m "Deploy ..."
git push origin gh-pages
```

Pages 驗證：

```powershell
gh api repos/prayer168/cwise_web/pages
Invoke-WebRequest -UseBasicParsing -Uri 'https://prayer168.github.io/cwise_web/'
```

## 原始教案重點

課程名稱：
- 生態探員任務：用測量證據解開生物適應密碼

節數：
- 6 節課

學習核心：
- 生物適應與多樣性。
- 科學測量工具與方法。
- 校園微棲地調查。
- 資料圖表分析。
- 證據推論。
- 創作與發表。

六節課摘要：

1. 發現生物適應密碼
   - 案例圖卡。
   - 生物、適應特徵、環境壓力配對。
   - 釐清「適應不是故意改變」。

2. 測量工具訓練
   - 溫度、照度、濕度、長度、放大鏡觀察。
   - 三次測量與誤差比較。
   - 生態探員守則。

3. 校園微棲地調查
   - 陽光草地、樹蔭下、花圃、生態池旁、牆角、落葉堆。
   - 小組分工。
   - 生物與環境資料紀錄。
   - AI 辨識需查證。

4. 證據會說話：圖表分析
   - 資料清理。
   - 生物數量長條圖。
   - 環境因子比較圖。
   - 地點－物種矩陣。
   - 討論樣本數、誤差與過度推論。

5. 設計最強適應生物
   - 抽環境卡。
   - 設計至少 3 個適應特徵。
   - 每個特徵要對應環境壓力與證據。
   - 可用 AI 圖像或學生繪圖。

6. 生態探員成果發布會
   - 調查地點。
   - 資料圖表。
   - 發現。
   - 最強適應生物。
   - 改進建議。
   - 互評與自評。

## 下一個需求：六堂課網頁式簡報

使用者上一則需求：

> 針對這六堂課，分別設計網頁式簡報。每個簡報至少 15 到 20 頁，請調用 Image 2.0 生成簡報所需要的背景圖、插圖或 Logo 等元素。

請下一個 session 優先接續這個需求。

建議實作方向：

1. 在網站中新增「網頁式簡報」模組。
2. 為六堂課各建立一個簡報：
   - lesson-1：發現生物適應密碼。
   - lesson-2：測量工具訓練。
   - lesson-3：校園微棲地調查。
   - lesson-4：證據會說話。
   - lesson-5：設計最強適應生物。
   - lesson-6：成果發布會。
3. 每份簡報 15 到 20 頁。
4. 形式建議：
   - React 內建簡報檢視器。
   - 鍵盤左右鍵換頁。
   - 投影模式 16:9。
   - 每頁支援標題、重點、任務提示、圖片、問題、活動步驟。
   - 可由主頁或教師展示頁進入。
5. 可新增檔案結構：

```text
src/
  presentationData.js
  PresentationDeck.jsx
  PresentationIndex.jsx
public/
  assets/
    presentation/
```

6. Image 2.0 / `image_gen` 需求：
   - 必須依系統工具規範使用 `image_gen` 產生點陣圖。
   - 每次生成圖像前最好先規劃整體視覺風格，避免六份簡報風格不一致。
   - 圖像風格建議：自然科學任務感、校園生態調查手冊、清楚明亮、適合國小高年級。
   - 避免過度幼齡或太卡通化。

建議先生成或準備的視覺素材：

- 全站 / 簡報共用 Logo：
  - 「生態探員任務」徽章。
  - 放大鏡、葉片、資料點、校園地圖元素。

- Lesson 1 背景 / 插圖：
  - 生物適應案例拼貼：仙人掌、水黽、蝴蝶、蚯蚓、榕樹氣根。
  - 環境壓力概念圖：乾燥、強光、水面、陰暗土壤。

- Lesson 2 背景 / 插圖：
  - 測量工具桌面：溫度計、照度計、土壤濕度計、直尺、放大鏡、平板。
  - 正確測量姿勢示意。

- Lesson 3 背景 / 插圖：
  - 校園微棲地地圖：陽光草地、樹蔭、花圃、生態池、牆角、落葉堆。
  - 小組分工角色卡。

- Lesson 4 背景 / 插圖：
  - 資料圖表分析情境：長條圖、折線圖、便利貼走讀、資料牆。
  - 證據與推論的區分圖。

- Lesson 5 背景 / 插圖：
  - 最強適應生物設計工作台。
  - 環境卡：強風乾燥屋頂、潮濕陰暗牆角、污染水域、烈日草地、低溫高山。

- Lesson 6 背景 / 插圖：
  - 成果發布會舞台。
  - 小組發表、同儕提問、成果海報牆。

## 建議六份簡報頁面架構

每堂 15 到 20 頁，可先做 16 頁標準版。

### Lesson 1：發現生物適應密碼

1. 封面。
2. 今日任務。
3. 探員情境。
4. 觀察暖身。
5. 案例 1：仙人掌。
6. 案例 2：水黽。
7. 案例 3：蚯蚓。
8. 案例 4：黑面琵鷺或蝴蝶。
9. 三欄配對規則。
10. 小組配對任務。
11. 常見迷思。
12. 適應概念統整。
13. 校園情境預測。
14. 形成性評量。
15. Exit ticket。
16. 下一節預告。

### Lesson 2：測量工具訓練

1. 封面。
2. 今日任務。
3. 為什麼要測量。
4. 工具總覽。
5. 溫度計。
6. 照度計。
7. 土壤濕度計。
8. 直尺與放大鏡。
9. 單位提醒。
10. 三次測量。
11. 測量誤差。
12. 四站輪流操作。
13. 共用表單紀錄。
14. 生態探員守則。
15. 操作檢核。
16. 下一節預告。

### Lesson 3：校園微棲地調查

1. 封面。
2. 今日任務。
3. 微棲地是什麼。
4. 校園調查地點。
5. 小組分工。
6. 觀察規範。
7. 紀錄欄位。
8. 環境測量。
9. 生物觀察。
10. 拍照與 AI 辨識。
11. 事實與推測。
12. 資料上傳。
13. 初步發現。
14. 小組回報。
15. 調查安全。
16. 下一節預告。

### Lesson 4：證據會說話

1. 封面。
2. 今日任務。
3. 資料清理。
4. 單位一致。
5. 空白與異常值。
6. 圖表選擇。
7. 長條圖。
8. 環境因子比較圖。
9. 地點－物種矩陣。
10. 證據句型。
11. 相關不等於因果。
12. 樣本數與限制。
13. 資料牆走讀。
14. 便利貼提問。
15. 修正推論。
16. 下一節預告。

### Lesson 5：設計最強適應生物

1. 封面。
2. 今日任務。
3. 環境卡抽題。
4. 環境壓力分析。
5. 構造策略。
6. 行為策略。
7. 繁殖或防禦策略。
8. 證據連結。
9. 設計四格表。
10. AI 圖像提示。
11. 科學合理性檢查。
12. 同儕審查規準。
13. 修正作品。
14. 發表準備。
15. 作品上傳。
16. 下一節預告。

### Lesson 6：成果發布會

1. 封面。
2. 今日任務。
3. 發表架構。
4. 調查地點。
5. 資料圖表。
6. 主要發現。
7. 最強適應生物。
8. 改進建議。
9. 3 分鐘發表規則。
10. 聽眾任務。
11. 證據提問。
12. 教師統整。
13. 素養情境題。
14. 自評反思。
15. 校園生態行動。
16. 課程結語。

## 注意事項

- 使用者已明確要求調用 Image 2.0 生成素材。下一個 session 若要執行簡報製作，應先使用 `image_gen` 生成共用 Logo 與各課程背景/插圖。
- 若要新增前端功能，請維持目前自然科學任務感，不要改成行銷式 landing page。
- 避免大量新增卡片巢狀卡片。
- 網頁簡報應能投影，建議 16:9、字大、每頁資訊量控制。
- 簡報頁最好可以離線使用，不依賴外部圖庫。
- 若生成圖像後要放入專案，請存進 `public/assets/presentation/` 或類似資料夾。

