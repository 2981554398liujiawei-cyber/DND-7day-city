import type { CompanionId, GameStateData } from "../types/game";

/**
 * 契约达成判断：专注攻略该伙伴（完成个人事件 + 第二关系事件 + 足够信任）后可达。
 * 门槛设计：信任阈值 45——专注路线约 49-60 可达，普通游玩约 25-35 不可达（不是白送）。
 */
export function canContract(
  companionId: CompanionId,
  state: GameStateData
): boolean {
  const c = state.companions[companionId];
  if (!c) return false;
  if (!c.recruited) return false;
  if (c.contracted) return false;
  if (!c.personalQuestComplete) return false;
  // 第二关系事件完成
  const rel2 = state.flags[`${companionId}_rel2_done`];
  if (!rel2) return false;
  // 信任阈值
  if (c.trust < 45) return false;
  return true;
}

/** 契约相关 UI 状态 */
export function contractStatus(
  companionId: CompanionId,
  state: GameStateData
): "contracted" | "ready" | "progress" | "locked" {
  const c = state.companions[companionId];
  if (!c) return "locked";
  if (c.contracted) return "contracted";
  if (!c.recruited) return "locked";
  if (canContract(companionId, state)) return "ready";
  return "progress";
}
