import { useGameStore } from "../store/gameStore";
import { getAvailableChoices } from "../engine/sceneEngine";
import { STAT_LABELS } from "../engine/checks";
import type { Choice } from "../types/game";

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

  return (
    <div className="choice-list">
      {choices.map((c) => {
        const { prefix, text } = labelFor(c);
        return (
          <button
            key={c.id}
            className="choice-btn"
            onClick={() => selectChoice(c)}
          >
            {prefix && <span className="choice-prefix">{prefix}</span>}
            <span>{text}</span>
          </button>
        );
      })}
    </div>
  );
}
