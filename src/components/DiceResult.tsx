import { useGameStore } from "../store/gameStore";
import type { GradeRoll } from "../engine/sceneEngine";
import { STAT_LABELS } from "../engine/checks";
import { ORIGINS } from "../data/companions";

const GRADE_LABELS: Record<string, { label: string; cls: string }> = {
  failure: { label: "失败", cls: "grade-failure" },
  partial: { label: "成功但有代价", cls: "grade-partial" },
  success: { label: "成功", cls: "grade-success" },
  critical: { label: "完美成功", cls: "grade-critical" },
};

export default function DiceResult({ roll }: { roll: GradeRoll }) {
  const state = useGameStore((s) => s.state);
  const pending = useGameStore((s) => s.pending);
  const useGuardian = useGameStore((s) => s.useGuardian);
  const useBlackCat = useGameStore((s) => s.useBlackCat);
  const useForbiddenExchange = useGameStore((s) => s.useForbiddenExchange);
  const useOriginReroll = useGameStore((s) => s.useOriginReroll);

  if (!state || !pending) return null;
  const g = GRADE_LABELS[roll.grade] ?? GRADE_LABELS.failure;
  const tags = pending.choice.check?.tags ?? [];

  const serenaIn = state.party.includes("serena");
  const liaIn = state.party.includes("lia");
  const milenaIn = state.party.includes("milena");

  const origin = state.player.origin;
  const originLabel = ORIGINS[origin].label;
  const isCombat = tags.includes("combat");
  const isStealth = tags.includes("stealth");
  const isSocial = tags.includes("social");

  return (
    <div className="dice-result">
      <div className={`dice-formula ${g.cls}`}>
        <div className="dice-dice">
          <span className="die">{roll.die1}</span>
          <span className="die">+</span>
          <span className="die">{roll.die2}</span>
          <span className="die">+</span>
          <span className="die stat">{STAT_LABELS[roll.stat]}{roll.statValue}</span>
          {roll.modifier !== 0 && (
            <>
              <span className="die">+</span>
              <span className="die mod">{roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier}</span>
            </>
          )}
          <span className="die">=</span>
          <span className="die total">{roll.total}</span>
        </div>
        <div className="dice-grade">{g.label}</div>
      </div>

      {/* 出身能力：佣兵 combat 重掷 / 骗徒 social 重掷 */}
      {roll.grade === "failure" &&
        !pending.usedOriginReroll &&
        !state.flags.origin_reroll_used &&
        ((origin === "mercenary" && isCombat) || (origin === "trickster" && isSocial)) && (
          <button className="btn btn-ability" onClick={useOriginReroll}>
            {origin === "mercenary" ? "⚔️" : "🗣️"} {originLabel}直觉：重新掷骰（本局一次）
          </button>
        )}

      {/* 塞蕾娜守护：仅 combat */}
      {roll.grade === "failure" && serenaIn && isCombat && !pending.usedGuardian && (
        <button className="btn btn-ability" onClick={useGuardian}>
          🛡️ 塞蕾娜 · 守护：挡下最坏的结果
        </button>
      )}

      {/* 莉娅黑猫：仅 stealth */}
      {roll.grade === "failure" && liaIn && isStealth && !pending.usedBlackCat && (
        <button className="btn btn-ability" onClick={useBlackCat}>
          🐈⬛ 莉娅 · 黑猫：重新潜入一次
        </button>
      )}

      {/* 米蕾娜禁忌交换 */}
      {(roll.grade === "failure" || roll.grade === "partial") && milenaIn && !pending.usedForbidden && (
        <button className="btn btn-ability btn-danger" onClick={useForbiddenExchange}>
          ✨ 米蕾娜 · 禁忌交换：改为成功（腐化 +10）
        </button>
      )}

      <button className="btn btn-primary" onClick={() => useGameStore.getState().acceptOutcome()}>
        接受结果
      </button>
    </div>
  );
}
