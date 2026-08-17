import type { Scene } from "../../types/game";

export const finaleScenes: Scene[] = [
  {
    id: "finale_001",
    title: "龙临 · 前夜",
    text: [
      "最后一夜。你站在城头，风里带着铁锈与尘土的气息。地平线上，一道庞大的影子正在逼近——古龙来了。它没有咆哮，没有喷火，只是缓缓盘旋下降，像在寻找什么。",
      "全城的魔法路灯在同一刻暗了一瞬，仿佛那枚地下的龙卵感应到了母亲的到来，发出无声的共鸣。",
      "王室的重弩已经架起。塞蕾娜握紧剑，莉娅盯着王宫方向，米蕾娜闭上眼，感受着血脉里那道与龙卵相连的脉动。",
      "所有的线索、秘密与抉择，此刻都汇聚在你身上。你必须决定这座城的命运。",
    ],
    location: "finale",
    choices: [
      {
        id: "finale_return_egg",
        text: "🔎【秘密：龙是来取回孩子】主动走向古龙，归还龙卵，结束这场战争。",
        conditions: [{ type: "secret", key: "dragon_is_parent" }],
        outcome: {
          nextScene: "ending_return_egg",
        },
      },
      {
        id: "finale_royal_hunt",
        text: "帮助王室，与屠龙部队联手格杀古龙。",
        outcome: {
          nextScene: "ending_royal",
        },
      },
      {
        id: "finale_mage",
        text: "将龙卵交给法师学院，换取他们对城市的掌控。",
        conditions: [
          { type: "flag", key: "mages_experimented_on_egg", value: false },
        ],
        outcome: {
          nextScene: "ending_mage",
        },
      },
      {
        id: "finale_mage_true",
        text: "🔎【秘密：法师曾拿龙卵做实验】拿着罪证，迫使法师学院接受你的条件——龙卵由你监督，魔力供给公开透明。",
        conditions: [{ type: "secret", key: "mages_experimented_on_egg" }],
        outcome: {
          nextScene: "ending_mage_truth",
        },
      },
      {
        id: "finale_dragon_contract",
        text: "🔎【隐藏·龙之契约】与古龙立约，让龙卵留下、由龙定期供给魔力。",
        conditions: [
          { type: "secret", key: "milena_connected_to_egg" },
          { type: "flag", key: "bonded_with_egg", value: true },
          { type: "companionInParty", id: "milena" },
          { type: "flag", key: "dragon_contract_attempted", value: false },
        ],
        outcome: {
          nextScene: "finale_dragon_contract_attempt",
        },
      },
      {
        id: "finale_corruption_power",
        text: "🌑【腐化·危险魔法】撕开龙卵的魔力，强行把整座城的能源与你相连——以你的血肉为代价。",
        conditions: [{ type: "corruption", min: 40 }],
        outcome: {
          nextScene: "ending_corruption",
        },
      },
    ],
  },

  {
    id: "finale_dragon_contract_attempt",
    title: "龙之契约 · 意志的试炼",
    text: [
      "你走向那头庞大的古龙。它垂下头，琥珀色的竖瞳里映出你的身影——与你掌心那枚龙卵的共鸣，正是你在地下建立的那一丝联系。",
      "米蕾娜站在你身侧，指尖泛着幽蓝的光。你向古龙提出那道前所未有的契约：龙卵留下，作为城市运转的核心；而古龙定期归来供给魔力，人类逐步停止榨取它孩子的生命。",
      "古龙久久凝视着你。它的意志如深潭般压下来——那不是攻击，而是审判。它在衡量，你是否有资格成为这道契约的见证者。",
    ],
    location: "finale",
    choices: [
      {
        id: "finale_dragon_contract_attempt_a",
        text: "🎲【意志·ancient】挺直脊背，与古龙的意志正面相对。",
        check: { stat: "will", modifier: 0, tags: ["ancient"] },
        success: {
          text: "你的意志如钢般稳固。古龙的目光从审视变为接纳——它低下头，与你立下契约。当契约之光散尽，你感到米蕾娜紧紧握住了你的手，她的眼里，是得偿所愿的明亮的光。",
          effects: [
            { type: "setFlag", key: "dragon_contract_attempted", value: true },
            { type: "setFlag", key: "dragon_contract_made", value: true },
          ],
          nextScene: "ending_dragon_contract",
        },
        partial: {
          text: "古龙的意志压得你膝盖发软，但你终究没有后退。契约成立，却带着代价——你的灵魂深处，留下了一道龙血的烙印。从此，龙卵继续运转城市，而你体内那股被强行引导的魔力，将永远伴随着你。",
          effects: [
            { type: "setFlag", key: "dragon_contract_attempted", value: true },
            { type: "setFlag", key: "dragon_contract_made", value: true },
            { type: "corruption", amount: 15 },
          ],
          nextScene: "ending_dragon_contract",
        },
        failure: {
          text: "古龙的意志如潮水般吞没你。你踉跄后退，脸色惨白——契约无法成立。古龙失望地移开目光，缓缓退向天际。你回到城头，必须在剩下的选择里，重新决定这座城的命运。",
          effects: [
            { type: "setFlag", key: "dragon_contract_attempted", value: true },
            { type: "corruption", amount: 5 },
          ],
          nextScene: "finale_001",
        },
      },
      {
        id: "finale_dragon_contract_attempt_b",
        text: "放弃契约——你承受不住这股意志。",
        outcome: {
          text: "你退后一步，承认自己无法承担这样的重量。古龙没有为难你，只是垂下眼帘，缓缓退向天际。你回到城头，重新决定这座城的命运。",
          effects: [
            { type: "setFlag", key: "dragon_contract_attempted", value: true },
          ],
          nextScene: "finale_001",
        },
      },
    ],
  },

  {
    id: "ending_return_egg",
    title: "结局 · 龙归故乡",
    text: [
      "你放下武器，独自走向那头庞大的古龙。夜风里，它垂下头，琥珀色的竖瞳静静注视着你——那目光里没有敌意，只有一位母亲的疲惫与思念。",
      "你取出那枚在城下待了近百年的龙卵。当你抬手时，古龙没有夺，而是用鼻尖极轻地碰了碰卵壳。那一刻，全城的魔力网络骤然熄灭——路灯、供暖、魔法屏障，一齐暗了下去。",
      "城市陷入短暂的黑暗与恐慌。但古龙没有烧毁任何东西。它只是小心地叼起龙卵，腾空而起，在晨曦中渐行渐远。",
      "战争避免了。但阿斯特拉将面对没有魔力的漫长寒冬，和一场关于‘值不值得’的长久争论。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_return_egg_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_royal",
    title: "结局 · 屠龙英雄",
    text: [
      "你与塞蕾娜并肩，汇入王室的重弩阵中。当古龙俯冲时，数十支灌注魔法的屠龙弩同时发射。巨兽发出震彻天际的哀鸣，坠落在城墙外。",
      "龙卵继续作为这座城市的能源运转。你被封为帝国的屠龙英雄，阿斯特拉的光明依旧，街道上挂满为你欢呼的旗帜。",
      "可你知道，那头龙坠落前，最后望了一眼城下，望的不是你，而是那枚再也回不去的卵。",
      "就在欢呼声中，有人低声说：远方，似乎还有更多龙在苏醒。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_royal_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_mage",
    title: "结局 · 魔法革命",
    text: [
      "你带着龙卵的处置权，走进那扇紧锁的学院大门。法师们早已备好新的拘束符文——他们承诺，会‘更高效’地利用这颗能源核心，让阿斯特拉成为帝国最强大的魔法城市。",
      "从此，法师学院掌控了城市命脉。学者们宣称这是进步，是文明。没人敢问，那枚卵里，是否还住着一个渴望回家的孩子。",
      "城市的夜空被魔法染成幽蓝。你得到权势与尊重，却常在夜深时，听见一丝极轻的、仿佛来自地下的心跳。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_mage_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_mage_truth",
    title: "结局 · 受约束的魔法革命",
    text: [
      "你走进法师学院那扇紧锁的大门，将那份染血的实验档案拍在首席法师的桌上。他的脸色，在看到档案的瞬间变得煞白。",
      "“龙卵是活的生命，不是你们的电池。”你平静地说，“从今天起，魔力的抽取必须公开、限量、可核查。学院的每一笔‘实验’，都要接受监督。”",
      "首席法师沉默良久，最终签下了这份让步书。学院保住了面子，你保住了底线——龙卵继续运转城市，但从此，没有人能再把它当作沉默的牺牲品。",
      "这不算完美的胜利。但至少，下一次有人想‘研究’这枚卵时，必须先回答你的问题。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_mage_truth_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_corruption",
    title: "结局 · 城与血",
    text: [
      "你撕开龙卵的魔力，让整座城的能源顺着你的血脉奔涌。灯光骤亮，全城陷入刺目的白昼——然后，一切归于沉寂。",
      "龙卵的共鸣彻底熄灭了。古龙在远处发出一声悲恸的咆哮，却没有靠近。它知道，自己的孩子已经死了。",
      "城市得救了——没有龙临，没有战争。但地下的核心从此冰冷，魔法灯一盏盏熄灭。而你在那个瞬间清楚地听见，自己体内，多了一道永远无法愈合的裂缝。",
      "阿斯特拉重新点起了蜡烛。人们感谢你。只有你知道，那枚卵里最后的心跳，是为你而停的。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_corruption_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_dragon_contract",
    title: "隐藏结局 · 龙之契约",
    text: [
      "你闭上眼，将契约者的灵魂之力探向那头疲惫的古龙，同时让米蕾娜站在你身侧——她的血脉与龙卵相连，成了这座城与龙之间唯一的桥梁。",
      "古龙没有拒绝你的提议。它垂下头，与你立下一道前所未有的契约：龙卵留下，作为城市继续运转的核心；而你与米蕾娜，作为它的见证者与守护者，替它看护那枚卵。作为回报，古龙会定期回到这里，供给足够的魔力，让人类逐步停止抽取它孩子的生命。",
      "当契约之光散尽，你感到米蕾娜紧紧握住了你的手。她的眼里，不再是恐惧，而是一种得偿所愿的、明亮的光。",
      "从今往后，阿斯特拉的灯火不再是榨取生命的烛火，而是一份真正的、跨越种族的盟约。",
    ],
    location: "finale",
    choices: [
      {
        id: "ending_dragon_contract_continue",
        text: "（继续）",
        outcome: {
          nextScene: "ending_screen",
        },
      },
    ],
  },

  {
    id: "ending_screen",
    title: "（结局）",
    text: [],
    location: "finale",
    choices: [],
  },
];
