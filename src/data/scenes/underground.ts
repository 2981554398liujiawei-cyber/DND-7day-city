import type { Scene } from "../../types/game";

export const undergroundScenes: Scene[] = [
  {
    id: "underground_001",
    title: "地下魔力核心",
    text: [
      "沿着枯井与锈蚀的铁管往下，空气越来越闷热，墙上却亮着一种不正常的、温暖的蓝光——那不是火，是一种近乎有生命的光。",
      "管线尽头，是一间巨大的穹顶石室。城市的魔力网络在这里汇聚、分流，像无数条血管连向一颗心脏。而那颗心脏，正悬浮在石室中央。",
      "一枚半人高的龙卵。它被层层符文与金属拘束环锁住，卵壳表面缓缓流转着金红色的光，一下，一下，像心跳。",
      "米蕾娜的脸色瞬间变了。她捂住胸口，声音发颤：“……就是它。它在叫我。”",
    ],
    location: "underground",
    choices: [
      {
        id: "underground_001_a",
        text: "凑近观察龙卵与拘束装置。",
        check: { stat: "knowledge", modifier: 1 },
        success: {
          text: "你看出这套拘束装置的设计——它把龙卵当作一座永动的魔力炉，抽取它的生命维系全城。你甚至认出其中几道符文来自法师学院的标识。他们是主谋。",
          effects: [
            { type: "addSecret", key: "egg_is_power_source" },
            { type: "addSecret", key: "mages_experimented_on_egg" },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
        partial: {
          text: "你看出这是一枚被当作能源的龙卵——整座城市的魔法都抽自它的生命。但拘束装置的来历，你看不透。",
          effects: [
            { type: "addSecret", key: "egg_is_power_source" },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
        failure: {
          text: "符文太深奥了，你看不出全部。但你至少确认了：眼前这枚龙卵，就是整座城魔力网络的源头。",
          effects: [
            { type: "addSecret", key: "egg_is_power_source" },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
      },
      {
        id: "underground_001_b",
        text: "问米蕾娜，她和这枚卵之间究竟有什么联系。",
        conditions: [{ type: "flag", key: "milena_connected_to_egg_echo", value: true }],
        outcome: {
          text: [
            "米蕾娜缓缓伸手，隔着一段距离，指尖的蓝光与龙卵的呼吸同频：“我小时候体弱多病，被家里人送进圣堂的育幼院。后来，我开始做一个梦——梦见一颗在黑暗里跳动的、温暖的心脏。”",
            "她落下泪来：“现在我知道那不是梦。我的血脉……和它连在一起。我害怕。我怕自己，就是它用来苏醒的钥匙。”",
          ],
          effects: [
            { type: "addSecret", key: "milena_connected_to_egg" },
            { type: "trust", id: "milena", amount: 8 },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
      },
      {
        id: "underground_001_c",
        text: "伸手触摸龙卵的卵壳。",
        check: { stat: "will", modifier: 0 },
        success: {
          text: "指尖触及卵壳的一瞬，一股不属于你的、浩大的记忆涌进脑海：一道古龙的影子俯视大地，风沙里它低吼——『我的孩子……我来接你回家。』你猛地缩回手，几乎跪倒。你终于懂了：那头龙不是来毁城的。",
          effects: [
            { type: "addSecret", key: "dragon_is_parent" },
            { type: "corruption", amount: 5 },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
        partial: {
          text: "你触及卵壳，只感到一阵潮水般的哀伤与思念。虽然看不清全貌，但你直觉确信：这枚卵的父亲或母亲，还活着，而且正在赶来。",
          effects: [
            { type: "addSecret", key: "dragon_is_parent" },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
        failure: {
          text: "龙卵发出一声低沉的震鸣，将你的手弹开。你眼前一黑，隐约看见一个庞大的影子——随即一切归于沉寂。那影子……让你想到‘龙’。",
          effects: [
            { type: "corruption", amount: 5 },
            { type: "setFlag", key: "underground_main_done", value: true },
          ],
          nextScene: "underground_002",
        },
      },
    ],
  },
  {
    id: "underground_002",
    title: "地下的抉择",
    text: [
      "石室里，蓝光与金红色的呼吸交织。你终于拼凑出全部真相：",
      "这座让阿斯特拉富庶百年的城市，它的光明、它的供暖、它的魔法——全部抽自这枚被夺走的龙卵。而一头古龙，正在两天后抵达，来取回它的孩子。",
      "还回去，整座城的光会熄灭。不还回去，就要杀死一位母亲。",
      "这个选择，落在你肩上。塞蕾娜、莉娅、米蕾娜都看着你。",
    ],
    location: "underground",
    choices: [
      {
        id: "underground_002_a",
        text: "先退出地下，把这件事带出去再做打算。",
        outcome: {
          text: "你们原路返回地面。龙卵的蓝光在身后缓缓熄灭，像一只合上的眼睛。你知道，明晚之前，你必须做出决定。",
          effects: [
            { type: "setFlag", key: "finale_unlocked", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "underground_002_b",
        text: "尝试用契约能力与龙卵沟通。",
        check: { stat: "will", modifier: 1 },
        success: {
          text: "你闭上眼，将灵魂的触角探向那枚龙卵。它回应了你——不是语言，而是一道清晰的意念：『愿意的话，替我告诉我的母亲——这里的恩怨，我们自己了结。』你和龙卵，建立了一丝共鸣。",
          effects: [
            { type: "setFlag", key: "bonded_with_egg", value: true },
            { type: "setFlag", key: "finale_unlocked", value: true },
            { type: "corruption", amount: 10 },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你试图沟通，却只感到一阵模糊的暖意与困倦。龙卵似乎对你不设防，但也无法清晰回应。你退开，心口却残留着一缕共鸣。",
          effects: [
            { type: "setFlag", key: "bonded_with_egg", value: true },
            { type: "setFlag", key: "finale_unlocked", value: true },
            { type: "corruption", amount: 5 },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "龙卵对陌生灵魂的触碰剧烈抗拒，一股大力将你震退。你踉跄站稳，感到一阵恶心。这次沟通失败了。",
          effects: [
            { type: "setFlag", key: "finale_unlocked", value: true },
            { type: "corruption", amount: 5 },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
