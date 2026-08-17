export const SECRETS: Record<string, { title: string; desc: string }> = {
  dragon_is_parent: {
    title: "龙是来取回孩子",
    desc: "那头古龙并非要毁灭城市，它是来取回自己的孩子。",
  },
  egg_is_power_source: {
    title: "城市能源来自龙卵",
    desc: "阿斯特拉的魔法能源核心，其实是一枚被夺走的龙卵。",
  },
  church_knew_truth: {
    title: "教会早就知道真相",
    desc: "圣堂高层一直知道能源真相，却用‘龙灾’掩盖了几十年。",
  },
  mages_experimented_on_egg: {
    title: "法师曾拿龙卵做实验",
    desc: "法师学院曾在龙卵上施行禁忌实验，试图抽取更多力量。",
  },
  royal_plan_destroy_dragon: {
    title: "王室计划屠龙",
    desc: "王室已秘密集结屠龙部队，准备在龙抵达时一举格杀。",
  },
  lia_spy_history: {
    title: "莉娅曾是帝国情报员",
    desc: "莉娅·黑铃的过去属于帝国情报机构。",
  },
  serena_disobeyed_order: {
    title: "塞蕾娜违抗过军令",
    desc: "塞蕾娜曾违抗命令，救下一群敌国平民。",
  },
  milena_connected_to_egg: {
    title: "米蕾娜的力量与龙卵相连",
    desc: "米蕾娜体内的魔力，与那枚龙卵产生了共鸣。",
  },
};

export function secretTitle(key: string): string {
  return SECRETS[key]?.title ?? key;
}
