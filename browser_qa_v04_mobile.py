# -*- coding: utf-8 -*-
"""V0.4 Browser Release QA — Mobile（390px）补充检查
Start Screen 渲染 + 新游戏进入 + 无横向滚动（核心流程桌面已验证）。
"""
import json, os, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/"
SHOT_DIR = r"C:\Users\cruelworld\Desktop\DeepSeek\类DND游戏\BrowserQA_v04"
os.makedirs(SHOT_DIR, exist_ok=True)
results = {}
console_errors = []

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, device_scale_factor=2)
    pg = ctx.new_page()
    pg.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    pg.goto(URL, wait_until="networkidle", timeout=30000)
    pg.wait_for_selector(".game-title", timeout=15000)
    # Start screen：无横向滚动 + 版本 + 三个出身
    w = pg.evaluate("document.documentElement.scrollWidth")
    vw = pg.evaluate("window.innerWidth")
    cards = pg.locator(".origin-card").count()
    version = pg.locator(".game-version").inner_text()
    results["M1.Start(390px)"] = "PASS" if (cards == 3 and "V0.4" in version) else "FAIL"
    results["M2.No-h-scroll(start)"] = "PASS" if w <= vw else f"FAIL(scrollW={w} vw={vw})"
    pg.screenshot(path=os.path.join(SHOT_DIR, "m1_start_390.png"), full_page=True)
    # 新游戏进入
    pg.fill("#player-name", "移动端")
    pg.click("button:has-text('开始游戏')")
    pg.wait_for_selector(".scene-title", timeout=15000)
    w2 = pg.evaluate("document.documentElement.scrollWidth")
    vw2 = pg.evaluate("window.innerWidth")
    results["M3.Game(390px)"] = "PASS" if pg.locator(".scene-title").count() > 0 else "FAIL"
    results["M4.No-h-scroll(game)"] = "PASS" if w2 <= vw2 else f"FAIL(scrollW={w2} vw={vw2})"
    pg.screenshot(path=os.path.join(SHOT_DIR, "m2_game_390.png"), full_page=True)
    b.close()

results["Console errors"] = console_errors[:5] if console_errors else "none"
print(json.dumps(results, ensure_ascii=False, indent=2))
with open(os.path.join(SHOT_DIR, "qa_mobile_result.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("DONE")
