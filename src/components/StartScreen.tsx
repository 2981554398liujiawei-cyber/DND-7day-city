import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { ORIGINS } from "../data/companions";
import type { Origin } from "../types/game";

export default function StartScreen() {
  const newGame = useGameStore((s) => s.newGame);
  const continueGame = useGameStore((s) => s.continueGame);
  const clearSave = useGameStore((s) => s.clearSave);

  const [name, setName] = useState("");
  const [origin, setOrigin] = useState<Origin>("mercenary");
  const [hasSave, setHasSave] = useState(() => {
    try {
      return localStorage.getItem("seven-day-city-save-v1") !== null;
    } catch {
      return false;
    }
  });

  const handleContinue = () => {
    const ok = continueGame();
    if (ok) setHasSave(true);
  };

  const handleClear = () => {
    clearSave();
    setHasSave(false);
  };

  return (
    <div className="start-screen">
      <div className="start-card">
        <h1 className="game-title">七日城 · 契约者</h1>
        <p className="game-subtitle">龙临前夜 · 48 小时</p>

        {hasSave ? (
          <div className="start-actions">
            <button className="btn btn-primary" onClick={handleContinue}>
              继续游戏
            </button>
            <button
              className="btn"
              onClick={() => {
                setHasSave(false);
              }}
            >
              新游戏
            </button>
            <button className="btn btn-danger" onClick={handleClear}>
              清除存档
            </button>
          </div>
        ) : (
          <>
            <label className="field-label" htmlFor="player-name">
              你的名字
            </label>
            <input
              id="player-name"
              className="text-input"
              value={name}
              maxLength={12}
              placeholder="输入契约者的名字"
              onChange={(e) => setName(e.target.value)}
            />

            <div className="origin-list">
              {(Object.keys(ORIGINS) as Origin[]).map((key) => (
                <button
                  key={key}
                  className={`origin-card ${origin === key ? "selected" : ""}`}
                  onClick={() => setOrigin(key)}
                >
                  <span className="origin-name">{ORIGINS[key].label}</span>
                  <span className="origin-desc">{ORIGINS[key].desc}</span>
                  <span className="origin-special">{ORIGINS[key].special}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-big"
              disabled={!name.trim()}
              onClick={() => newGame(name.trim(), origin)}
            >
              开始游戏
            </button>
          </>
        )}
      </div>
    </div>
  );
}
