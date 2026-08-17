import type {
  Choice,
  GameStateData,
  Outcome,
  StatKey,
} from "../types/game";
import { getScene } from "../data/scenes";
import { checkConditions } from "./conditions";
import { applyEffects } from "./effects";
import { rollCheck, type CheckGrade } from "./checks";

export function getAvailableChoices(
  sceneId: string,
  state: GameStateData
) {
  const scene = getScene(sceneId);
  return scene.choices.filter((c) => checkConditions(c.conditions, state));
}

export function getOutcomeForGrade(
  choice: Choice,
  grade: CheckGrade
): Outcome | undefined {
  if (grade === "failure") {
    return choice.failure ?? choice.partial ?? choice.success ?? choice.outcome;
  }
  if (grade === "partial") {
    return choice.partial ?? choice.success ?? choice.outcome;
  }
  return choice.success ?? choice.outcome;
}

export interface AppliedResult {
  textLines: string[];
  nextSceneId?: string;
  logs: string[];
}

/** 根据最终选定的 grade 应用效果（不重新掷骰） */
export function applyGradeOutcome(
  choice: Choice,
  grade: CheckGrade,
  state: GameStateData
): AppliedResult {
  const outcome = getOutcomeForGrade(choice, grade);
  if (!outcome) return { textLines: [], logs: [] };
  const logs = applyEffects(outcome.effects, state);
  const textLines = outcome.text
    ? (Array.isArray(outcome.text) ? outcome.text : [outcome.text])
    : [];
  // 若 effects 里有 setScene，则作为跳转目标
  let nextSceneId = outcome.nextScene;
  if (!nextSceneId && outcome.effects) {
    const setScene = outcome.effects.find((e) => e.type === "setScene");
    if (setScene && setScene.type === "setScene") {
      nextSceneId = setScene.id;
    }
  }
  return { textLines, nextSceneId, logs };
}

export interface GradeRoll {
  grade: CheckGrade;
  die1: number;
  die2: number;
  stat: StatKey;
  statValue: number;
  modifier: number;
  total: number;
}

/** 掷骰并返回分级结果（不应用效果） */
export function gradeRollForChoice(
  choice: Choice,
  state: GameStateData,
  modifierDelta = 0,
  overrideStat?: StatKey
): GradeRoll {
  const stat = overrideStat ?? choice.check!.stat;
  const statValue = state.player.stats[stat] ?? 0;
  const modifier = (choice.check?.modifier ?? 0) + modifierDelta;
  const roll = rollCheck(statValue, modifier);
  return {
    grade: roll.grade,
    die1: roll.die1,
    die2: roll.die2,
    stat,
    statValue,
    modifier,
    total: roll.total,
  };
}

/** 兼容旧接口 */
export function resolveChoice(choice: Choice, state: GameStateData) {
  if (!choice.check) {
    const outcome = choice.outcome;
    if (outcome) {
      const logs = applyEffects(outcome.effects, state);
      const textLines = outcome.text
        ? (Array.isArray(outcome.text) ? outcome.text : [outcome.text])
        : [];
      let nextSceneId = outcome.nextScene;
      if (!nextSceneId && outcome.effects) {
        const setScene = outcome.effects.find((e) => e.type === "setScene");
        if (setScene && setScene.type === "setScene") {
          nextSceneId = setScene.id;
        }
      }
      return { textLines, nextSceneId, logs };
    }
    return { textLines: [], nextSceneId: undefined, logs: [] };
  }
  // 有检定：掷骰并应用
  const grade = gradeRollForChoice(choice, state);
  const applied = applyGradeOutcome(choice, grade.grade, state);
  return {
    textLines: applied.textLines,
    nextSceneId: applied.nextSceneId,
    logs: applied.logs,
    roll: grade,
  };
}
