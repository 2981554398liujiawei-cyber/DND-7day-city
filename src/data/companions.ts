import type { CompanionDef, CompanionId } from "../types/game";

export const COMPANIONS: Record<CompanionId, CompanionDef> = {
  serena: {
    id: "serena",
    name: "塞蕾娜·瓦尔",
    age: 27,
    job: "骑士",
    role: "保护 / 战斗",
    ability: "guardian",
    abilityName: "守护",
    abilityDesc: "一次事件中，若玩家战斗检定失败，可降低失败后果。",
    avatarChar: "塞",
    color: "#c9a24b",
    tagline: "王国骑士团的剑，向弱者许诺庇护。",
    personality: ["克制", "正直", "严肃", "有责任感"],
    desire: "成为真正值得尊敬的骑士。",
    fear: "自己只是统治者手中的武器。",
    bottomLine: "不能接受主动屠杀无辜者。",
    likes: ["承担责任", "保护平民", "正面面对危险"],
    dislikes: ["欺凌弱者", "背叛盟友", "无意义残忍"],
  },
  lia: {
    id: "lia",
    name: "莉娅·黑铃",
    age: 24,
    job: "盗贼 / 情报贩子",
    role: "潜入 / 偷窃 / 情报",
    ability: "blackCat",
    abilityName: "黑猫",
    abilityDesc: "潜入类检定失败时，可以重掷一次。",
    avatarChar: "莉",
    color: "#7aa2c2",
    tagline: "黑街的猫，只认钱，不认主子。",
    personality: ["狡猾", "嘴硬", "现实", "不信任权威"],
    desire: "自由。",
    fear: "重新成为别人的工具。",
    bottomLine: "无法接受被强迫控制。",
    likes: ["尊重她的意见", "聪明解决问题", "给她选择权"],
    dislikes: ["命令式控制", "虚伪道德", "把伙伴当消耗品"],
  },
  milena: {
    id: "milena",
    name: "米蕾娜",
    age: 26,
    job: "通缉魔女",
    role: "魔法 / 禁术 / 调查",
    ability: "forbiddenExchange",
    abilityName: "禁忌交换",
    abilityDesc: "玩家可主动将一次失败改为成功，代价：腐化 +10。",
    avatarChar: "米",
    color: "#b48ea0",
    tagline: "被教会通缉的魔女，温柔而危险。",
    personality: ["温柔", "神秘", "有自毁倾向", "对魔法极其敏感"],
    desire: "知道自己力量真正来源。",
    fear: "最终变成怪物。",
    bottomLine: "绝不允许用她的力量去毁灭自己无法承担的人。",
    likes: ["接受她", "求知", "理解而不是审判"],
    dislikes: ["宗教狂热", "利用她的力量却蔑视她", "无条件纵容她走向毁灭"],
  },
};

export const COMPANION_NAME: Record<CompanionId, string> = {
  serena: "塞蕾娜",
  lia: "莉娅",
  milena: "米蕾娜",
};

export function companionName(id: CompanionId): string {
  return COMPANION_NAME[id];
}

export const ORIGINS = {
  mercenary: {
    label: "流浪佣兵",
    desc: "刀口舔血讨生活，见惯生死。",
    stats: { violence: 2, agility: 1, insight: 0, knowledge: 0, finesse: 0, will: 1 },
    special: "第一次战斗检定失败时，可自动重掷一次。",
  },
  scholar: {
    label: "禁术学者",
    desc: "沉迷古代知识，常在禁忌边缘试探。",
    stats: { violence: 0, agility: 0, insight: 1, knowledge: 2, finesse: 0, will: 1 },
    special: "调查古代遗物时获得 +1。",
  },
  trickster: {
    label: "街头骗徒",
    desc: "靠一张嘴和三根指头过活。",
    stats: { violence: 0, agility: 1, insight: 1, knowledge: 0, finesse: 2, will: 0 },
    special: "第一次社交检定失败时，可自动重掷一次。",
  },
} as const;
