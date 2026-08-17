import { useGameStore } from "../store/gameStore";
import { getAvailableChoices } from "../engine/sceneEngine";
import { STAT_LABELS } from "../engine/checks";
import type { Choice, Outcome } from "../types/game";

/** 该选择是否会推进时间（检查所有可能 outcome 的 effects） */
function advancesTime(c: Choice): boolean {
  const outcomes: Array<Outcome | undefined> = [
    c.outcome,
    c.success,
    c.partial,
    c.failure,
  ];
  return outcomes.some(
    (o) => o?.effects?.some((e) => e.type === "advanceTime") ?? false
  );
}

export default function ChoiceList() {
  const state = useGameStore((s) => s.state);
  const selectChoice = useGameStore((s) => s.selectChoice);

  if (!state) return null;
  const choices = getAvailableChoices(state.currentSceneId, state);

  if (choices.length === 0) {
    return (
      <div className="choice-list empty">
        <div className="empty-note">（场景结束）</div>
      </div>
    );
  }

  const labelFor = (c: Choice): { prefix?: string; text: string } => {
    if (c.text.startsWith("【")) {
      const m = c.text.match(/^【(.+?)】(.*)$/);
      if (m) return { prefix: m[1], text: m[2] };
    }
    if (c.check) {
      return { prefix: `🎲 ${STAT_LABELS[c.check.stat]}`, text: c.text };
    }
    return { text: c.text };
  };

  // 选择类型图标：🎲检定 / 🔎秘密 / ✨契约招募 / ❤️关系 / 🌑腐化
  const iconFor = (c: Choice): string | undefined => {
    if (c.check) return undefined; // 已有 🎲 前缀
    const all = [c.outcome, c.success, c.partial, c.failure].flatMap(
      (o) => o?.effects ?? []
    );
    if (all.some((e) => e.type === "addSecret")) return "🔎";
    if (all.some((e) => e.type === "contract" || e.type === "recruit")) return "✨";
    if (all.some((e) => e.type === "trust" || e.type === "intimacy")) return "❤️";
    if (all.some((e) => e.type === "corruption" && e.amount > 0)) return "🌑";
    return undefined;
  };

  return (
    <div className="choice-list">
      {choices.map((c) => {
        const { prefix, text } = labelFor(c);
        const icon = iconFor(c);
        return (
          <button
            key={c.id}
            className="choice-btn"
            onClick={() => selectChoice(c)}
          >
            {icon && <span className="choice-icon">{icon}</span>}
            {prefix && <span className="choice-prefix">{prefix}</span>}
            <span>{text}</span>
            {advancesTime(c) && (
              <span className="time-hint">⏳ 此行动将推进时间</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
