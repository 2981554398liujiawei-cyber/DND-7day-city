import { describe, it, expect } from "vitest";
import { ALL_SCENES, SCENE_MAP } from "../data/scenes";
import { getAvailableChoices } from "../engine/sceneEngine";
import { checkConditions } from "../engine/conditions";
import type { GameStateData } from "../types/game";
import { ORIGINS } from "../data/companions";

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
      serena: { met: true, recruited: true, trust: 30, intimacy: 5, contracted: false, personalQuestComplete: false },
      lia: { met: true, recruited: true, trust: 10, intimacy: 0, contracted: false, personalQuestComplete: false },
      milena: { met: false, recruited: false, trust: 10, intimacy: 0, contracted: false, personalQuestComplete: false },
    },
    party: ["serena"],
    currentSceneId: "intro_001",
    history: [],
  };
}

describe("剧情数据完整性", () => {
  it("Scene ID 全部唯一（SCENE_MAP 构建时已校验）", () => {
    const ids = ALL_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("所有 nextScene 引用有效", () => {
    for (const scene of ALL_SCENES) {
      for (const choice of scene.choices) {
        const outcomes = [
          choice.outcome,
          choice.success,
          choice.partial,
          choice.failure,
        ].filter(Boolean) as Array<{ nextScene?: string }>;
        for (const o of outcomes) {
          if (o.nextScene) {
            expect(SCENE_MAP[o.nextScene], `${scene.id} -> ${o.nextScene}`).toBeDefined();
          }
        }
      }
    }
  });

  it("满足至少 25 scene / 40 choice / 6 check 的最低要求", () => {
    expect(ALL_SCENES.length).toBeGreaterThanOrEqual(25);
    const totalChoices = ALL_SCENES.reduce((n, s) => n + s.choices.length, 0);
    expect(totalChoices).toBeGreaterThanOrEqual(40);
    const checks = ALL_SCENES.filter((s) => s.choices.some((c) => c.check)).length;
    expect(checks).toBeGreaterThanOrEqual(6);
  });

  it("8 个秘密都可在剧情中被发现", () => {
    const secretKeys = [
      "dragon_is_parent",
      "egg_is_power_source",
      "church_knew_truth",
      "mages_experimented_on_egg",
      "royal_plan_destroy_dragon",
      "lia_spy_history",
      "serena_disobeyed_order",
      "milena_connected_to_egg",
    ];
    for (const key of secretKeys) {
      const found = ALL_SCENES.some((scene) =>
        scene.choices.some(
          (c) =>
            (c.outcome?.effects ?? []).some((e) => e.type === "addSecret" && e.key === key) ||
            (c.success?.effects ?? []).some((e) => e.type === "addSecret" && e.key === key) ||
            (c.partial?.effects ?? []).some((e) => e.type === "addSecret" && e.key === key) ||
            (c.failure?.effects ?? []).some((e) => e.type === "addSecret" && e.key === key)
        )
      );
      expect(found, `秘密 ${key} 应可通过剧情获得`).toBe(true);
    }
  });

  it("条件过滤基本工作（hub 场景）", () => {
    const s = makeState();
    s.periodIndex = 0; // d1_morning
    const scene = SCENE_MAP["location_hub"];
    const choices = getAvailableChoices("location_hub", s);
    // DAY1 黑街主线未完成时可用
    expect(choices.some((c) => c.id === "hub_blackstreet_d1")).toBe(true);
    // 地下未解锁时不可用
    expect(choices.some((c) => c.id === "hub_underground")).toBe(false);
    // finale 未到时不可用
    expect(choices.some((c) => c.id === "hub_finale")).toBe(false);
    void scene;
    void checkConditions;
  });
});

describe("存档序列化", () => {
  it("GameStateData 可 JSON 序列化往返", () => {
    const s = makeState();
    const json = JSON.stringify(s);
    const back = JSON.parse(json) as GameStateData;
    expect(back.player.name).toBe("测试");
    expect(back.companions.serena.trust).toBe(30);
    expect(back.party).toEqual(["serena"]);
    expect(back.currentSceneId).toBe("intro_001");
  });
});
