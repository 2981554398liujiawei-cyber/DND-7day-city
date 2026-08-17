import { useGameStore } from "../store/gameStore";
import { getScene } from "../data/scenes";
import ChoiceList from "./ChoiceList";
import DiceResult from "./DiceResult";

export default function StoryPanel() {
  const state = useGameStore((s) => s.state);
  const outcome = useGameStore((s) => s.outcome);
  const pending = useGameStore((s) => s.pending);
  const gotoScene = useGameStore((s) => s.gotoScene);

  if (!state) return null;
  const scene = getScene(state.currentSceneId);
  const paragraphs = Array.isArray(scene.text) ? scene.text : [scene.text];

  // 检定等待中：显示骰子 + 伙伴能力选择
  if (pending) {
    return (
      <main className="story-panel">
        {scene.title && <h2 className="scene-title">{scene.title}</h2>}
        <div className="story-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <DiceResult roll={pending.roll} />
      </main>
    );
  }

  // 有结算结果：展示结果文本 + 继续按钮
  if (outcome) {
    return (
      <main className="story-panel">
        {scene.title && <h2 className="scene-title">{scene.title}</h2>}
        <div className="story-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="outcome-block">
          {outcome.roll && (
            <div className="dice-result readonly">
              <div className="dice-formula">
                <span>🎲 {outcome.roll.die1} + {outcome.roll.die2} + {outcome.roll.stat}{outcome.roll.statValue} = {outcome.roll.total}</span>
              </div>
            </div>
          )}
          {outcome.text.map((p, i) => (
            <p key={i} className="outcome-text">{p}</p>
          ))}
          {outcome.logs.length > 0 && (
            <div className="effect-logs">
              {outcome.logs.map((l, i) => (
                <div key={i} className="effect-log">{l}</div>
              ))}
            </div>
          )}
          {outcome.nextSceneId && (
            <button
              className="btn btn-primary btn-continue"
              onClick={() => gotoScene(outcome.nextSceneId!)}
            >
              继续
            </button>
          )}
        </div>
      </main>
    );
  }

  // 普通场景：显示选项
  return (
    <main className="story-panel">
      {scene.title && <h2 className="scene-title">{scene.title}</h2>}
      <div className="story-text">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <ChoiceList />
    </main>
  );
}
