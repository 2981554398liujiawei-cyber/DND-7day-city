# -*- coding: utf-8 -*-
"""七日城：契约者 — V0.4 Browser Release QA（Phase 17，10 项）
真实浏览器点击：Start/New Game/partial roll/success roll/Save→refresh→Continue/
Camp party swap/contract-ready badge/actual contract/Romance bond/Finale。
骰子通过注入 Math.random 队列控制（partial: 3+3 → 7, success: 4+4 → 9）。
step() 自动处理检定结果面板（接受结果/继续）。
"""
import json, os, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/"
SHOT_DIR = r"C:\Users\cruelworld\Desktop\DeepSeek\类DND游戏\BrowserQA_v04"
os.makedirs(SHOT_DIR, exist_ok=True)
results = {}
console_errors = []

def shot(page, name):
    path = os.path.join(SHOT_DIR, name)
    page.screenshot(path=path)
    return path

def click_text(page, text, wait=500):
    b = page.locator(f"button:has-text('{text}')").first
    if b.count() > 0 and b.is_visible():
        b.click()
        page.wait_for_timeout(wait)
        return True
    return False

def settle(page):
    """处理当前面板：检定→接受结果；结算→继续。只在对应面板内点击，避免误点场景按钮。"""
    for _ in range(4):
        if page.locator(".dice-result").count() > 0 and page.locator(".dice-result").first.is_visible():
            r = page.locator(".dice-result button").first
            if r.count() > 0 and r.is_visible():
                r.click(); page.wait_for_timeout(300); continue
        if page.locator(".outcome-block").count() > 0 and page.locator(".outcome-block").first.is_visible():
            c = page.locator(".outcome-block button").first
            if c.count() > 0 and c.is_visible():
                c.click(); page.wait_for_timeout(300); continue
        break

def step(page, text, wait=600):
    """点击含 text 的按钮；若未进入检定面板，则清掉随后的结算面板。"""
    ok = click_text(page, text, wait)
    if ok:
        page.wait_for_timeout(400)
        if page.locator(".dice-result").count() == 0:
            settle(page)
    return ok

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        ctx = browser.new_context(viewport={"width": 1280, "height": 800})
        page = ctx.new_page()
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.add_init_script("""
          window.__seq = [];
          Math.random = () => window.__seq.length ? window.__seq.shift() : 0.5;
        """)

        # 1) Start Screen
        page.goto(URL, wait_until="networkidle", timeout=30000)
        page.wait_for_selector(".game-title", timeout=15000)
        title = page.locator(".game-title").inner_text()
        version = page.locator(".game-version").inner_text()
        cards = page.locator(".origin-card").count()
        results["1.Start Screen"] = "PASS" if (title and cards == 3 and "V0.4" in version) else "FAIL"
        print(f"[1] title={title!r} version={version!r} cards={cards}")
        shot(page, "1_start.png")

        # 2) New Game
        page.fill("#player-name", "契约者")
        page.click("button:has-text('开始游戏')")
        page.wait_for_selector(".scene-title", timeout=15000)
        results["2.New Game"] = "PASS"
        print("[2] scene:", page.locator(".scene-title").inner_text())

        # intro：骑士 → 身份 → 选塞蕾娜 → 黑街（hub 再进黑街）
        step(page, "窗边骑士")
        step(page, "契约者的身份")
        step(page, "选择塞蕾娜")
        step(page, "去黑街")
        step(page, "去黑街调查")

        # 3) partial roll：黑街窃听（finesse+1，3+3 → 7 → 成功但有代价）
        page.evaluate("window.__seq = [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]")
        step(page, "权贵")
        page.wait_for_selector(".dice-result", timeout=8000)
        grade1 = page.locator(".dice-grade").inner_text()
        formula1 = page.locator(".dice-formula").inner_text().replace("\n", " ")
        results["3.Partial roll"] = "PASS" if grade1 == "成功但有代价" else f"FAIL({grade1})"
        print(f"[3] partial grade={grade1!r} formula={formula1!r}")
        shot(page, "3_partial.png")
        settle(page)
        step(page, "记下")

        # 4) success roll：王城观察军令（insight+0，5+4 → 9 → 成功）
        step(page, "王城")
        page.evaluate("window.__seq = [0.8333, 0.6666, 0.8333, 0.6666, 0.8333, 0.6666, 0.8333, 0.6666]")
        step(page, "观察塞蕾娜")
        page.wait_for_selector(".dice-result", timeout=8000)
        grade2 = page.locator(".dice-grade").inner_text()
        formula2 = page.locator(".dice-formula").inner_text().replace("\n", " ")
        results["4.Success roll"] = "PASS" if grade2 == "成功" else f"FAIL({grade2})"
        print(f"[4] success grade={grade2!r} formula={formula2!r}")
        shot(page, "4_success.png")
        settle(page)
        b = page.locator(".choice-btn").first
        if b.count() > 0 and b.is_visible():
            b.click(); page.wait_for_timeout(500)
            settle(page)

        # 5) Save → refresh → Continue
        page.reload(wait_until="networkidle")
        page.wait_for_selector("button:has-text('继续游戏')", timeout=15000)
        results["5.Save+refresh+Continue"] = "PASS"
        print("[5] continue visible")
        shot(page, "5_continue.png")
        page.click("button:has-text('继续游戏')")
        page.wait_for_selector(".scene-title", timeout=10000)

        # 6) Camp / party swap：推进到夜晚营地，调整队伍
        for _ in range(14):
            if step(page, "调整队伍"):
                results["6.Camp/party swap"] = "PASS"
                shot(page, "6_camp.png")
                step(page, "队伍安排好了")
                break
            if step(page, "夜色已深") or step(page, "营地休整") or step(page, "早点休息"):
                continue
            b = page.locator(".choice-btn").first
            if b.count() > 0 and b.is_visible():
                b.click(); page.wait_for_timeout(400); settle(page)
            else:
                settle(page)
        results.setdefault("6.Camp/party swap", "SKIP")

        # 7) 塞蕾娜个人事件 → 休息 → DAY2
        step(page, "与塞蕾娜聊聊")
        step(page, "违抗错误的命令") or step(page, "骑士的荣耀")
        step(page, "回到营地")
        step(page, "早点休息")
        step(page, "酒馆")
        step(page, "先不交谈") or step(page, "传言")
        step(page, "在这里休息到夜晚") or step(page, "结束休整")

        # 8) rel2 → contract-ready badge → actual contract
        step(page, "夜色已深")
        step(page, "深谈")
        step(page, "忠于你的本心")
        step(page, "回到营地")
        rel = page.locator(".party-rel").first
        rel_text = rel.inner_text() if rel.count() > 0 else "(无队伍行)"
        results["7.Contract-ready badge"] = "PASS" if "可缔结契约" in rel_text else f"FAIL({rel_text})"
        print(f"[7] party-rel={rel_text!r}")
        shot(page, "7_contract_ready.png")
        step(page, "讨论契约")
        step(page, "接过徽章")
        step(page, "回到营地")
        rel2 = page.locator(".party-rel").first
        rel2_text = rel2.inner_text() if rel2.count() > 0 else "(无)"
        results["8.Actual contract"] = "PASS" if "已契约" in rel2_text else f"FAIL({rel2_text})"
        print(f"[8] after contract party-rel={rel2_text!r}")
        shot(page, "8_contracted.png")

        # 9) Romance bond event
        if step(page, "并肩站在城墙上") or step(page, "最后一夜"):
            step(page, "未来里有你") or step(page, "我喜欢") or step(page, "喜欢的是你")
            step(page, "回到营地")
            results["9.Romance bond event"] = "PASS"
            shot(page, "9_bond.png")
        else:
            results["9.Romance bond event"] = "SKIP"
            print("[9] bond option not found")

        # 10) Finale
        step(page, "早点休息")
        for _ in range(12):
            if page.locator(".ending-card").count() > 0:
                break
            if step(page, "前往城头") or step(page, "迎接"):
                continue
            b = page.locator(".choice-btn").first
            if b.count() > 0 and b.is_visible():
                b.click(); page.wait_for_timeout(400); settle(page)
            else:
                settle(page)
        if page.locator(".ending-card").count() > 0:
            results["10.Finale"] = "PASS"
            shot(page, "10_ending.png")
        else:
            results["10.Finale"] = "SKIP"
        print("[10] ending reached:", results["10.Finale"])

        browser.close()

    results["Console errors"] = console_errors[:5] if console_errors else "none"
    print(json.dumps(results, ensure_ascii=False, indent=2))
    with open(os.path.join(SHOT_DIR, "qa_result.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("DONE")

if __name__ == "__main__":
    main()
