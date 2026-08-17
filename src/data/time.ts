import type { PeriodKey } from "../types/game";

export const PERIOD_ORDER: PeriodKey[] = [
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

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  d1_morning: "DAY 1 · 清晨",
  d1_afternoon: "DAY 1 · 上午",
  d1_dusk: "DAY 1 · 黄昏",
  d1_night: "DAY 1 · 夜晚",
  d2_morning: "DAY 2 · 清晨",
  d2_afternoon: "DAY 2 · 上午",
  d2_dusk: "DAY 2 · 黄昏",
  d2_night: "DAY 2 · 夜晚",
  finale: "龙临事件",
};

export function periodLabel(index: number): string {
  const key = PERIOD_ORDER[Math.min(Math.max(index, 0), PERIOD_ORDER.length - 1)];
  return PERIOD_LABELS[key];
}
