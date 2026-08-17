import { useGameStore } from "../store/gameStore";
import type { GradeRoll } from "../engine/sceneEngine";
import { STAT_LABELS } from "../engine/checks";

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
  const acceptOutcome = useGameStore((s) => s.acceptOutcome);

  if (!state || !pending) return null;
  const g = GRADE_LABELS[roll.grade] ?? GRADE_LABELS.failure;

  const serenaIn = state.party.includes("serena");
  const liaIn = state.party.includes("lia");
  const milenaIn = state.party.includes("milena");

  return (
    <div className="dice-result">
      <div className={`dice-formula ${g.cls}`}>
        <div className="dice-dice">
          <span className="die">{roll.die1}</span>
          <span className="die">+</span>
          <span className="die">{roll.die2}</span>
          <span className="die">+</span>
          <span className="die stat">{STAT_LABELS[roll.stat]}{roll.statValue}</span>
          <span className="die">=</span>
          <span className="die total">{roll.total}</span>
        </div>
        <div className="dice-grade">{g.label}</div>
      </div>

      {roll.grade === "failure" && serenaIn && !pending.usedGuardian && (
        <button className="btn btn-ability" onClick={useGuardian}>
          🛡️ 塞蕾娜 · 守护：降低失败后果
        </button>
      )}

      {(roll.grade === "failure" || roll.grade === "partial") && liaIn && !pending.usedBlackCat && (
        <button className="btn btn-ability" onClick={useBlackCat}>
          🐈⬛ 莉娅 · 黑猫：重掷一次
        </button>
      )}

      {(roll.grade === "failure" || roll.grade === "partial") && milenaIn && !pending.forbiddenUsed && (
        <button className="btn btn-ability btn-danger" onClick={useForbiddenExchange}>
          ✨ 米蕾娜 · 禁忌交换：改为成功（腐化 +10）
        </button>
      )}

      <button className="btn btn-primary" onClick={acceptOutcome}>
        接受结果
      </button>
    </div>
  );
}
