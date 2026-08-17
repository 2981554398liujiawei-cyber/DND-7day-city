import type { Effect, GameStateData } from "../types/game";

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

const HISTORY_LIMIT = 50;

export function pushHistory(state: GameStateData, msg: string) {
  state.history.push(msg);
  if (state.history.length > HISTORY_LIMIT) {
    state.history = state.history.slice(state.history.length - HISTORY_LIMIT);
  }
}

export function applyEffects(
  effects: Effect[] | undefined,
  state: GameStateData
): string[] {
  const logs: string[] = [];
  if (!effects) return logs;
  for (const e of effects) {
    applyEffect(e, state, logs);
  }
  return logs;
}

function applyEffect(e: Effect, state: GameStateData, logs: string[]) {
  switch (e.type) {
    case "setFlag":
      state.flags[e.key] = e.value;
      break;
    case "addSecret":
      if (!state.secrets.includes(e.key)) {
        state.secrets.push(e.key);
        logs.push(`🔎 获得秘密：「${e.key}」`);
      }
      break;
    case "trust": {
      const c = state.companions[e.id];
      if (c) {
        const before = c.trust;
        c.trust = clamp(c.trust + e.amount, 0, 100);
        const delta = c.trust - before;
        if (delta !== 0) {
          logs.push(`🤝 ${e.id} 信任 ${delta > 0 ? "+" : ""}${delta}`);
        }
      }
      break;
    }
    case "intimacy": {
      const c = state.companions[e.id];
      if (c) {
        const before = c.intimacy;
        c.intimacy = clamp(c.intimacy + e.amount, 0, 100);
        const delta = c.intimacy - before;
        if (delta !== 0) {
          logs.push(`❤️ ${e.id} 亲密 ${delta > 0 ? "+" : ""}${delta}`);
        }
      }
      break;
    }
    case "gold":
      state.gold = Math.max(0, state.gold + e.amount);
      break;
    case "corruption":
      state.corruption = clamp(state.corruption + e.amount, 0, 100);
      break;
    case "alert":
      state.alert = clamp(state.alert + e.amount, 0, 100);
      break;
    case "recruit": {
      const c = state.companions[e.id];
      if (c) {
        c.recruited = true;
        c.met = true;
        state.flags[`recruited_${e.id}_flag`] = true;
        if (state.party.length < 2 && !state.party.includes(e.id)) {
          state.party.push(e.id);
        }
        logs.push(`📜 ${e.id} 加入队伍`);
      }
      break;
    }
    case "joinParty": {
      const c = state.companions[e.id];
      if (c && c.recruited && !state.party.includes(e.id) && state.party.length < 2) {
        state.party.push(e.id);
        logs.push(`📜 ${e.id} 加入队伍`);
      }
      break;
    }
    case "leaveParty": {
      state.party = state.party.filter((id) => id !== e.id);
      logs.push(`👋 ${e.id} 暂时离队`);
      break;
    }
    case "contract": {
      const c = state.companions[e.id];
      if (c) {
        c.contracted = true;
        logs.push(`✨ 与 ${e.id} 建立契约`);
      }
      break;
    }
    case "advanceTime":
      state.periodIndex += 1;
      break;
    case "setLocation":
      state.location = e.id;
      break;
    case "setScene":
      state.currentSceneId = e.id;
      break;
    case "setPersonalQuestComplete": {
      const c = state.companions[e.id];
      if (c) {
        c.personalQuestComplete = e.value;
      }
      break;
    }
    default:
      break;
  }
}
