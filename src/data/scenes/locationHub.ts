import type { Scene } from "../../types/game";

export const locationHubScenes: Scene[] = [
  {
    id: "location_hub",
    title: "选择去向",
    text: [
      "你有片刻的自由行动时间。阿斯特拉的街道在龙影下蛰伏，你需要在有限的时间里决定下一步去哪调查。",
    ],
    location: "hub",
    choices: [
      {
        id: "hub_blackstreet",
        text: "去黑街调查。",
        conditions: [
          { type: "flag", key: "blackstreet_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_001",
        },
      },
      {
        id: "hub_royal",
        text: "去王城区调查。",
        conditions: [
          { type: "flag", key: "royal_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "royal" }],
          nextScene: "royal_001",
        },
      },
      {
        id: "hub_church",
        text: "去圣堂调查。",
        conditions: [
          { type: "flag", key: "church_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "church" }],
          nextScene: "church_001",
        },
      },
      {
        id: "hub_tavern",
        text: "回灰鸦酒馆休整。",
        outcome: {
          effects: [{ type: "setLocation", id: "tavern" }],
          nextScene: "tavern_001",
        },
      },
      {
        id: "hub_underground",
        text: "前往地下魔力核心。",
        conditions: [
          { type: "flag", key: "underground_hint", value: true },
          { type: "flag", key: "underground_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "underground" }],
          nextScene: "underground_001",
        },
      },
      {
        id: "hub_camp",
        text: "今晚在营地休整。",
        conditions: [{ type: "period", at: "d1_night" }],
        outcome: {
          nextScene: "camp_night",
        },
      },
      {
        id: "hub_camp_d2",
        text: "今晚在营地休整。",
        conditions: [{ type: "period", at: "d2_night" }],
        outcome: {
          nextScene: "camp_night",
        },
      },
      {
        id: "hub_finale",
        text: "龙即将抵达——前往城头，迎接最后一刻。",
        conditions: [{ type: "flag", key: "finale_unlocked", value: true }],
        outcome: {
          effects: [{ type: "setLocation", id: "finale" }],
          nextScene: "finale_001",
        },
      },
    ],
  },
];
