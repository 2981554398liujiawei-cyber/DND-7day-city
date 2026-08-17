import { useGameStore } from "../store/gameStore";
import { COMPANIONS, ORIGINS } from "../data/companions";
import { periodLabel, PERIOD_ORDER } from "../data/time";
import { secretTitle } from "../data/secrets";
import { getScene } from "../data/scenes";
import { contractStatus } from "../engine/contract";
import type { CompanionId } from "../types/game";

export default function Sidebar() {
  const state = useGameStore((s) => s.state);

  if (!state) return null;

  const scene = getScene(state.currentSceneId);
  const period = periodLabel(state.periodIndex);

  const stats = state.player.stats;
  const finaleIndex = PERIOD_ORDER.indexOf("finale");
  const periodsLeft = Math.max(0, finaleIndex - state.periodIndex);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>契约者</h3>
        <div className="player-name">{state.player.name}</div>
        <div className="player-origin">{ORIGINS[state.player.origin].label}</div>
        <div className="time-display">
          <span className="time-icon">⏳</span>
          {period}
        </div>
        <div className="time-left">
          距离龙临：{periodsLeft === 0 ? "就在此刻" : `${periodsLeft} 个行动时段`}
        </div>
        <div className="resource-row">
          <span title="金币">🪙 {state.gold}</span>
          <span title="腐化">🌑 {state.corruption}</span>
          <span title="警戒">⚠️ {state.alert}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>属性</h3>
        <div className="stat-grid">
          <span>暴力 {stats.violence}</span>
          <span>身手 {stats.agility}</span>
          <span>洞察 {stats.insight}</span>
          <span>学识 {stats.knowledge}</span>
          <span>手腕 {stats.finesse}</span>
          <span>意志 {stats.will}</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>队伍</h3>
        {state.party.length === 0 && (
          <div className="empty-note">暂无同行伙伴</div>
        )}
        {state.party.map((id) => {
          const c = COMPANIONS[id as keyof typeof COMPANIONS];
          if (!c) return null;
          const cs = state.companions[id as keyof typeof state.companions];
          const cstatus = contractStatus(id as CompanionId, state);
          return (
            <div key={id} className="party-member">
              <span className="avatar" style={{ background: c.color }}>
                {c.avatarChar}
              </span>
              <div className="party-info">
                <span className="party-name">{c.name}</span>
                <span className="party-job">{c.job}</span>
                <span className="party-rel">
                  {cstatus === "contracted" ? "✨ 已契约"
                    : cstatus === "ready" ? "✨ 可缔结契约"
                    : cstatus === "locked" ? "未结识"
                    : "盟友"} · 信任 {cs.trust} · 亲密 {cs.intimacy}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-section">
        <h3>调查进度</h3>
        <div className="investigation-list">
          <div className={state.flags.blackstreet_main_done ? "done" : ""}>
            {state.flags.blackstreet_main_done ? "✓" : "○"} 黑街
            {state.flags.blackstreet_d2_done && <span className="new-tag">● 局势有变</span>}
          </div>
          <div className={state.flags.royal_main_done ? "done" : ""}>
            {state.flags.royal_main_done ? "✓" : "○"} 王城
            {state.flags.royal_d2_done && <span className="new-tag">● 局势有变</span>}
          </div>
          <div className={state.flags.church_main_done ? "done" : ""}>
            {state.flags.church_main_done ? "✓" : "○"} 圣堂
            {state.flags.church_d2_done && <span className="new-tag">● 局势有变</span>}
          </div>
          <div className={state.flags.underground_main_done ? "done" : ""}>
            {state.flags.underground_main_done ? "✓" : "○"} 地下核心
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>已知秘密</h3>
        {state.secrets.length === 0 && (
          <div className="empty-note">尚未发现任何秘密</div>
        )}
        {state.secrets.map((key) => (
          <div key={key} className="secret-item">
            <span>🔎</span>
            <span>{secretTitle(key)}</span>
          </div>
        ))}
      </div>

      {scene.title && (
        <div className="sidebar-section">
          <h3>当前地点</h3>
          <div className="scene-location">{scene.title}</div>
        </div>
      )}
    </aside>
  );
}
