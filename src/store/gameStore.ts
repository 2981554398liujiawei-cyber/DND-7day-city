import { create } from "zustand";
import type {
  Choice,
  GameStateData,
  Origin,
} from "../types/game";
import {
  gradeRollForChoice,
  applyGradeOutcome,
  type GradeRoll,
} from "../engine/sceneEngine";
import { pushHistory, applyEffects } from "../engine/effects";
import { ORIGINS } from "../data/companions";
import { secretTitle } from "../data/secrets";

const SAVE_KEY = "seven-day-city-save-v1";
const SAVE_VERSION = 1;

function freshState(name: string, origin: Origin): GameStateData {
  return {
    version: SAVE_VERSION,
    player: { name, origin, stats: { ...ORIGINS[origin].stats } },
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

export interface PendingCheck {
  choice: Choice;
  roll: GradeRoll;
  usedGuardian: boolean;
  usedBlackCat: boolean;
  usedForbidden: boolean;
  usedOriginReroll: boolean;
}

interface GameStore {
  state: GameStateData | null;
  screen: "start" | "game" | "ending";
  outcome: {
    text: string[];
    logs: string[];
    roll?: GradeRoll;
    nextSceneId?: string;
  } | null;
  pending: PendingCheck | null;

  newGame: (name: string, origin: Origin) => void;
  continueGame: () => boolean;
  clearSave: () => void;
  backToStart: () => void;
  restartNewGame: () => void;

  selectChoice: (choice: Choice) => void;
  rollPending: () => void;
  acceptOutcome: () => void;
  useGuardian: () => void;
  useBlackCat: () => void;
  useForbiddenExchange: () => void;
  useOriginReroll: () => void;
  gotoScene: (sceneId: string) => void;
}

function persist(state: GameStateData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function loadSave(): GameStateData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameStateData;
    if (parsed.version !== SAVE_VERSION) return null;
    if (!parsed.player || !parsed.companions || !Array.isArray(parsed.party)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function log(state: GameStateData, msg: string) {
  pushHistory(state, msg);
}

/** 出身重掷是否可用且未使用 */
function originRerollAvailable(state: GameStateData, choice: Choice): boolean {
  const tags = choice.check?.tags ?? [];
  if (state.player.origin === "mercenary" && tags.includes("combat")) {
    return !state.flags.origin_reroll_used;
  }
  if (state.player.origin === "trickster" && tags.includes("social")) {
    return !state.flags.origin_reroll_used;
  }
  return false;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  screen: "start",
  outcome: null,
  pending: null,

  newGame: (name, origin) => {
    const s = freshState(name, origin);
    persist(s);
    set({ state: s, screen: "game", outcome: null, pending: null });
  },

  continueGame: () => {
    const s = loadSave();
    if (!s) return false;
    set({ state: s, screen: s.ending ? "ending" : "game", outcome: null, pending: null });
    return true;
  },

  clearSave: () => {
    localStorage.removeItem(SAVE_KEY);
    set({ state: null, screen: "start", outcome: null, pending: null });
  },

  backToStart: () => {
    set({ state: null, screen: "start", outcome: null, pending: null });
  },

  // 重新开始：清除存档并回到标题（保留存档键名）
  restartNewGame: () => {
    localStorage.removeItem(SAVE_KEY);
    set({ state: null, screen: "start", outcome: null, pending: null });
  },

  selectChoice: (choice) => {
    const st = get().state;
    if (!st) return;

    if (choice.check) {
      // 有检定：先掷骰，进入 pending（等待玩家决定是否用伙伴/出身能力）
      const roll = gradeRollForChoice(choice, st);
      set({
        pending: {
          choice,
          roll,
          usedGuardian: false,
          usedBlackCat: false,
          usedForbidden: false,
          usedOriginReroll: false,
        },
        outcome: null,
      });
      return;
    }

    // 无检定：直接结算
    const outcome = choice.outcome;
    const logs: string[] = [];
    if (outcome) {
      logs.push(...applyPlainEffects(outcome, st));
    }
    for (const l of logs) log(st, l);
    persist(st);
    const textLines: string[] = outcome
      ? (Array.isArray(outcome.text) ? outcome.text : outcome.text ? [outcome.text] : [])
      : [];
    let nextSceneId = outcome?.nextScene;
    if (!nextSceneId && outcome?.effects) {
      const setScene = outcome.effects.find((e) => e.type === "setScene");
      if (setScene && setScene.type === "setScene") {
        nextSceneId = setScene.id;
      }
    }
    set({
      state: st,
      outcome: {
        text: textLines,
        logs,
        nextSceneId,
      },
      pending: null,
    });
  },

  rollPending: () => {
    // 已经由 selectChoice 掷过；此方法仅确保有 pending 时展示
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    const r = pc.roll;
    set({
      outcome: {
        text: [],
        logs: [`🎲 ${r.die1} + ${r.die2} + ${r.stat}${r.statValue} = ${r.total}`],
        roll: r,
      },
    });
  },

  acceptOutcome: () => {
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    const roll = pc.roll;
    const applied = applyGradeOutcome(pc.choice, roll.grade, st);
    for (const l of applied.logs) log(st, l);
    persist(st);
    set({
      state: st,
      pending: null,
      outcome: {
        text: applied.textLines,
        logs: applied.logs,
        roll,
        nextSceneId: applied.nextSceneId,
      },
    });
  },

  useGuardian: () => {
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    if (!st.party.includes("serena") || pc.usedGuardian) return;
    // 守护：仅 combat 检定，且仅失败时可用
    const tags = pc.choice.check?.tags ?? [];
    if (!tags.includes("combat")) return;
    if (pc.roll.grade !== "failure") return;
    const contracted = st.companions.serena.contracted;
    if (contracted && !st.flags.serena_guardian_boost_used) {
      // ✨ 契约强化：每局第一次守护 failure → success
      st.flags.serena_guardian_boost_used = true;
      log(st, "✨ 契约强化：塞蕾娜的守护化为完全的胜利");
      const newRoll: GradeRoll = { ...pc.roll, grade: "success" };
      set({ state: st, pending: { ...pc, roll: newRoll, usedGuardian: true } });
      return;
    }
    // 守护：失败 → 部分成功
    const newRoll: GradeRoll = { ...pc.roll, grade: "partial" };
    set({ pending: { ...pc, roll: newRoll, usedGuardian: true } });
  },

  useBlackCat: () => {
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    if (!st.party.includes("lia") || pc.usedBlackCat) return;
    // 黑猫：仅 stealth 检定，且失败时重掷一次
    const tags = pc.choice.check?.tags ?? [];
    if (!tags.includes("stealth")) return;
    if (pc.roll.grade !== "failure") return;
    // 黑猫：重掷一次
    const newRoll = gradeRollForChoice(pc.choice, st);
    const contracted = st.companions.lia.contracted;
    let finalRoll = newRoll;
    if (contracted && !st.flags.lia_blackcat_boost_used && newRoll.grade === "failure") {
      // ✨ 契约强化：每局一次，重掷仍失败时自动变为部分成功
      st.flags.lia_blackcat_boost_used = true;
      log(st, "✨ 契约强化：黑猫的第二次机会仍失败，但她硬生生把局面扳了回来");
      finalRoll = { ...newRoll, grade: "partial" };
    }
    set({ state: st, pending: { ...pc, roll: finalRoll, usedBlackCat: true } });
  },

  useForbiddenExchange: () => {
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    if (!st.party.includes("milena") || pc.usedForbidden) return;
    if (pc.roll.grade !== "failure" && pc.roll.grade !== "partial") return;
    // 禁忌交换：强制成功；契约后代价降低（腐化 +5 而非 +10）
    const contracted = st.companions.milena.contracted;
    const cost = contracted ? 5 : 10;
    st.corruption = Math.min(100, st.corruption + cost);
    log(st, `腐化 +${cost}（禁忌交换${contracted ? " · ✨契约强化" : ""}）`);
    const newRoll: GradeRoll = { ...pc.roll, grade: "success" };
    set({
      state: st,
      pending: { ...pc, roll: newRoll, usedForbidden: true },
    });
  },

  useOriginReroll: () => {
    const st = get().state;
    const pc = get().pending;
    if (!st || !pc) return;
    if (pc.usedOriginReroll) return;
    if (!originRerollAvailable(st, pc.choice)) return;
    // 出身重掷：仅失败时可用
    if (pc.roll.grade !== "failure") return;
    const newRoll = gradeRollForChoice(pc.choice, st);
    st.flags.origin_reroll_used = true;
    log(st, "出身能力已使用（本局一次）");
    set({
      state: st,
      pending: { ...pc, roll: newRoll, usedOriginReroll: true },
    });
  },

  gotoScene: (sceneId) => {
    const st = get().state;
    if (!st) return;
    let next = { ...st, currentSceneId: sceneId };
    if (sceneId.startsWith("ending_") && sceneId !== "ending_screen") {
      next = { ...next, ending: sceneId };
    }
    persist(next);
    set({ state: next, outcome: null, pending: null });
    if (sceneId === "ending_screen") {
      const final = { ...next, ending: next.ending ?? "ending" };
      persist(final);
      set({ state: final, screen: "ending", outcome: null });
    }
  },
}));

function applyPlainEffects(
  outcome: { effects?: import("../types/game").Effect[] },
  state: GameStateData
): string[] {
  return applyEffects(outcome.effects, state);
}

export function isEndingScene(sceneId: string): boolean {
  return sceneId.startsWith("ending_");
}

export { secretTitle };
