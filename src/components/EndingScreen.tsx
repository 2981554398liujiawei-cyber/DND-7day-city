import { useGameStore } from "../store/gameStore";
import { getScene } from "../data/scenes";
import { COMPANIONS } from "../data/companions";
import type { CompanionId } from "../types/game";

const ENDING_TITLES: Record<string, string> = {
  ending_return_egg: "龙归故乡",
  ending_royal: "屠龙英雄",
  ending_mage: "魔法革命",
  ending_dragon_contract: "龙之契约",
};

function companionEnding(id: CompanionId, contracted: boolean, trust: number): string {
  if (id === "serena") {
    if (contracted) return "你帮助她重新理解了骑士的职责。她成为独立于王权的守护者。";
    if (trust >= 60) return "她留在骑士团，但发誓用自己的方式守护平民。";
    return "她回到骑士团，继续执行命令，眼里少了一些光。";
  }
  if (id === "lia") {
    if (contracted) return "她与你结契同行。黑街的猫，终于有了愿意一起走的人。";
    if (trust >= 60) return "她在黎明前离开城市，留下字条：「欠你的，下辈子还。」";
    return "她没有参加最后的战斗。天亮之前，她已经离开。";
  }
  // milena
  if (contracted) return "龙卵有了新的守护者。她不再害怕自己的力量。";
  if (trust >= 60) return "她选择留在城市边缘，独自研究血脉的谜团。";
  return "龙临之后，没有人再见过她。";
}

export default function EndingScreen() {
  const state = useGameStore((s) => s.state);
  const backToStart = useGameStore((s) => s.backToStart);

  if (!state) return null;

  const endingId = state.ending ?? state.currentSceneId;
  const title = ENDING_TITLES[endingId] ?? "结局";

  // 依据结局 id 显示结局正文
  const endingScene = endingId;
  const bodyText =
    endingScene && getScene(endingScene) ? getScene(endingScene).text : [];

  const knownCompanions = (Object.keys(state.companions) as CompanionId[]).filter(
    (id) => state.companions[id].met
  );

  return (
    <div className="ending-screen">
      <div className="ending-card">
        <h1 className="ending-title">结局 · {title}</h1>

        {endingScene ? (
          <div className="ending-body">
            {Array.isArray(bodyText) ? (
              bodyText.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{bodyText}</p>
            )}
          </div>
        ) : (
          <div className="ending-body">
            <p>阿斯特拉的命运，因你的选择而尘埃落定。</p>
          </div>
        )}

        <div className="ending-companions">
          <h2>伙伴们的结局</h2>
          {knownCompanions.length === 0 && <p>没有人与你同行到最后。</p>}
          {knownCompanions.map((id) => {
            const def = COMPANIONS[id];
            const cs = state.companions[id];
            return (
              <div key={id} className="ending-companion">
                <span className="avatar" style={{ background: def.color }}>
                  {def.avatarChar}
                </span>
                <div>
                  <div className="companion-name">{def.name}</div>
                  <p>{companionEnding(id, cs.contracted, cs.trust)}</p>
                  <div className="companion-stage">
                    关系：{cs.trust >= 80 ? "羁绊" : cs.trust >= 60 ? "契约伙伴" : cs.trust >= 40 ? "盟友" : "陌生"}
                    {cs.contracted ? " · ✨ 已契约" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ending-actions">
          <button className="btn btn-primary" onClick={() => backToStart()}>
            回到主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
