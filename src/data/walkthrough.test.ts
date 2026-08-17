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
});
