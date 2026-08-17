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
      // ===== DAY 1：主调查 =====
      {
        id: "hub_blackstreet_d1",
        text: "去黑街调查。",
        conditions: [
          { type: "periodIn", in: ["d1_morning", "d1_afternoon", "d1_dusk"] },
          { type: "flag", key: "blackstreet_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_001",
        },
      },
      {
        id: "hub_royal_d1",
        text: "去王城区调查。",
        conditions: [
          { type: "periodIn", in: ["d1_morning", "d1_afternoon", "d1_dusk"] },
          { type: "flag", key: "royal_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "royal" }],
          nextScene: "royal_001",
        },
      },
      {
        id: "hub_church_d1",
        text: "去圣堂调查。",
        conditions: [
          { type: "periodIn", in: ["d1_morning", "d1_afternoon", "d1_dusk"] },
          { type: "flag", key: "church_main_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "church" }],
          nextScene: "church_001",
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
      // ===== DAY 2：局势变化 =====
      {
        id: "hub_blackstreet_d2",
        text: "去黑街——听说那里出了乱子。",
        conditions: [
          { type: "periodIn", in: ["d2_morning", "d2_afternoon", "d2_dusk"] },
          { type: "flag", key: "blackstreet_d2_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_d2_001",
        },
      },
      {
        id: "hub_royal_d2",
        text: "去王城区——骑士团有大动作。",
        conditions: [
          { type: "periodIn", in: ["d2_morning", "d2_afternoon", "d2_dusk"] },
          { type: "flag", key: "royal_d2_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "royal" }],
          nextScene: "royal_d2_001",
        },
      },
      {
        id: "hub_church_d2",
        text: "去圣堂——教会在发新告示。",
        conditions: [
          { type: "periodIn", in: ["d2_morning", "d2_afternoon", "d2_dusk"] },
          { type: "flag", key: "church_d2_done", value: false },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "church" }],
          nextScene: "church_d2_001",
        },
      },
      // ===== 酒馆（finale 时段不可再刷） =====
      {
        id: "hub_tavern",
        text: "回灰鸦酒馆休整。",
        conditions: [
          { type: "periodIn", in: ["d1_morning", "d1_afternoon", "d1_dusk", "d1_night", "d2_morning", "d2_afternoon", "d2_dusk", "d2_night"] },
        ],
        outcome: {
          effects: [{ type: "setLocation", id: "tavern" }],
          nextScene: "tavern_001",
        },
      },
      // ===== 夜晚营地 =====
      {
        id: "hub_camp_d1",
        text: "夜色已深——今晚在营地休整。",
        conditions: [{ type: "period", at: "d1_night" }],
        outcome: {
          nextScene: "camp_night",
        },
      },
      {
        id: "hub_camp_d2",
        text: "夜色已深——今晚在营地休整。",
        conditions: [{ type: "period", at: "d2_night" }],
        outcome: {
          nextScene: "camp_night",
        },
      },
      // ===== Finale：仅时间到达后出现 =====
      {
        id: "hub_finale",
        text: "龙临时刻已至——前往城头，迎接最后一刻。",
        conditions: [{ type: "period", at: "finale" }],
        outcome: {
          effects: [{ type: "setLocation", id: "finale" }],
          nextScene: "finale_001",
        },
      },
    ],
  },
];
