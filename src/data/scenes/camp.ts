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
      // ===== 双人组合短事件（V0.3 Phase 7）=====
      {
        id: "camp_night_pair_serena_lia",
        text: "🛡️🐈 塞蕾娜和莉娅又吵起来了——这次是关于明晚的退路。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "companionInParty", id: "lia" },
          { type: "flag", key: "pair_serena_lia_done", value: false },
        ],
        outcome: { nextScene: "pair_serena_lia_001" },
      },
      {
        id: "camp_night_pair_serena_milena",
        text: "🛡️🕯️ 塞蕾娜和米蕾娜在讨论力量与代价。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "companionInParty", id: "milena" },
          { type: "flag", key: "pair_serena_milena_done", value: false },
        ],
        outcome: { nextScene: "pair_serena_milena_001" },
      },
      {
        id: "camp_night_pair_lia_milena",
        text: "🐈🕯️ 莉娅正拉着米蕾娜比试“看人的本事”。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "companionInParty", id: "milena" },
          { type: "flag", key: "pair_lia_milena_done", value: false },
        ],
        outcome: { nextScene: "pair_lia_milena_001" },
      },
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
        id: "camp_night_serena_rel2",
        text: "与塞蕾娜深谈——她看起来心事重重。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "personalQuestDone", id: "serena" },
          { type: "flag", key: "serena_rel2_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "serena_rel2_001" },
      },
      {
        id: "camp_night_serena_contract",
        text: "与塞蕾娜讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "contractReady", id: "serena" },
          { type: "flag", key: "serena_contracted_event", value: false },
        ],
        outcome: { nextScene: "serena_contract_001" },
      },
      {
        id: "camp_night_serena_bond",
        text: "❤️ 与塞蕾娜并肩站在城墙上——最后一夜。",
        conditions: [
          { type: "companionInParty", id: "serena" },
          { type: "contracted", id: "serena" },
          { type: "intimacy", id: "serena", min: 8 },
          { type: "flag", key: "serena_bond_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "serena_bond_001" },
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
        id: "camp_night_lia_rel2",
        text: "与莉娅深谈——她看起来心事重重。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "personalQuestDone", id: "lia" },
          { type: "flag", key: "lia_rel2_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "lia_rel2_001" },
      },
      {
        id: "camp_night_lia_contract",
        text: "与莉娅讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "contractReady", id: "lia" },
          { type: "flag", key: "lia_contracted_event", value: false },
        ],
        outcome: { nextScene: "lia_contract_001" },
      },
      {
        id: "camp_night_lia_bond",
        text: "❤️ 与莉娅在营地对坐——她今晚有些不对劲。",
        conditions: [
          { type: "companionInParty", id: "lia" },
          { type: "contracted", id: "lia" },
          { type: "intimacy", id: "lia", min: 8 },
          { type: "flag", key: "lia_bond_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "lia_bond_001" },
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
        id: "camp_night_milena_rel2",
        text: "与米蕾娜深谈——她看起来心事重重。",
        conditions: [
          { type: "companionInParty", id: "milena" },
          { type: "personalQuestDone", id: "milena" },
          { type: "flag", key: "milena_rel2_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "milena_rel2_001" },
      },
      {
        id: "camp_night_milena_contract",
        text: "与米蕾娜讨论契约之事。",
        conditions: [
          { type: "companionInParty", id: "milena" },
          { type: "contractReady", id: "milena" },
          { type: "flag", key: "milena_contracted_event", value: false },
        ],
        outcome: { nextScene: "milena_contract_001" },
      },
      {
        id: "camp_night_milena_bond",
        text: "❤️ 与米蕾娜坐在火堆旁——她眼里藏着心事。",
        conditions: [
          { type: "companionInParty", id: "milena" },
          { type: "contracted", id: "milena" },
          { type: "intimacy", id: "milena", min: 8 },
          { type: "flag", key: "milena_bond_done", value: false },
          { type: "period", at: "d2_night" },
        ],
        outcome: { nextScene: "milena_bond_001" },
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
