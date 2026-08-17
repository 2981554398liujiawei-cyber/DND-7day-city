import type { Scene } from "../../types/game";

export const campScenes: Scene[] = [
  {
    id: "camp_night",
    title: "夜晚 · 营地",
    text: [
      "夜幕笼罩阿斯特拉。你们在灰鸦酒馆二楼的客房安顿下来。窗外，城市灯火未熄，却比往常多了几分不安的安静。",
      "这是难得的独处时间。你可以与某位伙伴彻夜长谈，或调整队伍为明天的行动做准备。",
    ],
    location: "tavern",
    choices: [
      {
        id: "camp_night_serena",
        text: "与塞蕾娜聊聊。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "personalQuestDone", id: "serena", value: false },
        ],
        outcome: { nextScene: "serena_personal_001" },
      },
      {
        id: "camp_night_serena_contract",
        text: "与塞蕾娜讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "personalQuestDone", id: "serena" },
          { type: "trust", id: "serena", min: 60 },
          { type: "flag", key: "serena_contracted_event", value: false },
        ],
        outcome: { nextScene: "serena_contract_001" },
      },
      {
        id: "camp_night_lia",
        text: "与莉娅聊聊。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "personalQuestDone", id: "lia", value: false },
        ],
        outcome: { nextScene: "lia_personal_001" },
      },
      {
        id: "camp_night_lia_contract",
        text: "与莉娅讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "personalQuestDone", id: "lia" },
          { type: "trust", id: "lia", min: 60 },
          { type: "flag", key: "lia_contracted_event", value: false },
        ],
        outcome: { nextScene: "lia_contract_001" },
      },
      {
        id: "camp_night_milena",
        text: "与米蕾娜聊聊。",
        conditions: [
          { type: "companionInParty", id: "milena" },
          { type: "personalQuestDone", id: "milena", value: false },
        ],
        outcome: { nextScene: "milena_personal_001" },
      },
      {
        id: "camp_night_milena_contract",
        text: "与米蕾娜讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "milena" },
          { type: "personalQuestDone", id: "milena" },
          { type: "trust", id: "milena", min: 60 },
          { type: "flag", key: "milena_contracted_event", value: false },
        ],
        outcome: { nextScene: "milena_contract_001" },
      },
      {
        id: "camp_night_party",
        text: "调整队伍。",
        outcome: { nextScene: "camp_select_party" },
      },
      {
        id: "camp_night_rest",
        text: "早点休息，养足精神。",
        outcome: {
          text: "你沉沉睡去。这一夜，有人梦见城市的灯火，有人梦见地下那颗跳动的龙卵。",
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },

  {
    id: "camp_select_party",
    title: "调整队伍",
    text: [
      "你可以在这里安排同行伙伴。最多同时携带两名伙伴。",
    ],
    location: "tavern",
    choices: [
      {
        id: "camp_join_serena",
        text: "【塞蕾娜】让她加入队伍。",
        conditions: [
          { type: "flag", key: "recruited_serena_flag", value: true },
          { type: "companionInParty", id: "serena", value: false },
          { type: "partyNotFull" },
        ],
        outcome: {
          effects: [{ type: "joinParty", id: "serena" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_leave_serena",
        text: "【塞蕾娜】让她暂时离队。",
        conditions: [{ type: "companionInParty", id: "serena" }],
        outcome: {
          effects: [{ type: "leaveParty", id: "serena" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_join_lia",
        text: "【莉娅】让她加入队伍。",
        conditions: [
          { type: "flag", key: "recruited_lia_flag", value: true },
          { type: "companionInParty", id: "lia", value: false },
          { type: "partyNotFull" },
        ],
        outcome: {
          effects: [{ type: "joinParty", id: "lia" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_leave_lia",
        text: "【莉娅】让她暂时离队。",
        conditions: [{ type: "companionInParty", id: "lia" }],
        outcome: {
          effects: [{ type: "leaveParty", id: "lia" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_join_milena",
        text: "【米蕾娜】让她加入队伍。",
        conditions: [
          { type: "flag", key: "recruited_milena_flag", value: true },
          { type: "companionInParty", id: "milena", value: false },
          { type: "partyNotFull" },
        ],
        outcome: {
          effects: [{ type: "joinParty", id: "milena" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_leave_milena",
        text: "【米蕾娜】让她暂时离队。",
        conditions: [{ type: "companionInParty", id: "milena" }],
        outcome: {
          effects: [{ type: "leaveParty", id: "milena" }],
          nextScene: "camp_select_party",
        },
      },
      {
        id: "camp_select_party_done",
        text: "队伍安排好了。",
        outcome: {
          nextScene: "camp_night",
        },
      },
    ],
  },
];
