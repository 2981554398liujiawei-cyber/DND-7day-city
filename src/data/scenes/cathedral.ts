import type { Scene } from "../../types/game";

export const cathedralScenes: Scene[] = [
  {
    id: "church_001",
    title: "圣堂 · 烛火与档案",
    text: [
      "圣堂穹顶高得让人发冷。诵经声被高墙折返成嗡嗡的回响，信徒们跪在长凳上，为‘即将降临的天罚’祈祷。一名执事正在分发写着‘龙灾即神罚’的告示。",
      "米蕾娜用兜帽遮住脸，低声道：“他们管这个叫天罚。可我在这座城里活了几十年，从没听他们提过‘地下的火’。”",
      "你们溜进圣堂的档案室。积灰的卷宗堆到天花板，而关于龙的最早记录，被锁在最深处的一口铁柜里。",
    ],
    location: "church",
    choices: [
      {
        id: "church_001_a",
        text: "撬开那口铁柜。",
        check: { stat: "agility", modifier: 1, companion: "lia" },
        success: {
          text: "锁应声而开。柜里躺着一卷发黄的羊皮纸，上面用帝国古语写着：“龙卵入城，为城之血。今封印地下，禁人查问。”落款是几十年前的第一任圣堂大主教。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        partial: {
          text: "锁被撬开了一半，警铃没响，但你也只来得及看清一句：“……地下之物名为龙卵，为全城魔力之源泉。”",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        failure: {
          text: "撬锁时你划破了手，铁柜纹丝不动。米蕾娜却轻轻按住铁柜表面，低声道：“……这柜子被很重的魔力封着，锁是假象。施术的人，不希望任何人打开。”",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
      },
      {
        id: "church_001_b",
        text: "让米蕾娜用魔力探查铁柜。",
        check: { stat: "knowledge", modifier: 1, companion: "milena" },
        success: {
          text: "米蕾娜闭眼，指尖泛起幽蓝的光。片刻后她睁眼，声音发颤：“里面……有一卷‘龙卵封印’的记录。地下那东西，不是普通能源——它是有生命的。而且，”她顿了一下，“它一直在痛苦地跳动着。”",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "milena_connected_to_egg_echo", value: true },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        partial: {
          text: "米蕾娜脸色微白：“柜里封着一卷旧档案，写着‘龙卵为城之血’。我能感觉到它的存在，但太深了，读不全。”",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        failure: {
          text: "米蕾娜的魔力一触到铁柜就被弹开，她踉跄后退，脸色发白：“……这封印的层次很高，比我见过的任何东西都高。不是人类的手笔。”",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
      },
      {
        id: "church_001_c",
        text: "翻阅柜旁那堆散落的档案。",
        check: { stat: "knowledge", modifier: 0 },
        success: {
          text: "你在散落的档案里翻出一份几十年前的‘圣堂内部纪要’，措辞隐晦，大意是：圣堂早已知道地下能源的真相，但为了不让信徒恐慌，选择用‘神罚’叙事掩盖了几十年。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        partial: {
          text: "你只翻到一些祈祷词的草稿，但其中夹着半页纸，写着一个词被反复划掉重写：“能源……龙……禁忌。”",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
        failure: {
          text: "大部分档案都是无用的布道词。你翻得满手是灰，却没找到关键的那一页。",
          effects: [
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "setLocation", id: "church" },
          ],
          nextScene: "church_002",
        },
      },
    ],
  },
  {
    id: "church_002",
    title: "圣堂 · 魔女与封印",
    text: [
      "你们退到圣堂后的一处无人的回廊。米蕾娜一直低着头，指尖还在微微发抖。",
      "“我一直以为，我的力量是某种诅咒，是教会说的‘魔女之血’。”她抬起眼，声音很轻，“可刚才碰到那封印的时候……我的身体，它在回应。就像那颗被封印的东西，认识我。”",
      "她看着你，眼里有恐惧，也有一种近乎渴求的期待。",
    ],
    location: "church",
    choices: [
      {
        id: "church_002_a",
        text: "握住她的手，告诉她不管她是谁，你都不会丢下她。",
        outcome: {
          text: "米蕾娜微微一震，眼里的恐惧化开了一些。她极轻地回握了一下：“……谢谢你。从没有人，在知道我的来历之后，还愿意说这种话。”",
          effects: [
            { type: "trust", id: "milena", amount: 8 },
            { type: "intimacy", id: "milena", amount: 3 },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_002_b",
        text: "问她，如果她的力量真的与地下那东西相连，她打算怎么办。",
        outcome: {
          text: "米蕾娜沉默片刻：“……如果真是那样，那我大概是解开它真相的钥匙。我不怕去找答案，我只怕——答案让我变成怪物。”",
          effects: [
            { type: "trust", id: "milena", amount: 5 },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_002_c",
        text: "提醒她，现在不是纠结自己来历的时候，先查清龙的事。",
        outcome: {
          text: "米蕾娜微微一僵，随即垂下眼帘：“……你说得对。”她没有再说下去，但那股好不容易凝聚起来的一点信任，似乎又散了些。",
          effects: [
            { type: "trust", id: "milena", amount: -3 },
            { type: "setFlag", key: "church_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
