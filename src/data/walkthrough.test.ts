import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { ALL_SCENES } from "../data/scenes";
import { getAvailableChoices, resolveChoice } from "../engine/sceneEngine";
import { getScene } from "../data/scenes";
import type { GameStateData, Choice } from "../types/game";
import { ORIGINS } from "../data/companions";
import { useGameStore } from "../store/gameStore";

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

  it("新游戏 → 完整通关（store 层）", () => {
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

    // 去黑街
    click("hub_blackstreet");
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
    expect(s.flags.finale_unlocked).toBe(true);

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
});

/**
 * 沿指定 choice id 路径游玩，直到进入 ending_screen。
 * 遇到 check 时用 fixed dice（total 恰好 success）。
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
    if (guard > 200) throw new Error("walk 死循环");
    const scene = getScene(sceneId);
    visited.push(sceneId);
    const choices = getAvailableChoices(sceneId, state);
    const wanted = path[idx];
    let choice: Choice | undefined;
    if (wanted) {
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

    if (choice.check && opts.forceSuccess) {
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
      // 王城
      "hub_royal",
      "royal_001_c", // 观察塞蕾娜
      "royal_002_a", // 忠于荣誉
      // 黑街
      "hub_blackstreet",
      "blackstreet_001_a", // 龙的消息 -> dragon_is_parent + underground_hint
      "blackstreet_002_a", // 记下情报
      // 圣堂
      "hub_church",
      "church_001_a", // 撬铁柜
      "church_002_a", // 握住她的手
      // 地下
      "hub_underground",
      "underground_001_a", // 凑近观察 -> egg_is_power_source
      "underground_002_a", // 退出地下 -> finale_unlocked
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

  it("Route C：偏米蕾娜 → 龙之契约（隐藏结局）", () => {
    const s = makeState();
    const path = [
      "intro_001_c",
      "intro_002_c", // 认识米蕾娜
      "intro_003_c", // 选米蕾娜同行
      "intro_004_c", // 去圣堂
      // 圣堂
      "hub_church",
      "church_001_b", // 米蕾娜探查 -> milena_connected_to_egg_echo
      "church_002_a", // 握住她的手
      // 黑街（地下线索）
      "hub_blackstreet",
      "blackstreet_001_d", // 打听地下入口 -> underground_hint
      "blackstreet_002_a",
      // 地下
      "hub_underground",
      "underground_001_b", // 问米蕾娜 -> milena_connected_to_egg
      "underground_002_b", // 尝试沟通 -> bonded_with_egg
      // 最终
      "hub_finale",
      "finale_dragon_contract",
      "ending_dragon_contract_continue",
    ];
    const { state: final, visited } = walk(s, path, { forceSuccess: true });
    expect(final.currentSceneId).toBe("ending_screen");
    expect(final.secrets).toContain("milena_connected_to_egg");
    expect(visited).toContain("ending_dragon_contract");
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
