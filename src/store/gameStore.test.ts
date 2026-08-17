import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useGameStore } from "./gameStore";
import type { Choice, StatKey, CheckTag } from "../types/game";

function makeChoice(tags: CheckTag[], stat: StatKey = "violence", modifier = 0): Choice {
  return {
    id: "test_check",
    text: "测试检定",
    check: { stat, modifier, tags },
    success: { text: "成功", nextScene: "tavern_001" },
    partial: { text: "部分", nextScene: "tavern_001" },
    failure: { text: "失败", nextScene: "tavern_001" },
  };
}

function newGame(origin: "mercenary" | "scholar" | "trickster") {
  useGameStore.getState().newGame("测试", origin);
  const st = useGameStore.getState().state!;
  // 全员入队（默认全队）
  st.party = ["serena", "lia", "milena"];
  for (const id of ["serena", "lia", "milena"] as const) {
    st.companions[id].met = true;
    st.companions[id].recruited = true;
  }
  return st;
}

/** 掷一个检定进入 pending，并 mock Math.random 得到指定骰子对（r1,r2 ∈ [0,1) → 骰面 1-6） */
function rollWith(die1: number, die2: number, choice: Choice) {
  vi.spyOn(Math, "random")
    .mockReturnValueOnce(die1)
    .mockReturnValueOnce(die2);
  useGameStore.getState().selectChoice(choice);
  vi.restoreAllMocks();
  return useGameStore.getState().pending!;
}

afterEach(() => {
  vi.restoreAllMocks();
  useGameStore.setState({ state: null, screen: "start", outcome: null, pending: null });
});

beforeEach(() => {
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
});

describe("出身能力", () => {
  it("佣兵：combat 失败可重掷一次，随后不再可用", () => {
    newGame("mercenary");
    // 第一次 combat 检定失败（1+1）
    let pc = rollWith(0, 0, makeChoice(["combat"]));
    expect(pc.roll.grade).toBe("failure");
    expect(useGameStore.getState().useOriginReroll).toBeTypeOf("function");
    // 重掷为成功（0.99+0.99 → 骰子 6+6=12 → critical）
    vi.spyOn(Math, "random").mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);
    useGameStore.getState().useOriginReroll();
    vi.restoreAllMocks();
    pc = useGameStore.getState().pending!;
    expect(pc.roll.grade).not.toBe("failure");
    expect(pc.usedOriginReroll).toBe(true);
    expect(useGameStore.getState().state!.flags.origin_reroll_used).toBe(true);
    // 再触发一次 combat 失败：不可再重掷
    pc = rollWith(0, 0, makeChoice(["combat"]));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useOriginReroll();
    pc = useGameStore.getState().pending!;
    expect(pc.roll.grade).toBe("failure"); // 未变
  });

  it("佣兵：非 combat 检定失败不可重掷", () => {
    newGame("mercenary");
    const pc = rollWith(0, 0, makeChoice(["social"]));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useOriginReroll();
    const after = useGameStore.getState().pending!;
    expect(after.roll.grade).toBe("failure");
  });

  it("骗徒：social 失败可重掷一次", () => {
    newGame("trickster");
    const pc = rollWith(0, 0, makeChoice(["social"], "finesse"));
    expect(pc.roll.grade).toBe("failure");
    vi.spyOn(Math, "random").mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);
    useGameStore.getState().useOriginReroll();
    vi.restoreAllMocks();
    const after = useGameStore.getState().pending!;
    expect(after.roll.grade).not.toBe("failure");
  });

  it("骗徒：combat 检定失败不可重掷", () => {
    newGame("trickster");
    const pc = rollWith(0, 0, makeChoice(["combat"]));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useOriginReroll();
    expect(useGameStore.getState().pending!.roll.grade).toBe("failure");
  });
});

describe("学者：ancient 检定 +1", () => {
  it("ancient 检定 modifier 含 +1（学者出身）", () => {
    newGame("scholar");
    // knowledge=2, modifier=0 → 学者 +1 → 骰 2+2=4 → total = 2+1+4 = 7
    const pc = rollWith(0.1667, 0.1667, makeChoice(["ancient"], "knowledge", 0));
    expect(pc.roll.total).toBe(7); // 2 + 1 + 4
    expect(pc.roll.grade).toBe("partial");
  });

  it("非 ancient 检定不加 1", () => {
    newGame("scholar");
    // knowledge=2, modifier=0，无 tag → total = 2 + 4 = 6
    const pc = rollWith(0.1667, 0.1667, makeChoice([], "knowledge", 0));
    expect(pc.roll.total).toBe(6);
    expect(pc.roll.grade).toBe("partial");
  });
});

describe("伙伴能力范围", () => {
  it("塞蕾娜守护：仅 combat 失败 → partial", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["serena"];
    // combat 失败
    let pc = rollWith(0, 0, makeChoice(["combat"]));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useGuardian();
    pc = useGameStore.getState().pending!;
    expect(pc.roll.grade).toBe("partial");
    expect(pc.usedGuardian).toBe(true);
  });

  it("塞蕾娜守护：ancient 检定失败不可用", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["serena"];
    const pc = rollWith(0, 0, makeChoice(["ancient"], "knowledge"));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useGuardian();
    expect(useGameStore.getState().pending!.roll.grade).toBe("failure");
  });

  it("塞蕾娜守护：social 检定失败不可用", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["serena"];
    const pc = rollWith(0, 0, makeChoice(["social"], "finesse"));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useGuardian();
    expect(useGameStore.getState().pending!.roll.grade).toBe("failure");
  });

  it("莉娅黑猫：仅 stealth 失败可重掷", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["lia"];
    // stealth 失败 → 重掷成功（0.99 → critical）
    let pc = rollWith(0, 0, makeChoice(["stealth"], "agility"));
    expect(pc.roll.grade).toBe("failure");
    vi.spyOn(Math, "random").mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);
    useGameStore.getState().useBlackCat();
    vi.restoreAllMocks();
    pc = useGameStore.getState().pending!;
    expect(pc.roll.grade).not.toBe("failure");
    expect(pc.usedBlackCat).toBe(true);
  });

  it("莉娅黑猫：combat 检定失败不可用", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["lia"];
    const pc = rollWith(0, 0, makeChoice(["combat"]));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useBlackCat();
    expect(useGameStore.getState().pending!.roll.grade).toBe("failure");
  });

  it("莉娅黑猫：social 检定失败不可用", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["lia"];
    const pc = rollWith(0, 0, makeChoice(["social"], "finesse"));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useBlackCat();
    expect(useGameStore.getState().pending!.roll.grade).toBe("failure");
  });

  it("米蕾娜禁忌交换：failure → success 且腐化 +10", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["milena"];
    const pc = rollWith(0, 0, makeChoice(["ancient"], "knowledge"));
    expect(pc.roll.grade).toBe("failure");
    useGameStore.getState().useForbiddenExchange();
    const after = useGameStore.getState().pending!;
    expect(after.roll.grade).toBe("success");
    expect(useGameStore.getState().state!.corruption).toBe(10);
  });

  it("米蕾娜禁忌交换：partial → success 且腐化 +10", () => {
    newGame("mercenary");
    const st = useGameStore.getState().state!;
    st.party = ["milena"];
    // 5+1=6 → partial
    const pc = rollWith(0.8333, 0, makeChoice(["ancient"], "knowledge"));
    expect(pc.roll.grade).toBe("partial");
    useGameStore.getState().useForbiddenExchange();
    expect(useGameStore.getState().pending!.roll.grade).toBe("success");
    expect(useGameStore.getState().state!.corruption).toBe(10);
  });
});
