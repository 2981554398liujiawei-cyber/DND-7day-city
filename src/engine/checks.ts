import type { StatKey } from "../types/game";

export function d6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function roll2d6(): number {
  return d6() + d6();
}

export type CheckGrade = "failure" | "partial" | "success" | "critical";

export function gradeCheck(total: number): CheckGrade {
  if (total <= 5) return "failure";
  if (total <= 8) return "partial";
  if (total <= 11) return "success";
  return "critical";
}

export interface RollResult {
  die1: number;
  die2: number;
  statValue: number;
  modifier: number;
  total: number;
  grade: CheckGrade;
  abilityUsed?: string;
}

export function rollCheck(
  statValue: number,
  modifier = 0
): RollResult {
  const die1 = d6();
  const die2 = d6();
  const total = die1 + die2 + statValue + modifier;
  return { die1, die2, statValue, modifier, total, grade: gradeCheck(total) };
}

export const STAT_LABELS: Record<StatKey, string> = {
  violence: "暴力",
  agility: "身手",
  insight: "洞察",
  knowledge: "学识",
  finesse: "手腕",
  will: "意志",
};
