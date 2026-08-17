import type { Condition, GameStateData, PeriodKey } from "../types/game";

const PERIODS: PeriodKey[] = [
  "d1_morning",
  "d1_afternoon",
  "d1_dusk",
  "d1_night",
  "d2_morning",
  "d2_afternoon",
  "d2_dusk",
  "d2_night",
  "finale",
];

export function periodKey(state: GameStateData): PeriodKey {
  return PERIODS[Math.min(Math.max(state.periodIndex, 0), PERIODS.length - 1)];
}

export function checkCondition(
  cond: Condition,
  state: GameStateData
): boolean {
  switch (cond.type) {
    case "flag":
      if (cond.value) {
        return state.flags[cond.key] === true;
      }
      return !state.flags[cond.key];
    case "secret":
      return state.secrets.includes(cond.key);
    case "companionInParty":
      if (cond.value === false) {
        return !state.party.includes(cond.id);
      }
      return state.party.includes(cond.id);
    case "partyNotFull":
      return state.party.length < 2;
    case "personalQuestDone":
      if (cond.value === false) {
        return state.companions[cond.id]?.personalQuestComplete !== true;
      }
      return state.companions[cond.id]?.personalQuestComplete === true;
    case "trust":
      return (
        state.companions[cond.id]?.trust >= (cond.min ?? 0)
      );
    case "intimacy":
      return (
        state.companions[cond.id]?.intimacy >= (cond.min ?? 0)
      );
    case "contracted":
      return state.companions[cond.id]?.contracted === true;
    case "stat":
      return (state.player.stats[cond.stat] ?? 0) >= (cond.min ?? 0);
    case "gold":
      return state.gold >= (cond.min ?? 0);
    case "alert":
      return state.alert >= (cond.min ?? 0);
    case "corruption":
      return state.corruption >= (cond.min ?? 0);
    case "period":
      return periodKey(state) === cond.at;
    case "periodIn":
      return cond.in.includes(periodKey(state));
    case "origin":
      return cond.in.includes(state.player.origin);
    default:
      return true;
  }
}

export function checkConditions(
  conds: Condition[] | undefined,
  state: GameStateData
): boolean {
  if (!conds || conds.length === 0) return true;
  return conds.every((c) => checkCondition(c, state));
}
