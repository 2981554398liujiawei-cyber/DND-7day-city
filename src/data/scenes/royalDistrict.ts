import type { Scene } from "../../types/game";

export const royalDistrictScenes: Scene[] = [
  {
    id: "royal_001",
    title: "王城区 · 封锁的街道",
    text: [
      "王城区的街道被全副武装的骑士封锁。平民被挡在拒马后，只能隔着铁栅眺望王宫尖顶上忙碌的人影——那里正有东西被不断地搬进搬出。",
      "塞蕾娜在熟悉的同僚间走动片刻，回来时脸色凝重：“骑士团接到密令，正在调动所有重弩和屠龙械。他们说这是‘备战’，可我知道，这道密令不是防守用的——是进攻用的。”",
    ],
    location: "royal",
    choices: [
      {
        id: "royal_001_a",
        text: "让塞蕾娜试着打听那道密令的原文。",
        check: { stat: "finesse", modifier: 0, companion: "serena", tags: ["social"] },
        success: {
          text: "塞蕾娜借着老交情，从书记官手里瞥见了密令的一角：“……由『翼』统领屠龙阵，龙落即杀，不留活口。帝国不容一头龙威胁秩序。”她合上眼，“他们连谈都不打算谈。”",
          effects: [
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        partial: {
          text: "塞蕾娜只带回来半句：“……‘龙落即杀，不容谈判’。”她说，骑士团的人也不都愿意，但军令如山。",
          effects: [
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        failure: {
          text: "塞蕾娜回来时眉头紧锁：“书记官口风很紧。但我在他们倒的废纸篓里捡到一张烧了一半的名单，上面有代号『翼』。”",
          effects: [
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
      },
      {
        id: "royal_001_b",
        text: "混入封锁线，接近王宫墙根。",
        check: { stat: "agility", modifier: 0, companion: "lia", tags: ["stealth"] },
        success: {
          text: "你趁换岗的间隙溜到墙根，听见墙内一名军官压着嗓子说：“法师那套‘能源’快撑不住了，龙一落地就断。王上说了，杀了龙，一了百了。”",
          effects: [
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        partial: {
          text: "你摸近墙根，只听见零星的“能源”“杀龙”。但足够证实：王宫的秩序建立在某样脆弱的东西之上。",
          effects: [
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        failure: {
          text: "你刚摸到墙根，一队巡逻骑士就堵住了去路。塞蕾娜及时亮出徽章替你解围，但这次调查无功而返。",
          effects: [
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
      },
      {
        id: "royal_001_c",
        text: "观察塞蕾娜面对这份军令时的神情。",
        check: { stat: "insight", modifier: 0, tags: ["social"] },
        success: {
          text: "塞蕾娜盯着那半张名单，指节微微发白。她低声说：“我宣誓保护民众，不是挥刀向一个……连它要什么都不知道的生命。”你看见她眼里第一次有了动摇。",
          effects: [
            { type: "trust", id: "serena", amount: 8 },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        partial: {
          text: "塞蕾娜没有接话，只是把名单折好收进怀里。但她握剑的手，比来时更用力了。",
          effects: [
            { type: "trust", id: "serena", amount: 4 },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
        failure: {
          text: "塞蕾娜面无表情地收好名单：“走吧，别让人起疑。”你看不出她心里在想什么。",
          effects: [
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "setLocation", id: "royal" },
          ],
          nextScene: "royal_002",
        },
      },
    ],
  },
  {
    id: "royal_002",
    title: "王城区 · 骑士的抉择",
    text: [
      "你们退到封锁线外的一处街角。塞蕾娜沉默了很久。",
      "“如果军令真的是‘见龙即杀’，”她终于开口，“那我和骑士团之间，早晚要做个了断。我不是怕违抗命令——我是怕，违抗了命令之后，我还能不能继续自称‘骑士’。”",
      "她看着你，等你给出一个答案。",
    ],
    location: "royal",
    choices: [
      {
        id: "royal_002_a",
        text: "告诉她，真正的骑士忠于荣誉，而非命令。",
        outcome: {
          text: "塞蕾娜怔了怔，随即露出一抹许久未见的、近乎释然的笑：“……谢谢你。这句话，我等了很多年。”",
          effects: [
            { type: "trust", id: "serena", amount: 8 },
            { type: "intimacy", id: "serena", amount: 2 },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "royal_002_b",
        text: "不替她决定——命令还是要遵守，但你会在边上看着她。",
        outcome: {
          text: "塞蕾娜沉默片刻，点点头：“……你说得对，责任不是用来逃避的。我会站在该站的地方，但你最好也一直在我看得见的地方。”",
          effects: [
            { type: "trust", id: "serena", amount: 4 },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "royal_002_c",
        text: "直说：现在纠结骑士荣誉太奢侈，先查清龙为什么来。",
        outcome: {
          text: "塞蕾娜眉头微蹙，但最后还是点头：“……我承认，真相比名声重要。走吧，先把‘为什么’查清楚。”",
          effects: [
            { type: "trust", id: "serena", amount: -2 },
            { type: "intimacy", id: "serena", amount: -2 },
            { type: "setFlag", key: "royal_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
