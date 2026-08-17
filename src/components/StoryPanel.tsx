import { useGameStore } from "../store/gameStore";
import { getScene } from "../data/scenes";
import { periodLabel } from "../data/time";
import ChoiceList from "./ChoiceList";
import DiceResult from "./DiceResult";

const LOCATION_LABELS: Record<string, string> = {
  tavern: "灰鸦酒馆",
  royal: "王城区",
  blackstreet: "黑街",
  church: "圣堂",
  underground: "地下遗迹",
  hub: "城市广场",
  finale: "城墙之上",
};

function LocationHeader() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;
  const scene = getScene(state.currentSceneId);
  const loc = scene.location ? (LOCATION_LABELS[scene.location] ?? scene.location) : "";
  return (
    <div className="location-header">
      <span className="location-name">📍 {loc}</span>
      <span className="location-time">{periodLabel(state.periodIndex)}</span>
    </div>
  );
}

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
        <LocationHeader />
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
        <LocationHeader />
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
      <LocationHeader />
      {scene.title && <h2 className="scene-title">{scene.title}</h2>}
      <div className="story-text">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {state.corruption >= 20 && (
        <div className={`corruption-whisper${state.corruption >= 40 ? " strong" : ""}`}>
          {state.corruption >= 40
            ? "低语在耳边盘旋：『汝的血脉……与深渊共鸣。代价已付，力量将至。』你体内的黑暗，正在醒来。"
            : "不知从何处，传来一句若有若无的龙语低语，你听不清内容，只觉得心底一片冰凉。"}
        </div>
      )}
      <ChoiceList />
    </main>
  );
}
