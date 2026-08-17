import type { Scene } from "../../types/game";

export const introScenes: Scene[] = [
  {
    id: "intro_001",
    title: "灰鸦酒馆 · 黄昏前",
    text: [
      "阿斯特拉，帝国边境的龙巢之城。魔法路灯彻夜不熄，炼金工坊昼夜轰鸣——这座城富得像是在用黄金铺路，没人追问地下的火从何而来。",
      "今日酒馆却安静得反常。方才，一名披着星图的占星师站在高脚凳上，用沙哑的嗓音宣布：",
      "“两天之后，巨龙将抵达阿斯特拉。”",
      "没有人敢笑。预言师三天前就预告了暴雨，而暴雨真的来了。酒馆里有人开始收拾细软，有人攥紧杯沿。你，一个恰好路过的契约者，坐在这片惶惶的人群中央。",
    ],
    location: "tavern",
    choices: [
      {
        id: "intro_001_a",
        text: "打量四周，记住那些慌乱的面孔。",
        outcome: {
          text: "你的目光扫过酒馆：柜台后的酒保面无表情地擦着同一只杯子；角落的猎魔人灌下半杯劣酒；一名银甲骑士独自坐在窗边，背脊笔直，仿佛灾难与她无关。",
          effects: [{ type: "setFlag", key: "met_tavern_people", value: true }],
          nextScene: "intro_002",
        },
      },
      {
        id: "intro_001_b",
        text: "走向占星师，追问龙的消息。",
        check: { stat: "knowledge", modifier: 1 },
        success: {
          text: "占星师眯眼打量你：“你很懂星象？”她压低声音，“那头龙不是普通野兽。它飞得很稳、很慢，像在找什么东西……这不像来毁城的架势。”",
          effects: [{ type: "setFlag", key: "heard_dragon_seeking", value: true }],
          nextScene: "intro_002",
        },
        partial: {
          text: "“我只知道它来了。”占星师摇头，“至于它想干什么，我的星图只写了‘归来’两个字。”",
          effects: [{ type: "setFlag", key: "heard_dragon_seeking", value: true }],
          nextScene: "intro_002",
        },
        failure: {
          text: "占星师冷笑：“外行也配问龙？”她别过头去，但你还是听见她嘟囔了一句，“……归来。”",
          effects: [{ type: "setFlag", key: "heard_dragon_seeking", value: true }],
          nextScene: "intro_002",
        },
      },
      {
        id: "intro_001_c",
        text: "在窗边骑士面前坐下，试探她的态度。",
        outcome: {
          text: "骑士抬眼看你，目光冷静。她没赶你走，只是说：“预言师说两天后龙会来。可我要确认的，不是龙会不会来，而是骑士团打算让平民站在哪一边。”",
          effects: [{ type: "setFlag", key: "met_serena", value: true }],
          nextScene: "intro_002",
        },
      },
    ],
  },
  {
    id: "intro_002",
    title: "三个陌生人",
    text: [
      "就在这时，酒馆的门被推开。进来的人有三副截然不同的面孔。",
      "银甲骑士走到你面前，手按剑柄，语气公式化而坚定：“我是塞蕾娜·瓦尔，王国骑士团见习队长。两天后龙会来，我需要能信任的帮手。你，是什么人？”",
      "她身后，一个裹着黑斗篷的女人懒洋洋地靠在门框上，指尖转着一枚硬币，笑容里没有半点敬意：“骑士团的人请来的‘帮手’？哈，那我走错地方了。”",
      "而最后进来的那位——披着旧袍、面容温柔的女人——只是安静地站在阴影里，像一截即将燃尽的烛火。她没自我介绍。",
    ],
    location: "tavern",
    choices: [
      {
        id: "intro_002_a",
        text: "表明自己契约者的身份。",
        outcome: {
          text: "“契约者？”塞蕾娜微微挑眉，“能和生命立契的那种人？……那倒是少见。有这份本事，确实比只会挥剑的人有用。”",
          nextScene: "intro_003",
        },
      },
      {
        id: "intro_002_b",
        text: "先问黑斗篷的女人是谁。",
        outcome: {
          text: "女人啧了一声，硬币在她指间打了个旋：“莉娅。黑街卖消息的。我本来只想来碰碰运气，看有没有冤大头愿意花钱买龙的消息。”",
          effects: [{ type: "setFlag", key: "met_lia", value: true }],
          nextScene: "intro_003",
        },
      },
      {
        id: "intro_002_c",
        text: "留意阴影里那位温柔的女人。",
        outcome: {
          text: "她似乎察觉了你的目光，轻声开口，声音像浸过水的丝绸：“我叫米蕾娜。教会的人说我是魔女，正在通缉我。如果你觉得麻烦，可以现在就当没见过我。”",
          effects: [{ type: "setFlag", key: "met_milena", value: true }],
          nextScene: "intro_003",
        },
      },
    ],
  },
  {
    id: "intro_003",
    title: "各自的目的",
    text: [
      "塞蕾娜正色道：“我没空周旋。龙灾当前，我想知道真相——王室到底想干什么，骑士团的命令又是什么。”",
      "莉娅耸肩：“我只要钱。谁付钱，我给谁真话。说真的，这两天黑市里关于龙的消息，比过去十年的都多，而且全都指向同一个地方。”",
      "米蕾娜静静地看着你：“……我感觉到地下有一股很强的魔力波动，和我的血脉在共鸣。我想知道那是什么。你，愿意和我一起弄清楚吗？”",
      "三人同时看向你，等你选择第一个同行者。",
    ],
    location: "tavern",
    choices: [
      {
        id: "intro_003_a",
        text: "选择塞蕾娜同行。",
        outcome: {
          text: "塞蕾娜点头，抱剑而立：“好。我信你能替平民做点事。王城区那边，我来想办法。”",
          effects: [
            { type: "recruit", id: "serena" },
            { type: "setLocation", id: "tavern" },
            { type: "setFlag", key: "first_companion", value: true },
          ],
          nextScene: "intro_004",
        },
      },
      {
        id: "intro_003_b",
        text: "选择莉娅同行。",
        outcome: {
          text: "莉娅把硬币抛给你，笑道：“成交。先说好，我只是暂时跟趟，随时可能走人。黑街的消息，我比你熟。”",
          effects: [
            { type: "recruit", id: "lia" },
            { type: "setLocation", id: "tavern" },
            { type: "setFlag", key: "first_companion", value: true },
          ],
          nextScene: "intro_004",
        },
      },
      {
        id: "intro_003_c",
        text: "选择米蕾娜同行。",
        outcome: {
          text: "米蕾娜松了一口气，露出一个极浅的笑容：“谢谢你愿意接受我。地下的事……我直觉那很重要。”",
          effects: [
            { type: "recruit", id: "milena" },
            { type: "setLocation", id: "tavern" },
            { type: "setFlag", key: "first_companion", value: true },
          ],
          nextScene: "intro_004",
        },
      },
    ],
  },
  {
    id: "intro_004",
    title: "夜访已定",
    text: [
      "你们在酒馆一角坐下。塞蕾娜简短地交换了情报，莉娅则用两句话点破现状：“王室让骑士团封锁街道，教会在传‘龙灾是天罚’，法师学院——他们忽然全部闭嘴了。三股势力在抢一个真相。”",
      "米蕾娜低声补充：“而且，地下那东西……它很古老，也很痛苦。我从没见过这样的魔力，像一颗在跳动的心脏。”",
      "窗外，暮色已经彻底沉下去。两天后龙就会抵达。你只有有限的行动时间。",
      "“从哪查起？”塞蕾娜问。",
    ],
    location: "tavern",
    choices: [
      {
        id: "intro_004_a",
        text: "去黑街碰碰运气。",
        outcome: {
          text: "莉娅笑了笑：“正合我意。黑街的老熟人，该让他们吐点真话出来了。”",
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "intro_004_b",
        text: "去王城区看骑士团的动作。",
        outcome: {
          text: "塞蕾娜起身：“跟我来。我认得进城的路。”",
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "intro_004_c",
        text: "去圣堂查教会记录。",
        outcome: {
          text: "米蕾娜轻轻点头：“圣堂……我熟悉那里的每个角落，也熟悉那里的谎言。”",
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
