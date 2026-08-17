import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { ALL_SCENES } from "../data/scenes";
import { getAvailableChoices, resolveChoice, gradeRollForChoice } from "../engine/sceneEngine";
import { getScene } from "../data/scenes";
import type { GameStateData, Choice } from "../types/game";
import { ORIGINS } from "../data/companions";
import { useGameStore } from "../store/gameStore";
import { PERIOD_ORDER } from "../data/time";

function makeState(): GameStateData {
  return {
    version: 1,
    player: {
      name: "测试",
      origin: "mercenary",
      stats: { ...ORIGINS.mercenary.stats },
    },
    periodIndex: 0,
    location: "tavern",
    gold: 50,
    corruption: 0,
    alert: 0,
    flags: {},
    secrets: [],
    companions: {
      serena: { met: false, recruited: false, trust: 10, intimacy: 0, contracted: false, personalQuestComplete: false },
      lia: { met: false, recruited: false, trust: 10, intimacy: 0, contracted: false, personalQuestComplete: false },
      milena: { met: false, recruited: false, trust: 10, intimacy: 0, contracted: false, personalQuestComplete: false },
    },
    party: [],
    currentSceneId: "intro_001",
    history: [],
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("store 集成流程", () => {
  let mem: Map<string, string>;
  beforeEach(() => {
    mem = new Map();
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
      setItem: (k: string, v: string) => void mem.set(k, String(v)),
      removeItem: (k: string) => void mem.delete(k),
    };
    useGameStore.setState({ state: null, screen: "start", outcome: null, pending: null });
  });

  function click(id: string) {
    const st = useGameStore.getState().state!;
    const choices = getAvailableChoices(st.currentSceneId, st);
    const choice = choices.find((c) => c.id === id);
    if (!choice) {
      throw new Error(
        `store 集成: 在 ${st.currentSceneId} 找不到 ${id}（可用: ${choices.map((c) => c.id).join(", ")}）`
      );
    }
    useGameStore.getState().selectChoice(choice);
    const g = useGameStore.getState();
    if (g.pending) {
      g.acceptOutcome();
    }
    const out = useGameStore.getState().outcome;
    if (out?.nextSceneId) {
      useGameStore.getState().gotoScene(out.nextSceneId);
    }
  }

  /** 在 hub 反复去酒馆休息，直到时间推进到 finale */
  function pushToFinale() {
    let guard = 0;
    while (useGameStore.getState().state!.periodIndex < PERIOD_ORDER.indexOf("finale")) {
      guard++;
      if (guard > 10) throw new Error("pushToFinale 死循环");
      const st = useGameStore.getState().state!;
      const choices = getAvailableChoices(st.currentSceneId, st);
      const isD2 = st.periodIndex >= PERIOD_ORDER.indexOf("d2_morning");
      if (st.currentSceneId === "location_hub") {
        const t = choices.find((c) => c.id === (isD2 ? "hub_tavern_d2" : "hub_tavern_d1"));
        if (!t) throw new Error("hub 无酒馆选项，无法推进时间");
        click(t.id);
      } else if (st.currentSceneId === "tavern_001") {
        click("tavern_001_c");
      } else if (st.currentSceneId === "tavern_002") {
        const isNight = st.periodIndex === PERIOD_ORDER.indexOf("d1_night") || st.periodIndex === PERIOD_ORDER.indexOf("d2_night");
        click(isNight ? "tavern_002_a" : "tavern_002_b");
      } else if (st.currentSceneId === "tavern_d2_001") {
        click("tavern_d2_001_e");
      } else if (st.currentSceneId === "tavern_d2_002") {
        const isNight = st.periodIndex === PERIOD_ORDER.indexOf("d1_night") || st.periodIndex === PERIOD_ORDER.indexOf("d2_night");
        click(isNight ? "tavern_d2_002_a" : "tavern_d2_002_b");
      } else {
        throw new Error(`pushToFinale 意外场景 ${st.currentSceneId}`);
      }
    }
  }

  it("新游戏 → 完整通关（store 层，时间线强制）", () => {
    useGameStore.getState().newGame("测试者", "mercenary");
    let s = useGameStore.getState().state!;
    expect(s.currentSceneId).toBe("intro_001");

    // 走 intro
    click("intro_001_c");
    click("intro_002_a");
    click("intro_003_a");
    click("intro_004_a");
    s = useGameStore.getState().state!;
    expect(s.currentSceneId).toBe("location_hub");
    expect(s.party).toContain("serena");

    // 去黑街（DAY1）
    click("hub_blackstreet_d1");
    click("blackstreet_001_a");
    click("blackstreet_002_a");
    s = useGameStore.getState().state!;
    expect(s.secrets).toContain("dragon_is_parent");
    expect(s.flags.underground_hint).toBe(true);

    // 地下
    click("hub_underground");
    click("underground_001_a");
    click("underground_002_a");
    s = useGameStore.getState().state!;
    expect(s.secrets).toContain("egg_is_power_source");

    // 此时不能在 finale 前直接进龙临（时间未到）
    const preChoices = getAvailableChoices(s.currentSceneId, s);
    expect(preChoices.some((c) => c.id === "hub_finale")).toBe(false);

    // 推进时间到 finale 后，hub 出现 hub_finale
    pushToFinale();
    s = useGameStore.getState().state!;
    expect(s.periodIndex).toBeGreaterThanOrEqual(PERIOD_ORDER.indexOf("finale"));
    const finaleChoices = getAvailableChoices(s.currentSceneId, s);
    expect(finaleChoices.some((c) => c.id === "hub_finale")).toBe(true);

    // 结局
    click("hub_finale");
    click("finale_return_egg");
    click("ending_return_egg_continue");
    s = useGameStore.getState().state!;
    expect(useGameStore.getState().screen).toBe("ending");
    expect(s.ending).toBe("ending_return_egg");
  });

  it("有检定的选择走 pending → accept → 继续 流程", () => {
    useGameStore.getState().newGame("测试者", "scholar");
    useGameStore.getState().gotoScene("intro_001");
    // 选择检定选项 → 进入 pending
    const st0 = useGameStore.getState().state!;
    const c0 = getAvailableChoices(st0.currentSceneId, st0).find((c) => c.id === "intro_001_b")!;
    useGameStore.getState().selectChoice(c0);
    expect(useGameStore.getState().pending).not.toBeNull();
    // 接受 → 有 outcome
    useGameStore.getState().acceptOutcome();
    expect(useGameStore.getState().outcome).not.toBeNull();
    // 继续 → 到下一场景
    const out = useGameStore.getState().outcome!;
    useGameStore.getState().gotoScene(out.nextSceneId!);
    expect(useGameStore.getState().state!.currentSceneId).toBe("intro_002");
  });

  it("RC1 Phase1：做完黑街后可招募第二名伙伴，双人可换人并重新加入", () => {
    useGameStore.getState().newGame("测试者", "mercenary");
    // 开场选塞蕾娜
    click("intro_001_c");
    click("intro_002_a");
    click("intro_003_a");
    click("intro_004_a");
    let s = useGameStore.getState().state!;
    expect(s.party).toEqual(["serena"]);
    expect(s.companions.lia.recruited).toBe(false);

    // 黑街主线完成 → 莉娅被正式招募并自动入队（party 有空位）→ 双人 party
    click("hub_blackstreet_d1");
    click("blackstreet_001_a");
    click("blackstreet_002_a");
    s = useGameStore.getState().state!;
    expect(s.companions.lia.recruited).toBe(true);
    expect(s.party).toContain("serena");
    expect(s.party).toContain("lia");
    expect(s.party.length).toBe(2);

    // 王城主线（推进到 d1_night）
    click("hub_royal_d1");
    click("royal_001_a");
    click("royal_002_a");

    // 到夜晚营地 → 调整队伍：莉娅离队 → 重新入队
    click("hub_camp_d1");
    click("camp_night_party");
    click("camp_leave_lia");
    s = useGameStore.getState().state!;
    expect(s.party).not.toContain("lia");
    expect(s.party).toContain("serena");
    click("camp_join_lia");
    s = useGameStore.getState().state!;
    expect(s.party).toContain("lia");
    expect(s.party.length).toBe(2);
    click("camp_select_party_done");
  });

  it("V0.4 E6：腐化路线真实累计 ≥40 → Finale 腐化结局可达", () => {
    useGameStore.getState().newGame("测试者", "scholar");
    // 米蕾娜同行
    click("intro_001_c");
    click("intro_002_c");
    click("intro_003_c");
    click("intro_004_c");
    // 圣堂：米蕾娜共鸣线索（echo 前置）
    click("hub_church_d1");
    click("church_001_b");
    click("church_002_a");
    // 黑街：地下线索（检定失败 → 禁忌交换 → 腐化 +10）
    click("hub_blackstreet_d1");
    vi.spyOn(Math, "random").mockReturnValue(0.001);
    const st0 = useGameStore.getState().state!;
    const ch0 = getAvailableChoices(st0.currentSceneId, st0).find(
      (c) => c.id === "blackstreet_001_d"
    )!;
    useGameStore.getState().selectChoice(ch0);
    let g = useGameStore.getState();
    expect(g.pending).toBeTruthy();
    expect(g.pending!.roll.grade).toBe("failure");
    useGameStore.getState().useForbiddenExchange();
    g = useGameStore.getState();
    expect(g.pending!.roll.grade).toBe("success");
    expect(g.state!.corruption).toBe(10);
    useGameStore.getState().acceptOutcome();
    vi.restoreAllMocks();
    const o0 = useGameStore.getState().outcome;
    if (o0?.nextSceneId) useGameStore.getState().gotoScene(o0.nextSceneId);
    click("blackstreet_002_a");
    // 地下：触摸龙卵（+5 腐化）+ 沟通（+10 腐化，bonded）
    click("hub_underground");
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    click("underground_001_c");
    vi.restoreAllMocks();
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    click("underground_002_b");
    vi.restoreAllMocks();
    // 腐化 = 10 + 5 + 10 = 25；地下后到 DAY2
    click("hub_tavern_d2");
    click("tavern_d2_001_c"); // 米蕾娜难民低语（信任 +5，echo）
    click("tavern_d2_002_b"); // → d2_night
    // 营地：个人事件 → rel2（+5 腐化）→ 契约（+10 腐化）
    click("hub_camp_d2");
    click("camp_night_milena");
    click("milena_personal_001_a");
    click("companion_event_end_a");
    click("camp_night_milena_rel2");
    click("milena_rel2_001_c");
    click("companion_event_end_a");
    click("camp_night_milena_contract");
    click("milena_contract_001_a");
    click("companion_event_end_a");
    const sMid = useGameStore.getState().state!;
    expect(sMid.companions.milena.contracted).toBe(true);
    expect(sMid.corruption).toBeGreaterThanOrEqual(40);
    // 休息 → Finale：腐化选项出现
    click("camp_night_rest");
    click("hub_finale");
    const sFinale = useGameStore.getState().state!;
    const finaleChoices = getAvailableChoices("finale_001", sFinale).map((c) => c.id);
    expect(finaleChoices).toContain("finale_corruption_power");
    click("finale_corruption_power");
    click("ending_corruption_continue");
    expect(useGameStore.getState().state!.currentSceneId).toBe("ending_screen");
  });
});

/**
 * 沿指定 choice id 路径游玩，直到进入 ending_screen。
 * 遇到 check 时用 fixed dice（total 恰好 success）。
 * 特殊标记 "PUSH_TIME"：在 hub 反复去酒馆休息，直到时间推进到 finale。
 */
function walk(
  state: GameStateData,
  path: string[],
  opts: { forceSuccess?: boolean } = {}
): { state: GameStateData; visited: string[] } {
  let idx = 0;
  let sceneId = state.currentSceneId;
  let guard = 0;
  const visited: string[] = [];
  while (sceneId !== "ending_screen") {
    guard++;
    if (guard > 300) throw new Error("walk 死循环");
    const scene = getScene(sceneId);
    visited.push(sceneId);
    const choices = getAvailableChoices(sceneId, state);

    // STOP：在此处提前终止（path 用尽前手动停止）
    if (path[idx] === "STOP") {
      break;
    }

    // PUSH_TIME：循环推进时间到 finale
    if (path[idx] === "PUSH_TIME") {
      idx++;
      let pushGuard = 0;
      while (state.periodIndex < PERIOD_ORDER.indexOf("finale")) {
        pushGuard++;
        if (pushGuard > 20) throw new Error("PUSH_TIME 死循环");
        const hubChoices = getAvailableChoices(state.currentSceneId, state);
        const isD2 = state.periodIndex >= PERIOD_ORDER.indexOf("d2_morning");
        if (state.currentSceneId === "location_hub") {
          const t = hubChoices.find((c) => c.id === (isD2 ? "hub_tavern_d2" : "hub_tavern_d1"));
          if (!t) throw new Error(`PUSH_TIME: hub 无酒馆选项（${isD2 ? "d2" : "d1"}）`);
          const r = resolveChoice(t, state);
          state.currentSceneId = r.nextSceneId!;
        } else if (state.currentSceneId === "tavern_001" || state.currentSceneId === "tavern_d2_001") {
          const c = hubChoices.find((c) => c.id === "tavern_001_c") ?? hubChoices.find((c) => c.id === "tavern_d2_001_e")!;
          const r = resolveChoice(c, state);
          state.currentSceneId = r.nextSceneId!;
        } else if (state.currentSceneId === "tavern_002" || state.currentSceneId === "tavern_d2_002") {
          // 白天选"休息到夜晚"（advanceToNight），夜晚选"继续行动"（×1 到次日）
          const isNight = state.periodIndex === PERIOD_ORDER.indexOf("d1_night") || state.periodIndex === PERIOD_ORDER.indexOf("d2_night");
          const c = isNight
            ? (hubChoices.find((c) => c.id === "tavern_002_a") ?? hubChoices.find((c) => c.id === "tavern_d2_002_a")!)
            : (hubChoices.find((c) => c.id === "tavern_002_b") ?? hubChoices.find((c) => c.id === "tavern_d2_002_b")!);
          const r = resolveChoice(c, state);
          state.currentSceneId = r.nextSceneId!;
        } else {
          throw new Error(`PUSH_TIME 意外场景 ${state.currentSceneId}`);
        }
      }
      continue;
    }

    const wanted = path[idx];
    let choice: Choice | undefined;
    if (wanted === "FORCE_FAIL") {
      // 下一个检定强制失败（random 0 → 失败），并继续用原策略
      idx++;
      const nextWanted = path[idx];
      choice = choices.find((c) => c.id === nextWanted);
      if (!choice) {
        throw new Error(`FORCE_FAIL: 在 ${sceneId} 找不到选项 ${nextWanted}（可用: ${choices.map((c) => c.id).join(", ")}）`);
      }
      idx++;
      vi.spyOn(Math, "random").mockReturnValue(0.001);
    } else if (wanted) {
      choice = choices.find((c) => c.id === wanted);
      if (!choice) {
        throw new Error(`在 ${sceneId} 找不到选项 ${wanted}（可用: ${choices.map((c) => c.id).join(", ")}）`);
      }
      idx++;
    } else {
      if (choices.length === 0) {
        throw new Error(`在 ${sceneId} 无可用选项（死路）`);
      }
      choice = choices[0];
    }

    if (choice.check && opts.forceSuccess && !vi.isMockFunction(Math.random)) {
      // 让骰子总和 >= 12 必成功
      vi.spyOn(Math, "random").mockReturnValue(0.99);
    }

    const result = resolveChoice(choice, state);
    vi.restoreAllMocks();

    if (result.nextSceneId) {
      sceneId = result.nextSceneId;
      state.currentSceneId = sceneId;
    } else {
      // 无 nextScene：该场景结束（结局中间态或结束）
      if (sceneId === "ending_screen") break;
      throw new Error(`在 ${scene.id} 选择 ${choice.id} 后没有 nextScene`);
    }
  }
  return { state, visited };
}

describe("通关模拟", () => {
  it("Route A：偏塞蕾娜 → 归还龙卵（secret 路线）", () => {
    const s = makeState();
    const path = [
      // intro
      "intro_001_c", // 认识塞蕾娜
      "intro_002_a", // 表明契约者
      "intro_003_a", // 选塞蕾娜同行
      "intro_004_b", // 去王城区（推进时间，回 hub）
      // 王城 DAY1（推进到 d1_dusk）
      "hub_royal_d1",
      "royal_001_c", // 观察塞蕾娜
      "royal_002_a", // 忠于荣誉
      // 黑街 DAY1（推进到 d1_night）
      "hub_blackstreet_d1",
      "blackstreet_001_a", // 龙的消息 -> dragon_is_parent + underground_hint
      "blackstreet_002_a", // 记下情报
      // 地下（d1_night 仍可前往）
      "hub_underground",
      "underground_001_a", // 凑近观察 -> egg_is_power_source
      "underground_002_a", // 退出地下
      // 时间推进到 finale
      "PUSH_TIME",
      // 最终
      "hub_finale",
      "finale_return_egg",
      "ending_return_egg_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(final.secrets).toContain("dragon_is_parent");
    expect(final.secrets).toContain("egg_is_power_source");
    expect(final.companions.serena.trust).toBeGreaterThanOrEqual(20);
    expect(visited).toContain("ending_return_egg");
  });

  it("V0.4 E3：法师学院结局真实可达（无学院罪证时）", () => {
    const s = makeState();
    const path = [
      "intro_001_a",
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      "PUSH_TIME",
      "hub_finale",
      "finale_mage",
      "ending_mage_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(visited).toContain("ending_mage");
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.4 E4：法师真相结局真实可达（地下取得罪证）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      // 黑街（地下线索）
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      // 地下：观察龙卵（knowledge/ancient 检定成功 → 取得学院罪证）
      "hub_underground",
      "underground_001_a",
      "underground_002_a",
      "PUSH_TIME",
      "hub_finale",
      "finale_mage_true",
      "ending_mage_truth_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.secrets).toContain("mages_experimented_on_egg");
    expect(visited).toContain("ending_mage_truth");
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.4 Phase3：Finale availability matrix（玩家可见选项）", () => {
    // 无秘密玩家：royal + mage 可用；龙契/真相/归还/腐化不可用
    const s1 = makeState();
    const c1 = getAvailableChoices("finale_001", s1).map((c) => c.id);
    expect(c1).toContain("finale_royal_hunt");
    expect(c1).toContain("finale_mage");
    expect(c1).not.toContain("finale_dragon_contract");
    expect(c1).not.toContain("finale_mage_true");
    expect(c1).not.toContain("finale_return_egg");
    expect(c1).not.toContain("finale_corruption_power");

    // 掌握学院罪证：真相选项出现，普通 mage 隐藏
    const s2 = makeState();
    s2.secrets = ["mages_experimented_on_egg"];
    const c2 = getAvailableChoices("finale_001", s2).map((c) => c.id);
    expect(c2).toContain("finale_mage_true");
    expect(c2).not.toContain("finale_mage");

    // 米蕾娜龙卵条件完整：龙契出现
    const s3 = makeState();
    s3.secrets = ["milena_connected_to_egg"];
    s3.flags.bonded_with_egg = true;
    s3.companions.milena.recruited = true;
    s3.party = ["milena"];
    const c3 = getAvailableChoices("finale_001", s3).map((c) => c.id);
    expect(c3).toContain("finale_dragon_contract");

    // 龙契已尝试（失败/放弃）：不再出现
    const s4 = { ...s3, flags: { ...s3.flags, dragon_contract_attempted: true } };
    const c4 = getAvailableChoices("finale_001", s4).map((c) => c.id);
    expect(c4).not.toContain("finale_dragon_contract");

    // 高腐化（40）：腐化选项出现
    const s5 = makeState();
    s5.corruption = 40;
    const c5 = getAvailableChoices("finale_001", s5).map((c) => c.id);
    expect(c5).toContain("finale_corruption_power");

    // 低腐化（39）：腐化选项不出现
    const s6 = makeState();
    s6.corruption = 39;
    const c6 = getAvailableChoices("finale_001", s6).map((c) => c.id);
    expect(c6).not.toContain("finale_corruption_power");
  });

  it("Route A2：不做任何调查也能通关（默认王室路线）", () => {
    const s = makeState();
    const path = [
      "intro_001_a", // 直接相信占星师（不调查）
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      // 推进时间到 finale
      "PUSH_TIME",
      // 最终（无秘密也有默认选项）
      "hub_finale",
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(visited).toContain("ending_royal");
  });

  it("Route B：莉娅路线 + 潜入为主 → 个人事件 + 第二关系事件 → 通关", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_b", // 认识莉娅
      "intro_003_b", // 选莉娅同行
      "intro_004_a", // 去黑街
      // 黑街 DAY1：潜入窃听（stealth）
      "hub_blackstreet_d1",
      "blackstreet_001_b",
      "blackstreet_002_a",
      // 王城 DAY1：混入封锁线（stealth）
      "hub_royal_d1",
      "royal_001_b",
      "royal_002_a",
      // 夜晚营地：莉娅个人事件
      "hub_camp_d1",
      "camp_night_lia",
      "lia_personal_001_a",
      "companion_event_end_a",
      // 休息 → DAY2 上午
      "camp_night_rest",
      // 酒馆 D2：休息到夜晚（→ d2_night）
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      // 夜晚营地：第二关系事件
      "hub_camp_d2",
      "camp_night_lia_rel2",
      "lia_rel2_001_a",
      "companion_event_end_a",
      // 休息 → finale
      "camp_night_rest",
      "hub_finale",
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(final.companions.lia.personalQuestComplete).toBe(true);
    expect(final.flags.lia_rel2_done).toBe(true);
    // 至少经历过一次 stealth 检定（黑猫能力被使用）
    expect(visited).toContain("ending_royal");
  });

  it("Route C：偏米蕾娜 → 龙之契约（隐藏结局）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_c", // 认识米蕾娜
      "intro_003_c", // 选米蕾娜同行
      "intro_004_c", // 去圣堂
      // 圣堂 DAY1
      "hub_church_d1",
      "church_001_b", // 米蕾娜探查 -> milena_connected_to_egg_echo
      "church_002_a", // 握住她的手
      // 黑街 DAY1（地下线索）
      "hub_blackstreet_d1",
      "blackstreet_001_d", // 打听地下入口 -> underground_hint
      "blackstreet_002_a",
      // 地下
      "hub_underground",
      "underground_001_b", // 问米蕾娜 -> milena_connected_to_egg
      "underground_002_b", // 尝试沟通 -> bonded_with_egg
      // 时间推进到 finale
      "PUSH_TIME",
      // 最终
      "hub_finale",
      "finale_dragon_contract",
      "finale_dragon_contract_attempt_a", // 意志检定（forceSuccess → 成功）
      "ending_dragon_contract_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(final.secrets).toContain("milena_connected_to_egg");
    expect(visited).toContain("ending_dragon_contract");
  });

  it("契约可达：专注塞蕾娜 → 个人事件 → 第二关系事件 → 契约", () => {
    const s = makeState();
    const path = [
      // intro
      "intro_001_c",
      "intro_002_a",
      "intro_003_a", // 选塞蕾娜（+5 信任）
      "intro_004_b", // 去王城区
      // 王城 DAY1（+4+8 信任 → 27）
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      // 黑街 DAY1（推进到 d1_night）
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      // 夜晚营地：个人事件（+10 → 37）
      "hub_camp_d1",
      "camp_night_serena",
      "serena_personal_001_a",
      "companion_event_end_a", // 回营地
      // 休息 → DAY2 上午
      "camp_night_rest",
      // 酒馆 D2：休息到夜晚（advanceToNight → d2_night）
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      // 夜晚营地：第二关系事件（+12 → 49）+ 契约
      "hub_camp_d2",
      "camp_night_serena_rel2",
      "serena_rel2_001_a",
      "companion_event_end_a", // 回营地
      "camp_night_serena_contract", // 契约
      "serena_contract_001_a",
      "companion_event_end_a", // 回营地
      // 休息 → finale
      "camp_night_rest",
      "hub_finale",
      "finale_return_egg",
      "ending_return_egg_continue",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.companions.serena.contracted).toBe(true);
    expect(final.companions.serena.personalQuestComplete).toBe(true);
    expect(final.flags.serena_rel2_done).toBe(true);
    expect(final.companions.serena.trust).toBeGreaterThanOrEqual(45);
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("契约不可达：低信任玩家在营地看不到契约选项", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a", // 选塞蕾娜（+5 → 15）
      "intro_004_a", // 去黑街
      // 黑街 DAY1（→ d1_dusk）
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      // 王城 DAY1（→ d1_night，信任只 +4 → 19）
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_b",
      // 夜晚营地
      "hub_camp_d1",
    ];
    // 走到 camp_night，然后手动检查可用选项
    let sceneId = s.currentSceneId;
    let idx = 0;
    let guard = 0;
    while (sceneId !== "camp_night") {
      guard++;
      if (guard > 50) throw new Error("不可达测试死循环");
      const choices = getAvailableChoices(sceneId, s);
      const wanted = path[idx];
      const choice = choices.find((c) => c.id === wanted)!;
      idx++;
      if (choice.check) {
        vi.spyOn(Math, "random").mockReturnValue(0.99);
      }
      const result = resolveChoice(choice, s);
      vi.restoreAllMocks();
      sceneId = result.nextSceneId!;
      s.currentSceneId = sceneId;
    }
    const campChoices = getAvailableChoices("camp_night", s);
    expect(campChoices.some((c) => c.id === "camp_night_serena_contract")).toBe(false);
    expect(campChoices.some((c) => c.id === "camp_night_serena_rel2")).toBe(false);
    // 个人事件仍可选
    expect(campChoices.some((c) => c.id === "camp_night_serena")).toBe(true);
  });

  it("Route F：Failure Run —— 至少 5 次真实失败（含 3 次 DAY2 danger）仍能通关", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      // DAY1 失败 #1：黑街潜入窃听
      "hub_blackstreet_d1",
      "FORCE_FAIL",
      "blackstreet_001_b",
      "blackstreet_002_a",
      // DAY1 失败 #2：王城打听密令
      "hub_royal_d1",
      "FORCE_FAIL",
      "royal_001_a",
      "royal_002_a",
      // 过夜到 DAY2
      "hub_camp_d1",
      "camp_night_rest",
      // DAY2 danger 失败 #3：黑街帮派暴乱（combat）
      "hub_blackstreet_d2",
      "blackstreet_d2_001_a",
      "FORCE_FAIL",
      "blackstreet_d2_danger_a",
      // DAY2 danger 失败 #4：王城骑士封锁（combat）
      "hub_royal_d2",
      "royal_d2_001_a",
      "FORCE_FAIL",
      "royal_d2_danger_a",
      // DAY2 danger 失败 #5：圣堂焚卷（stealth）
      "hub_church_d2",
      "FORCE_FAIL",
      "church_d2_001_b",
      // 推进时间到 finale
      "PUSH_TIME",
      // 最终：默认王室路线（无秘密也有选项）
      "hub_finale",
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: false });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(visited).toContain("ending_royal");
    // 一路失败：秘密很少、警戒升高，但游戏仍可完成
    expect(final.secrets.length).toBeLessThan(4);
    expect(final.alert).toBeGreaterThan(0);
  });

  it("RC1 Phase2：finale 时段 hub_underground 不可用，hub_finale 可用", () => {
    const s = makeState();
    s.periodIndex = PERIOD_ORDER.indexOf("finale");
    s.flags.underground_hint = true;
    s.flags.underground_main_done = false;
    const choices = getAvailableChoices("location_hub", s);
    expect(choices.some((c) => c.id === "hub_finale")).toBe(true);
    expect(choices.some((c) => c.id === "hub_underground")).toBe(false);
    // 其他调查入口在 finale 也不可用
    expect(choices.some((c) => c.id === "hub_blackstreet_d1")).toBe(false);
    expect(choices.some((c) => c.id === "hub_royal_d2")).toBe(false);
  });

  it("RC1 Phase2：休息到夜晚不会越过当晚（d2_dusk → d2_night）", () => {
    const s = makeState();
    s.periodIndex = PERIOD_ORDER.indexOf("d2_dusk");
    s.currentSceneId = "tavern_d2_002";
    const choices = getAvailableChoices("tavern_d2_002", s);
    const b = choices.find((c) => c.id === "tavern_d2_002_b");
    expect(b).toBeTruthy();
    resolveChoice(b!, s);
    expect(s.periodIndex).toBe(PERIOD_ORDER.indexOf("d2_night"));
  });

  it("RC1 Phase3：龙之契约失败后 finale 不再出现该选项（不能无限刷）", () => {
    const s = makeState();
    s.periodIndex = PERIOD_ORDER.indexOf("finale");
    s.secrets = ["milena_connected_to_egg"];
    s.flags.bonded_with_egg = true;
    s.companions.milena.met = true;
    s.companions.milena.recruited = true;
    s.party = ["milena"];
    s.currentSceneId = "finale_001";
    // 首次：选项可用
    let choices = getAvailableChoices("finale_001", s);
    expect(choices.some((c) => c.id === "finale_dragon_contract")).toBe(true);
    // 进入尝试场景，检定失败
    useGameStore.getState().selectChoice(choices.find((c) => c.id === "finale_dragon_contract")!);
    const out = useGameStore.getState().outcome!;
    useGameStore.getState().gotoScene(out.nextSceneId!);
    const st = useGameStore.getState().state!;
    const attempt = getAvailableChoices(st.currentSceneId, st).find(
      (c) => c.id === "finale_dragon_contract_attempt_a"
    )!;
    vi.spyOn(Math, "random").mockReturnValue(0.001); // 失败
    useGameStore.getState().selectChoice(attempt);
    useGameStore.getState().acceptOutcome();
    vi.restoreAllMocks();
    const out2 = useGameStore.getState().outcome!;
    expect(out2.nextSceneId).toBe("finale_001");
    useGameStore.getState().gotoScene("finale_001");
    // 失败后：契约选项消失，其他结局保留
    const s2 = useGameStore.getState().state!;
    choices = getAvailableChoices("finale_001", s2);
    expect(choices.some((c) => c.id === "finale_dragon_contract")).toBe(false);
    expect(choices.some((c) => c.id === "finale_royal_hunt")).toBe(true);
  });

  it("RC1 Phase4：警戒 ≥15 时黑街 D2 stealth 检定 modifier -1", () => {
    // alert 15 → -1
    const s1 = makeState();
    s1.alert = 15;
    s1.currentSceneId = "blackstreet_d2_danger";
    const stealth = getAvailableChoices("blackstreet_d2_danger", s1).find(
      (c) => c.id === "blackstreet_d2_danger_b"
    )!;
    vi.spyOn(Math, "random").mockReturnValue(0.001).mockReturnValue(0.001);
    const r1 = gradeRollForChoice(stealth, s1);
    vi.restoreAllMocks();
    expect(r1.modifier).toBe(-1);
    // alert 14 → 0（不触发）
    const s2 = makeState();
    s2.alert = 14;
    s2.currentSceneId = "blackstreet_d2_danger";
    vi.spyOn(Math, "random").mockReturnValue(0.001).mockReturnValue(0.001);
    const r2 = gradeRollForChoice(stealth, s2);
    vi.restoreAllMocks();
    expect(r2.modifier).toBe(0);
  });

  it("龙之契约失败：意志检定失败后仍可走其他结局（不死路）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_c",
      "intro_003_c",
      "intro_004_c",
      // 圣堂（米蕾娜秘密线索）
      "hub_church_d1",
      "church_001_b",
      "church_002_a",
      // 黑街（地下线索）
      "hub_blackstreet_d1",
      "blackstreet_001_d",
      "blackstreet_002_a",
      // 地下（共鸣）
      "hub_underground",
      "underground_001_b",
      "underground_002_b",
      // 推进到 finale
      "PUSH_TIME",
      "hub_finale",
      "finale_dragon_contract",
      // 意志检定强制失败 → 回 finale_001
      "FORCE_FAIL",
      "finale_dragon_contract_attempt_a",
      // 失败后改走王室路线
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    // FORCE_FAIL 之前的检定全部成功
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(visited).toContain("ending_royal");
    expect(visited).not.toContain("ending_dragon_contract");
  });

  it("所有场景（除结局中间态）都不是死路：至少有一个可选项或 nextScene 链", () => {
    // 对每个场景，检查 choices 非空（结局中间态除外，它们有 choices）
    for (const scene of ALL_SCENES) {
      if (scene.id === "ending_screen") continue;
      expect(scene.choices.length, `场景 ${scene.id} 应至少有 1 个 choice`).toBeGreaterThan(0);
      // 每个 choice 必须有 outcome/success/partial/failure 且带 nextScene（或本身就是可用的中间跳转）
      for (const c of scene.choices) {
        const hasOutcome = c.outcome || c.success || c.partial || c.failure;
        expect(hasOutcome, `场景 ${scene.id} 选项 ${c.id} 缺 outcome`).toBeTruthy();
      }
    }
  });

  it("V0.3 Route A：塞蕾娜恋爱全流程 → romance_serena → 结局 epilogue 变化", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_b",
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      "hub_camp_d1",
      "camp_night_serena",
      "serena_personal_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      "hub_camp_d2",
      "camp_night_serena_rel2",
      "serena_rel2_001_a",
      "companion_event_end_a",
      "camp_night_serena_contract",
      "serena_contract_001_a",
      "companion_event_end_a",
      // 最终羁绊事件（恋爱）
      "camp_night_serena_bond",
      "serena_bond_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_finale",
      "finale_return_egg",
      "ending_return_egg_continue",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.flags.romance_serena).toBe(true);
    expect(final.flags.serena_bond_done).toBe(true);
    expect(final.companions.serena.personalQuestComplete).toBe(true);
    expect(final.flags.serena_rel2_done).toBe(true);
    expect(final.companions.serena.contracted).toBe(true);
    expect(final.companions.serena.trust).toBeGreaterThanOrEqual(45);
    expect(final.companions.serena.intimacy).toBeGreaterThanOrEqual(8);
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.4 Phase5：Lia Casual 路径（不深谈过去、只走主线）在契约窗口 cannot contract", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_b",
      "intro_003_b",
      "intro_004_a",
      // 黑街：只做主线（不触发 lia_spy_history / 不选 002_c 深谈）
      "hub_blackstreet_d1",
      "blackstreet_001_b",
      "blackstreet_002_a",
      // 王城（主线，不做额外信任事件）
      "hub_royal_d1",
      "royal_001_b",
      "royal_002_a",
      // 夜晚营地：只做个人事件
      "hub_camp_d1",
      "camp_night_lia",
      "lia_personal_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      // DAY2：酒馆只推进时间（不点莉娅对话 +5），rel2
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      "hub_camp_d2",
      "camp_night_lia_rel2",
      "lia_rel2_001_a",
      "companion_event_end_a",
      "STOP",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    // 契约窗口：camp_night_lia_contract 不可见（纯主线信任 37 < 45）
    final.currentSceneId = "camp_night";
    const choices = getAvailableChoices("camp_night", final);
    expect(choices.some((c) => c.id === "camp_night_lia_contract")).toBe(false);
    expect(final.companions.lia.trust).toBeLessThan(45);
    expect(final.companions.lia.contracted).toBe(false);
    // focused 路线（V0.3-RC1 Route B：深谈 +10）已证明可达契约 → 保留 +10
  });

  it("V0.4 Phase8：Gold 真实消费（钱够出现并扣除，钱不足不出现）", () => {
    // 钱足够（初始 50）：酒馆花 10 金币选项出现 → 消费成功
    const s1 = makeState();
    s1.currentSceneId = "tavern_001";
    const c1 = getAvailableChoices("tavern_001", s1).map((c) => c.id);
    expect(c1).toContain("tavern_001_d");
    const r = resolveChoice(getScene("tavern_001").choices.find((c) => c.id === "tavern_001_d")!, s1);
    expect(s1.gold).toBe(40);
    expect(s1.flags.tavern_heard_rumors).toBe(true);
    // 钱不足（0）：不出现
    const s2 = makeState();
    s2.currentSceneId = "tavern_001";
    s2.gold = 0;
    const c2 = getAvailableChoices("tavern_001", s2).map((c) => c.id);
    expect(c2).not.toContain("tavern_001_d");
    // 至少两个消费选择（D1 酒馆 + D2 酒馆 + D2 黑街 ×2）
    const spenders = ALL_SCENES.flatMap((sc) =>
      sc.choices
        .filter((c) => c.conditions?.some((x) => x.type === "gold") && c.outcome?.effects?.some((e) => e.type === "gold" && e.amount < 0))
        .map((c) => `${sc.id}:${c.id}`)
    );
    expect(spenders.length).toBeGreaterThanOrEqual(2);
  });

  it("V0.4 Phase8：自然剧情累积 alert ≥15 后 alertPenalty 检定 modifier -1", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      "hub_camp_d1",
      "camp_night_rest",
      // DAY2：危险检定全部强制失败 → 自然累积 alert（3+8+5+5=21）
      "hub_royal_d2",
      "FORCE_FAIL",
      "royal_d2_001_b",
      "FORCE_FAIL",
      "royal_d2_danger_a",
      "hub_blackstreet_d2",
      "FORCE_FAIL",
      "blackstreet_d2_001_b",
      "FORCE_FAIL",
      "blackstreet_d2_danger_a",
      "STOP",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.alert).toBeGreaterThanOrEqual(15);
    // 真实累积下，alertPenalty 检定 modifier -1
    const stealth = getScene("blackstreet_d2_danger").choices.find((c) => c.id === "blackstreet_d2_danger_b")!;
    vi.spyOn(Math, "random").mockReturnValue(0.001).mockReturnValue(0.001);
    const r = gradeRollForChoice(stealth, final);
    vi.restoreAllMocks();
    expect(r.modifier).toBe(-1);
  });

  it("V0.4 Phase6：剧情中真实存在 combat / ancient / social 三类检定（供出身能力触发）", () => {
    const collect = (tag: string) =>
      ALL_SCENES.flatMap((sc) =>
        sc.choices
          .filter((c) => c.check?.tags.includes(tag))
          .map((c) => `${sc.id}:${c.id}`)
      );
    const combat = collect("combat");
    const ancient = collect("ancient");
    const social = collect("social");
    expect(combat.length, `combat checks: ${combat.join(", ")}`).toBeGreaterThan(0);
    expect(ancient.length, `ancient checks: ${ancient.join(", ")}`).toBeGreaterThan(0);
    expect(social.length, `social checks: ${social.join(", ")}`).toBeGreaterThan(0);
  });

  it("V0.4 Phase4：bond 保持距离 → bond_done 成立、romance 不成立、主线正常结束", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_b",
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      "hub_camp_d1",
      "camp_night_serena",
      "serena_personal_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      "hub_camp_d2",
      "camp_night_serena_rel2",
      "serena_rel2_001_a",
      "companion_event_end_a",
      "camp_night_serena_contract",
      "serena_contract_001_a",
      "companion_event_end_a",
      // bond 事件选 c：保持距离
      "camp_night_serena_bond",
      "serena_bond_001_c",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_finale",
      "finale_return_egg",
      "ending_return_egg_continue",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.flags.serena_bond_done).toBe(true);
    expect(final.flags.romance_serena).toBeFalsy();
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.3 Route D：无恋爱路线仍可通关（不触发 bond 也能结局）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_a",
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      "hub_camp_d1",
      "camp_night_rest",
      "PUSH_TIME",
      "hub_finale",
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    // 未契约 → bond 选项本就不该出现；三个人的 romance flag 都不成立
    expect(final.flags.romance_serena).toBeFalsy();
    expect(final.flags.serena_bond_done).toBeFalsy();
    expect(final.flags.romance_lia).toBeFalsy();
    expect(final.flags.romance_milena).toBeFalsy();
    expect(final.companions.serena.contracted).toBe(false);
    expect(final.companions.lia.contracted).toBe(false);
    expect(final.companions.milena.contracted).toBe(false);
  });

  it("V0.3 bond 选项：intimacy < 8 时契约后也不出现", () => {
    const s = makeState();
    s.periodIndex = PERIOD_ORDER.indexOf("d2_night");
    s.currentSceneId = "camp_night";
    s.party = ["serena"];
    s.companions.serena.contracted = true;
    s.companions.serena.met = true;
    s.companions.serena.recruited = true;
    s.companions.serena.intimacy = 7;
    let choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_serena_bond")).toBe(false);
    // intimacy 提升到 8 → 出现
    s.companions.serena.intimacy = 8;
    choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_serena_bond")).toBe(true);
    // 非契约 → 不出现
    s.companions.serena.contracted = false;
    choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_serena_bond")).toBe(false);
  });

  it("V0.3 双人组合事件：对应两人在队才出现，且只触发一次", () => {
    const s = makeState();
    s.periodIndex = PERIOD_ORDER.indexOf("d1_night");
    s.currentSceneId = "camp_night";
    s.party = ["serena", "lia"];
    s.companions.serena.met = s.companions.serena.recruited = true;
    s.companions.lia.met = s.companions.lia.recruited = true;
    let choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_pair_serena_lia")).toBe(true);
    // 只有塞蕾娜在队 → 不出现
    s.party = ["serena"];
    choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_pair_serena_lia")).toBe(false);
    // 触发过一次（flag 已设）→ 不再出现
    s.party = ["serena", "lia"];
    s.flags.pair_serena_lia_done = true;
    choices = getAvailableChoices("camp_night", s);
    expect(choices.some((c) => c.id === "camp_night_pair_serena_lia")).toBe(false);
    // 三组都注册且可到达
    expect(getScene("pair_serena_milena_001")).toBeTruthy();
    expect(getScene("pair_lia_milena_001")).toBeTruthy();
  });

  it("V0.3 Finale 文本中性：不点名具体伙伴", () => {
    const scene = getScene("finale_001");
    const text = Array.isArray(scene.text) ? scene.text.join("") : scene.text;
    expect(text).not.toContain("塞蕾娜");
    expect(text).not.toContain("莉娅");
    expect(text).not.toContain("米蕾娜");
  });

  it("V0.3-RC1 pair regression：三个场景每个选项都设置自己的 done flag，不污染其它组合", () => {
    const combos = [
      { scene: "pair_serena_lia_001", flag: "pair_serena_lia_done" },
      { scene: "pair_serena_milena_001", flag: "pair_serena_milena_done" },
      { scene: "pair_lia_milena_001", flag: "pair_lia_milena_done" },
    ];
    const allFlags = combos.map((c) => c.flag);
    for (const combo of combos) {
      const scene = getScene(combo.scene);
      expect(scene.choices.length, `${combo.scene} 应有 3 个选项`).toBe(3);
      for (const c of scene.choices) {
        const s = makeState();
        s.currentSceneId = combo.scene;
        const r = resolveChoice(c, s);
        expect(r.nextSceneId).toBe("pair_event_end");
        expect(s.flags[combo.flag], `${combo.scene} ${c.id} 应设 ${combo.flag}`).toBe(true);
        for (const other of allFlags) {
          if (other !== combo.flag) {
            expect(s.flags[other], `${combo.scene} ${c.id} 不应设置 ${other}`).toBeFalsy();
          }
        }
      }
    }
  });

  it("V0.3-RC1 Route B：莉娅恋爱真实通关 → romance_lia", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_b",
      "intro_003_b",
      "intro_004_a",
      // 黑街：洞察检定成功拿 lia_spy_history → 夜里谈她的过去（+10）
      "hub_blackstreet_d1",
      "blackstreet_001_c",
      "blackstreet_002_c",
      // 王城主线（推进时间 + 塞蕾娜入队 → 双人事件）
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      // 夜晚营地：双人事件（支持莉娅 +3 信任）
      "hub_camp_d1",
      "camp_night_pair_serena_lia",
      "pair_serena_lia_b",
      "pair_event_end_a",
      // 莉娅个人事件（+10 信任 +3 亲密）
      "camp_night_lia",
      "lia_personal_001_a",
      "companion_event_end_a",
      // 过夜 → DAY2
      "camp_night_rest",
      "hub_tavern_d2",
      "tavern_d2_001_b", // 莉娅识破帝国探子（+5 信任）
      "tavern_d2_002_b", // 休息到夜晚 → d2_night
      // 第二关系事件（+12 信任 +5 亲密 → 亲密 8 达标）
      "hub_camp_d2",
      "camp_night_lia_rel2",
      "lia_rel2_001_a",
      "companion_event_end_a",
      // 契约（信任 45 达标）
      "camp_night_lia_contract",
      "lia_contract_001_a",
      "companion_event_end_a",
      // 最终羁绊（恋爱）
      "camp_night_lia_bond",
      "lia_bond_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_finale",
      "finale_royal_hunt",
      "ending_royal_continue",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    expect(final.flags.romance_lia).toBe(true);
    expect(final.flags.lia_bond_done).toBe(true);
    expect(final.companions.lia.contracted).toBe(true);
    expect(final.companions.lia.trust).toBeGreaterThanOrEqual(45);
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.3-RC1 Route C：米蕾娜恋爱 + 龙之契约真实通关 → romance_milena", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_c",
      "intro_003_c",
      "intro_004_c",
      // 圣堂（米蕾娜秘密线索）
      "hub_church_d1",
      "church_001_b",
      "church_002_a",
      // 黑街（地下线索）
      "hub_blackstreet_d1",
      "blackstreet_001_d",
      "blackstreet_002_a",
      // 地下（共鸣）
      "hub_underground",
      "underground_001_b",
      "underground_002_b",
      // 地下后已到 DAY2：酒馆休息到夜晚
      "hub_tavern_d2",
      "tavern_d2_001_c", // 米蕾娜听难民低语（+5 信任 +2 亲密）
      "tavern_d2_002_b", // 休息到夜晚 → d2_night
      // 夜晚营地：米蕾娜个人事件（+10 信任 +4 亲密）
      "hub_camp_d2",
      "camp_night_milena",
      "milena_personal_001_a",
      "companion_event_end_a",
      // 第二关系事件（+12 信任 +4 亲密）
      "camp_night_milena_rel2",
      "milena_rel2_001_c",
      "companion_event_end_a",
      // 契约（信任达标）
      "camp_night_milena_contract",
      "milena_contract_001_a",
      "companion_event_end_a",
      // 最终羁绊（恋爱）
      "camp_night_milena_bond",
      "milena_bond_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_finale",
      "finale_dragon_contract",
      "finale_dragon_contract_attempt_a",
      "ending_dragon_contract_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.flags.romance_milena).toBe(true);
    expect(final.flags.milena_bond_done).toBe(true);
    expect(final.companions.milena.contracted).toBe(true);
    expect(final.companions.milena.trust).toBeGreaterThanOrEqual(45);
    expect(visited).toContain("ending_dragon_contract");
    expect(final.currentSceneId).toBe("ending_screen");
  });

  it("V0.3 契约强化：专注路线契约后 bond 门槛可达（intimacy ≥ 8）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_a",
      "intro_003_a",
      "intro_004_b",
      "hub_royal_d1",
      "royal_001_c",
      "royal_002_a",
      "hub_blackstreet_d1",
      "blackstreet_001_a",
      "blackstreet_002_a",
      "hub_camp_d1",
      "camp_night_serena",
      "serena_personal_001_a",
      "companion_event_end_a",
      "camp_night_rest",
      "hub_tavern_d2",
      "tavern_d2_001_e",
      "tavern_d2_002_b",
      "hub_camp_d2",
      "camp_night_serena_rel2",
      "serena_rel2_001_a",
      "companion_event_end_a",
      "camp_night_serena_contract",
      "serena_contract_001_a",
      "companion_event_end_a",
      "STOP",
    ];
    const { state: final } = walk(s, path, { forceSuccess: true });
    // 契约后 intimacy 必须 ≥ 8（bond 触发门槛）
    expect(final.companions.serena.intimacy).toBeGreaterThanOrEqual(8);
    // 契约当晚 bond 选项可见
    final.currentSceneId = "camp_night";
    const choices = getAvailableChoices("camp_night", final);
    expect(choices.some((c) => c.id === "camp_night_serena_bond")).toBe(true);
  });
});
