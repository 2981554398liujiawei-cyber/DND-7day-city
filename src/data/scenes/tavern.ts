import type { Scene } from "../../types/game";

export const tavernScenes: Scene[] = [
  {
    id: "tavern_001",
    title: "灰鸦酒馆",
    text: [
      "你回到灰鸦酒馆。柜台后的酒保终于放下了那只擦了一整天的杯子，抬眼瞥你：“听说你打算管这趟龙灾的闲事？外乡人，城里的人可都在打包跑路，就你往火里钻。”",
      "他倒了一杯酒推给你：“聊聊？或者，去安排一下你的队伍。”",
    ],
    location: "tavern",
    choices: [
      {
        id: "tavern_001_a",
        text: "打听城里现在的风声。",
        outcome: {
          text: "酒保压低声音：“王室在封锁街道，说是在‘备战’；圣堂在四处发神罚告示；法师学院——那帮穿袍子的，这两天一个都没露面，大门紧闭。要我说，越安静的地方，水越深。”",
          effects: [
            { type: "setFlag", key: "tavern_heard_rumors", value: true },
          ],
          nextScene: "tavern_002",
        },
      },
      {
        id: "tavern_001_b",
        text: "看看同行伙伴，决定是否调整队伍。",
        outcome: {
          text: "你在酒馆角落坐下，打量着随行的伙伴。你可以在这里安排谁与你同行——最多两人。",
          effects: [{ type: "setScene", id: "camp_select_party" }],
        },
      },
      {
        id: "tavern_001_c",
        text: "点一桌好菜，和同行伙伴闲聊几句。",
        outcome: {
          text: "几杯下肚，气氛松弛了些。你的伙伴们难得放下戒备，聊起各自无关紧要的琐事——这一刻，城市即将到来的灾难仿佛暂时退到了窗外。",
          nextScene: "tavern_002",
        },
      },
      {
        id: "tavern_001_d",
        text: "花 10 金币，请酒保透露一些只有熟客才知道的消息。",
        conditions: [{ type: "gold", min: 10 }],
        outcome: {
          text: "酒保收下金币，压低声音：“看你是个有心人。听好了——王宫地下的能源，不是挖出来的矿。几十年前，有一样东西被运进城，从此全城的灯都亮了。至于是什么……”他指了指脚下，“下去问问就知道了。”",
          effects: [
            { type: "gold", amount: -10 },
            { type: "setFlag", key: "underground_hint", value: true },
            { type: "setFlag", key: "tavern_heard_rumors", value: true },
          ],
          nextScene: "tavern_002",
        },
      },
    ],
  },
  {
    id: "tavern_002",
    title: "酒馆 · 暂歇",
    text: [
      "酒馆的油灯晃了晃。你短暂地休整，把黑街、王城、圣堂带回来的线索在脑子里连成一条线。真相正在浮出水面，只差最后一块拼图。",
    ],
    location: "tavern",
    choices: [
      {
        id: "tavern_002_a",
        text: "结束休整，继续行动。",
        outcome: {
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "tavern_002_b",
        text: "在这里休息到夜晚，再作打算。",
        outcome: {
          text: "你干脆在酒馆住下，养足精神。窗外，阿斯特拉的灯火依然不灭——只是你不知道，这份光明还能维持多久。",
          effects: [
            { type: "advanceTime" },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
