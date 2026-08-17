import { COMPANIONS } from "../data/companions";
import type { CompanionId } from "../types/game";
import { useGameStore } from "../store/gameStore";
import { contractStatus } from "../engine/contract";

export default function CompanionCard({ id }: { id: CompanionId }) {
  const state = useGameStore((s) => s.state);
  if (!state) return null;
  const def = COMPANIONS[id];
  const cs = state.companions[id];
  if (!def || !cs.met) return null;

  const stage =
    cs.trust >= 80 ? "生死之交"
    : cs.trust >= 60 ? "深厚羁绊"
    : cs.trust >= 40 ? "信赖"
    : cs.trust >= 20 ? "熟悉"
    : "陌生";

  const cstatus = contractStatus(id, state);
  const inParty = state.party.includes(id);
  const contractBadge =
    cstatus === "contracted" ? "✨ 已契约"
    : cstatus === "ready" ? "✨ 可缔结契约"
    : "契约：尚未就绪";

  return (
    <div className={`companion-card${inParty ? " in-party" : ""}`}>
      <div className="companion-head">
        <span className="avatar" style={{ background: def.color }}>
          {def.avatarChar}
        </span>
        <div>
          <div className="companion-name">{def.name}</div>
          <div className="companion-job">{def.job} · {def.role}</div>
        </div>
        {inParty && <span className="party-tag">在队</span>}
      </div>
      <div className="rel-bars">
        <div className="rel-bar">
          <span>信任</span>
          <div className="bar"><div className="bar-fill trust" style={{ width: `${cs.trust}%` }} /></div>
          <em>{cs.trust}</em>
        </div>
        <div className="rel-bar">
          <span>亲密</span>
          <div className="bar"><div className="bar-fill intimacy" style={{ width: `${cs.intimacy}%` }} /></div>
          <em>{cs.intimacy}</em>
        </div>
      </div>
      <div className="companion-stage">
        关系：{stage}
        {cs.contracted && " · ✨ 已契约"}
      </div>
      <div className={`contract-badge ${cstatus === "ready" ? "ready" : ""}`}>
        {contractBadge}
      </div>
    </div>
  );
}
