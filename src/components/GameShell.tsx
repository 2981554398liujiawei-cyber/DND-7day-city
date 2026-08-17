import { useGameStore } from "../store/gameStore";
import Sidebar from "./Sidebar";
import StoryPanel from "./StoryPanel";

export default function GameShell() {
  const state = useGameStore((s) => s.state);
  if (!state) return null;

  return (
    <div className="game-shell">
      <Sidebar />
      <div className="story-column">
        <StoryPanel />
        <div className="history-collapse">
          <details>
            <summary>📜 旅程记录</summary>
            <ul className="history-list">
              {[...state.history].reverse().map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
