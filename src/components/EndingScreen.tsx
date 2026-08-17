import { useGameStore } from "../store/gameStore";
import { getScene } from "../data/scenes";
import { COMPANIONS, ORIGINS } from "../data/companions";
import type { CompanionId, GameStateData } from "../types/game";

const ENDING_TITLES: Record<string, string> = {
  ending_return_egg: "龙归故乡",
  ending_royal: "屠龙英雄",
  ending_mage: "魔法革命",
  ending_mage_truth: "受约束的魔法革命",
  ending_dragon_contract: "龙之契约",
  ending_corruption: "城与血",
};

const SECRET_KEYS = [
  "church_knew_truth",
  "dragon_is_parent",
  "egg_is_power_source",
  "lia_spy_history",
  "mages_experimented_on_egg",
  "milena_connected_to_egg",
  "royal_plan_destroy_dragon",
  "serena_disobeyed_order",
];

const CITY_FATES: Record<string, string> = {
  ending_return_egg: "龙卵已归还，古龙携子远去",
  ending_royal: "屠龙成功，王权得到巩固",
  ending_mage: "魔法获得解放，旧秩序崩塌",
  ending_mage_truth: "魔法受缚，真相大白于天下",
  ending_dragon_contract: "城与古龙立约，龙卵安息",
  ending_corruption: "黑暗侵蚀了这座城",
};

function companionEnding(
  id: CompanionId,
  contracted: boolean,
  trust: number,
  endingId: string,
  state: GameStateData
): string {
  const flags = state.flags;
  if (id === "serena") {
    // 恋爱结局（V0.3）
    if (flags.romance_serena) {
      if (endingId === "ending_return_egg") {
        return "她被骑士团除名的那天，你在城门外等她。塞蕾娜什么也没说，只把行囊扔给你，然后牵住了你的手。";
      }
      return "战争结束后，她没有回骑士团。你们一起离开了阿斯特拉——她说，去哪都行，只要是你。";
    }
    // 受个人剧情 flag 与主结局影响
    if (endingId === "ending_dragon_contract" && contracted) {
      return "她成了龙卵的见证者。骑士团再也没有等回她——但她在城墙上，找到了比军令更值得守护的东西。";
    }
    if (endingId === "ending_royal") {
      if (flags.serena_chooses_own_path) {
        return "她没有加入屠龙阵。龙陨之后，她独自离开了骑士团——去守护那些被王权遗忘的人。";
      }
      return "她参与了屠龙。胜利的欢呼里，她握着剑沉默了很久。";
    }
    if (endingId === "ending_return_egg") {
      if (flags.serena_chooses_own_path) {
        return "她站在你身侧，看着古龙带着孩子远去：“原来骑士最好的结局，是终于不用再听命令。”";
      }
      return "她违抗了军令，没有向古龙挥剑。事后，她被骑士团除名，却从未后悔。";
    }
    if (contracted) return "你帮助她重新理解了骑士的职责。她成为独立于王权的守护者。";
    if (trust >= 60) return "她留在骑士团，但发誓用自己的方式守护平民。";
    return "她回到骑士团，继续执行命令，眼里少了一些光。";
  }
  if (id === "lia") {
    // 恋爱结局（V0.3）
    if (flags.romance_lia) {
      if (endingId === "ending_dragon_contract") {
        return "她留在你身边，守着那份跨种族的盟约。夜里她靠在你肩头，难得没有嘴硬：“……这买卖，不亏。”";
      }
      return "黎明前她没有离开。她把包袱扔进行囊，嘟囔着“麻烦”，却跟在你身后走遍了半个帝国。";
    }
    if (endingId === "ending_dragon_contract" && contracted) {
      return "她留在你身边，守着那份跨种族的盟约。“黑猫的直觉告诉我，这笔买卖，不亏。”";
    }
    if (flags.lia_counter_espionage) {
      return "她反骗了帝国一份关键情报，从此帝国再也不敢小看这只黑猫。她带着名单，笑着离开了城市。";
    }
    if (contracted) return "她与你结契同行。黑街的猫，终于有了愿意一起走的人。";
    if (trust >= 60) return "她在黎明前离开城市，留下字条：「欠你的，下辈子还。」";
    return "她没有参加最后的战斗。天亮之前，她已经离开。";
  }
  // milena
  if (flags.romance_milena) {
    if (endingId === "ending_dragon_contract") {
      return "龙卵有了新的守护者。她不再害怕自己的力量——因为她知道，无论她变成什么，都有一个人不会先松手。";
    }
    return "她与你同行。偶尔她的影子会泛着幽蓝的光，但她的手，总是暖的。";
  }
  if (endingId === "ending_dragon_contract" && contracted) {
    return "龙卵有了新的守护者。她与古龙之间的血脉契约，终于不再是一道诅咒，而是一份归宿。";
  }
  if (endingId === "ending_corruption") {
    return "龙卵熄灭后，她体内的共鸣也一并沉寂。她没有责怪你——只是安静地离开，去寻找自己新的方向。";
  }
  if (flags.milena_accepts_with_boundary) {
    return "她接受了力量，却守住了底线。她成为城市里最神秘的守护者，有人看见，她的影子偶尔会泛着幽蓝的光。";
  }
  if (contracted) return "龙卵有了新的守护者。她不再害怕自己的力量。";
  if (trust >= 60) return "她选择留在城市边缘，独自研究血脉的谜团。";
  return "龙临之后，没有人再见过她。";
}

function stageLabel(trust: number, contracted: boolean): string {
  const stage =
    trust >= 80 ? "生死之交"
    : trust >= 60 ? "深厚羁绊"
    : trust >= 40 ? "信赖"
    : trust >= 20 ? "熟悉"
    : "陌生";
  return contracted ? `${stage} · ✨ 已契约` : stage;
}

export default function EndingScreen() {
  const state = useGameStore((s) => s.state);
  const backToStart = useGameStore((s) => s.backToStart);
  const restartNewGame = useGameStore((s) => s.restartNewGame);

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

  // 本局档案
  const discovered = state.secrets.filter((k) => SECRET_KEYS.includes(k)).length;
  const contractedList = (Object.keys(state.companions) as CompanionId[])
    .filter((id) => state.companions[id].contracted)
    .map((id) => COMPANIONS[id].name);
  const romanceList = (Object.keys(state.companions) as CompanionId[])
    .filter((id) => state.flags[`romance_${id}`])
    .map((id) => COMPANIONS[id].name);
  const originLabel = ORIGINS[state.player.origin].label;
  const cityFate = CITY_FATES[endingId] ?? title;

  return (
    <div className="ending-screen">
      <div className="ending-card">
        <h1 className="ending-title">结局 · {title}</h1>

        {/* 本局档案（V0.3） */}
        <div className="ending-dossier">
          <div className="dossier-row"><span>出身</span><b>{originLabel}</b></div>
          <div className="dossier-row"><span>发现秘密</span><b>{discovered} / {SECRET_KEYS.length}</b></div>
          <div className="dossier-row"><span>最终腐化</span><b>{state.corruption}</b></div>
          <div className="dossier-row"><span>最终警戒</span><b>{state.alert}</b></div>
          <div className="dossier-row">
            <span>契约</span>
            <b>{contractedList.length > 0 ? contractedList.map((n) => `✓ ${n}`).join("  ") : "无"}</b>
          </div>
          <div className="dossier-row">
            <span>感情</span>
            <b>{romanceList.length > 0 ? romanceList.map((n) => `❤️ ${n}`).join("  ") : "无"}</b>
          </div>
          <div className="dossier-row"><span>城市命运</span><b>{cityFate}</b></div>
        </div>

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
                  <p>{companionEnding(id, cs.contracted, cs.trust, endingId, state)}</p>
                  <div className="companion-stage">
                    关系：{stageLabel(cs.trust, cs.contracted)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ending-actions">
          <button className="btn btn-primary" onClick={() => restartNewGame()}>
            重新开始
          </button>
          <button className="btn" onClick={() => backToStart()}>
            返回标题
          </button>
        </div>
      </div>
    </div>
  );
}
