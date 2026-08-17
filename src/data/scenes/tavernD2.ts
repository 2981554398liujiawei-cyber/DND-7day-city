import type { Scene } from "../../types/game";

export const tavernD2Scenes: Scene[] = [
  {
    id: "tavern_d2_001",
    title: "灰鸦酒馆 · 难民夜",
    text: [
      "灰鸦酒馆从来没有这么挤过。大厅里挤满了从城郊涌进来的难民——他们裹着单薄的毯子，抱着孩子，用惊恐的眼神看着每一个穿铠甲的人。",
      "柜台后，酒保苦笑着给你倒了一杯酒：“外乡人，现在整个城郊的人都在往王城方向跑。他们说，龙来的方向，地都在震。”",
      "角落里有几个商人模样的人正压着嗓子讨价还价：“……金子还能带出去，房产？那种东西现在一文不值！”“听说圣堂在发赎罪券，十金币一张，买了就能进城避难。”",
      "你的伙伴们也在打量着这一幕。塞蕾娜的眉头拧得很紧，莉娅冷眼扫视着人群，米蕾娜则安静地靠在墙边，听着某个难民的低语。",
    ],
    location: "tavern",
    choices: [
      {
        id: "tavern_d2_001_a",
        text: "和塞蕾娜讨论这些难民。",
        conditions: [{ type: "companionInParty", id: "serena" }],
        outcome: {
          text: "塞蕾娜低声说：“他们什么都不知道。他们只知道‘龙要来’，就收拾了一辈子的家当逃出来了。”她顿了顿，“等龙真的来了，我希望站在他们前面的人里，有我一个。”",
          effects: [
            { type: "trust", id: "serena", amount: 5 },
            { type: "intimacy", id: "serena", amount: 2 },
          ],
          nextScene: "tavern_d2_002",
        },
      },
      {
        id: "tavern_d2_001_b",
        text: "和莉娅聊聊这群人里有没有可疑的面孔。",
        conditions: [{ type: "companionInParty", id: "lia" }],
        outcome: {
          text: "莉娅懒洋洋地扫了一圈，忽然压低声音：“看见角落那个穿灰袍的没有？他手腕上有帝国情报处的烙印。”她眯起眼，“帝国的人混在难民里进城——有意思。要不要跟上去看看？”",
          effects: [
            { type: "trust", id: "lia", amount: 5 },
            { type: "setFlag", key: "imperial_agent_in_city", value: true },
          ],
          nextScene: "tavern_d2_002",
        },
      },
      {
        id: "tavern_d2_001_c",
        text: "和米蕾娜一起听那个难民的低语。",
        conditions: [{ type: "companionInParty", id: "milena" }],
        outcome: {
          text: "米蕾娜示意你靠近墙边。那个难民正闭着眼喃喃自语：“……我听见了。那东西在地下叫。从昨天开始，它一直在叫，像哭，又像喊妈妈。”米蕾娜的脸色微微一白，握紧了你的手臂。",
          effects: [
            { type: "trust", id: "milena", amount: 5 },
            { type: "intimacy", id: "milena", amount: 2 },
            { type: "setFlag", key: "milena_connected_to_egg_echo", value: true },
          ],
          nextScene: "tavern_d2_002",
        },
      },
      {
        id: "tavern_d2_001_d",
        text: "花 10 金币，向逃亡商人打听王宫的最新动向。",
        conditions: [{ type: "gold", min: 10 }],
        outcome: {
          text: "商人收下金币，压低声音：“听说王宫在连夜往城外运东西——金子、卷宗、还有几个‘重要人物’。要我说，王室自己都在准备跑路，却让全城的人留下‘迎战’。”他摇摇头，“这城，怕是要变天了。”",
          effects: [
            { type: "gold", amount: -10 },
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
          ],
          nextScene: "tavern_d2_002",
        },
      },
      {
        id: "tavern_d2_001_e",
        text: "先不交谈，听听大厅里的传言。",
        outcome: {
          text: "你混在人堆里，听了一耳朵的传言：“龙是冲王宫来的！”“不，龙是来救人的！”“听说城地下埋着一座古墓，龙是守墓的！”……真真假假，谁也说不清。但你注意到，几乎所有传言，都绕不开‘地下’两个字。",
          effects: [
            { type: "setFlag", key: "tavern_heard_rumors", value: true },
          ],
          nextScene: "tavern_d2_002",
        },
      },
    ],
  },
  {
    id: "tavern_d2_002",
    title: "酒馆 · 暂歇",
    text: [
      "难民们渐渐在酒馆的地板上睡着了。你短暂地休整，把今天带回来的线索在脑子里连成线。",
      "龙临越来越近。你必须决定，明天（或者说，今夜）的去向。",
    ],
    location: "tavern",
    choices: [
      {
        id: "tavern_d2_002_a",
        text: "结束休整，继续行动。",
        outcome: {
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "tavern_d2_002_b",
        text: "在这里休息到夜晚，再作打算。",
        conditions: [
          { type: "periodIn", in: ["d2_morning", "d2_afternoon", "d2_dusk"] },
        ],
        outcome: {
          text: "你在酒馆的角落里靠着墙坐下。窗外的灯火在雾气里晕开，像一整座城在做同一个梦。你闭上眼，等着夜色彻底降临。",
          effects: [
            { type: "advanceToNight" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
