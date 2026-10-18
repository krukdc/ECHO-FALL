# ECHO-FALL

**語言 / Język / Language:** [Polski](README.md) · [English](README.en.md) · [繁體中文](README.zh-TW.md)

ECHO-FALL 是一款可離線遊玩的單檔 HTML 動作遊戲。目前的正式遊戲版本為 `ECHO-FALL.build.0.12.0.html`。

## 如何開始遊玩

1. 從儲存庫或[最新發布版本](https://github.com/krukdc/ECHO-FALL/releases/latest)下載 `ECHO-FALL.build.0.12.0.html`，並使用 Chrome、Edge 或 Firefox 等新版瀏覽器開啟。
2. 在標題畫面開始一場遊戲。無須安裝、架設伺服器或連上網路。
3. 在手機上使用瀏覽器開啟檔案。遊戲會偵測觸控操作並顯示螢幕控制按鈕。也可以將手機轉為橫向，遊戲版面會配合螢幕方向調整。

遊戲進度、解鎖項目和語言設定會儲存在瀏覽器本機（`localStorage`）。清除瀏覽器資料可能會刪除此存檔。

## 操作方式

| 動作 | 鍵盤 | 觸控螢幕 |
| --- | --- | --- |
| 移動 | WASD 或方向鍵（可重新設定） | 螢幕上的虛擬搖桿 |
| 瞄準 | IJKL（可重新設定） | 攻擊時自動瞄準 |
| 一般攻擊 | Z（可重新設定） | A / FIRE |
| Nova | X（可重新設定） | B / NOVA |
| Blink | 空白鍵（可重新設定） | L / BLINK |
| 角色狀態 | C | SELECT |
| 暫停 | Escape | START |

可在標題畫面或暫停選單的設定中，選擇波蘭文、英文或繁體中文，也可以重新設定電腦版按鍵。語言和按鍵設定會儲存在瀏覽器本機。方向鍵仍可作為移動的替代操作。標題列或暫停選單中的 ⛶ 按鈕可切換全螢幕模式。

## 專案檔案

- `ECHO-FALL.build.0.12.0.html` — 包含 HTML、CSS 和 JavaScript 的目前遊戲版本。
- `Older Versions/` — 先前遊戲版本的封存資料夾。
- `docs/superpowers/specs/` — 已核准的專案規格。
- `docs/superpowers/plans/` — 實作與戰役規劃。
- `TODO.md` — 已知問題與未來開發構想。
- `dev/echo-fall-main-source/` — 不含 Debug 功能的主遊戲 0.12.0 整理後原始碼。
- 含有 DEBUGGING ROOM 的 Test Build 0.12.1 保留為本機測試版本，不會發布於此儲存庫。

## 開發原始碼（選用）

遊玩只需要一個 HTML 檔案。只有開發遊戲時才需要原始碼和建置步驟。請先安裝 Node.js，然後在儲存庫資料夾執行：

```powershell
node dev/echo-fall-main-source/tools/build.mjs
```

此指令會在儲存庫根目錄產生 `ECHO-FALL.build.0.12.0.html`。含有 Debug 功能的 Test Build 0.12.1 保留於本機，不包含在儲存庫中。

## 回報問題

開啟 **Issues** 分頁並選擇 **Report a bug** 表單。請提供遊戲版本、裝置、瀏覽器、螢幕方向，以及重現問題的操作步驟。此儲存庫為公開狀態，因此所有人都能看到問題回報與留言。

## Git 基本操作

請在專案資料夾中執行以下指令：

```powershell
git status
git log --oneline
git add README.md README.en.md README.zh-TW.md TODO.md
git commit -m "簡短描述這次變更"
```

每項較大的獨立變更建議分別建立一個 commit。建立前可先用 `git diff` 檢查變更內容。
