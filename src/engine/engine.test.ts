import { describe, it, expect, vi, afterEach } from "vitest";
import { d6, roll2d6, gradeCheck } from "../engine/checks";
import { checkConditions } from "../engine/conditions";
import { applyEffects } from "../engine/effects";
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("骰子 Dice", () => {
  it("2D6 范围在 2-12", () => {
    for (let i = 0; i < 200; i++) {
      const v = roll2d6();
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(12);
    }
  });

  it("d6 范围 1-6", () => {
    for (let i = 0; i < 200; i++) {
      const v = d6();
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it("分级正确", () => {
    expect(gradeCheck(2)).toBe("failure");
    expect(gradeCheck(5)).toBe("failure");
    expect(gradeCheck(6)).toBe("partial");
    expect(gradeCheck(8)).toBe("partial");
    expect(gradeCheck(9)).toBe("success");
    expect(gradeCheck(11)).toBe("success");
    expect(gradeCheck(12)).toBe("critical");
  });
});

describe("条件 Condition", () => {
  it("secret 条件正确判断", () => {
    const s = makeState();
    expect(checkConditions([{ type: "secret", key: "egg_is_power_source" }], s)).toBe(false);
    s.secrets.push("egg_is_power_source");
    expect(checkConditions([{ type: "secret", key: "egg_is_power_source" }], s)).toBe(true);
  });

  it("companionInParty 条件正确判断", () => {
    const s = makeState();
    expect(checkConditions([{ type: "companionInParty", id: "serena" }], s)).toBe(true);
    expect(checkConditions([{ type: "companionInParty", id: "lia" }], s)).toBe(false);
  });

  it("trust 条件正确判断", () => {
    const s = makeState();
    expect(checkConditions([{ type: "trust", id: "serena", min: 20 }], s)).toBe(true);
    expect(checkConditions([{ type: "trust", id: "serena", min: 60 }], s)).toBe(false);
  });

  it("多条件 AND", () => {
    const s = makeState();
    expect(
      checkConditions(
        [{ type: "companionInParty", id: "serena" }, { type: "trust", id: "serena", min: 25 }],
        s
      )
    ).toBe(true);
    expect(
      checkConditions(
        [{ type: "companionInParty", id: "lia" }, { type: "trust", id: "serena", min: 25 }],
        s
      )
    ).toBe(false);
  });
});

describe("效果 Effect", () => {
  it("trust 效果正确修改并 clamp", () => {
    const s = makeState();
    applyEffects([{ type: "trust", id: "serena", amount: 5 }], s);
    expect(s.companions.serena.trust).toBe(35);
    applyEffects([{ type: "trust", id: "serena", amount: 100 }], s);
    expect(s.companions.serena.trust).toBe(100);
    applyEffects([{ type: "trust", id: "serena", amount: -200 }], s);
    expect(s.companions.serena.trust).toBe(0);
  });

  it("addSecret 效果正确添加且不重复", () => {
    const s = makeState();
    applyEffects([{ type: "addSecret", key: "dragon_is_parent" }], s);
    expect(s.secrets).toContain("dragon_is_parent");
    applyEffects([{ type: "addSecret", key: "dragon_is_parent" }], s);
    expect(s.secrets.filter((x) => x === "dragon_is_parent")).toHaveLength(1);
  });

  it("corruption 效果正确修改并 clamp", () => {
    const s = makeState();
    applyEffects([{ type: "corruption", amount: 10 }], s);
    expect(s.corruption).toBe(10);
    applyEffects([{ type: "corruption", amount: 200 }], s);
    expect(s.corruption).toBe(100);
  });

  it("gold 效果不下溢", () => {
    const s = makeState();
    applyEffects([{ type: "gold", amount: -500 }], s);
    expect(s.gold).toBe(0);
  });
});
