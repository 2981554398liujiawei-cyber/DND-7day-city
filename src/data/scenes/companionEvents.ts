import type { Scene } from "../../types/game";

export const companionEventsScenes: Scene[] = [
  // ============ 塞蕾娜 个人事件 ============
  {
    id: "serena_personal_001",
    title: "塞蕾娜 · 银甲之下",
    text: [
      "夜色里，塞蕾娜独自站在酒馆屋顶，望着王宫方向。风卷起她的披风。",
      "你走过去，她没回头，只低声说：“我小时候一直以为，穿上这身甲，就能分清对错。后来才发现，命令常常和良心背道而驰。”",
      "她顿了顿：“……有一年，骑士团下令烧掉一座敌国村庄，说里面藏着探子。我违抗了命令，放走了那几百个平民。”她终于看向你，“这件事，我从没告诉过任何人。”",
    ],
    location: "tavern",
    choices: [
      {
        id: "serena_personal_001_a",
        text: "告诉她：违抗错误的命令，正是骑士的荣耀。",
        outcome: {
          text: "塞蕾娜肩膀微微放松，低声道：“……这世上能懂这句话的人不多。谢谢你。”她第一次露出毫无防备的疲惫与释然。",
          effects: [
            { type: "addSecret", key: "serena_disobeyed_order" },
            { type: "trust", id: "serena", amount: 10 },
            { type: "intimacy", id: "serena", amount: 4 },
            { type: "setFlag", key: "serena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_personal_001_b",
        text: "问她，如果明天龙来时命令她杀龙，她会怎么做。",
        outcome: {
          text: "塞蕾娜沉默良久：“……如果龙真是来毁城的，我会挥剑。但如果它只是为了取回自己的孩子，”她握紧剑柄，“我要亲眼确认之后，才决定剑锋朝哪。”",
          effects: [
            { type: "addSecret", key: "serena_disobeyed_order" },
            { type: "trust", id: "serena", amount: 6 },
            { type: "setFlag", key: "serena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_personal_001_c",
        text: "直白告诉她：为几百人违抗军令，值得吗？",
        outcome: {
          text: "塞蕾娜的眼神倏地冷下来：“那几百条命，不是可以折算的数目。我以为你也明白这个道理。”她转身离去，今夜没有再谈下去的兴致。",
          effects: [
            { type: "addSecret", key: "serena_disobeyed_order" },
            { type: "trust", id: "serena", amount: -6 },
            { type: "setFlag", key: "serena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  // ============ 莉娅 个人事件 ============
  {
    id: "lia_personal_001",
    title: "莉娅 · 黑猫的过去",
    text: [
      "深夜，你在黑街一间废弃的账房找到莉娅。她没有点灯，指尖在桌上一枚生锈的铁牌上来回摩挲。",
      "“你猜到了吧。”她没回头，声音罕见地没有玩笑，“帝国情报机构，曾经是我的东家。他们教我撬锁、下毒、套话，然后像用完的工具一样，把我扔了。”",
      "她终于转过身，神情复杂：“我逃出来，只想这辈子再不受任何人的控制。你说——我该信你吗？”",
    ],
    location: "blackstreet",
    choices: [
      {
        id: "lia_personal_001_a",
        text: "告诉她：我从不强求她留，她的去留由她自己决定。",
        outcome: {
          text: "莉娅盯着你看了很久，最后嗤笑一声：“……算你识相。”她收起铁牌，“我这种人，最怕的就是被人当救命稻草死死攥着。你肯放手，我反而愿意多留两天。”",
          effects: [
            { type: "trust", id: "lia", amount: 10 },
            { type: "intimacy", id: "lia", amount: 3 },
            { type: "setFlag", key: "lia_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_personal_001_b",
        text: "请她利用旧关系，去挖法师学院实验的真相。",
        outcome: {
          text: "莉娅脸色微变：“你还真想让我重操旧业？”但她犹豫片刻，还是点头，“……行，就当还你一个交代。那帮穿袍子的，我确实还有旧账要算。”",
          effects: [
            { type: "trust", id: "lia", amount: 6 },
            { type: "addSecret", key: "mages_experimented_on_egg" },
            { type: "setFlag", key: "lia_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_personal_001_c",
        text: "质疑她：这种背主之人，凭什么相信她不会再次背叛？",
        outcome: {
          text: "莉娅的眼神彻底冷下来。她站起身，语气冰得像刀：“说得好。那你也别信我。”她转身走出账房，“天亮前，我会离开这座城市。”",
          effects: [
            { type: "trust", id: "lia", amount: -10 },
            { type: "setFlag", key: "lia_personal_done", value: true },
            { type: "setFlag", key: "lia_left", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  // ============ 米蕾娜 个人事件 ============
  {
    id: "milena_personal_001",
    title: "米蕾娜 · 烛火的重量",
    text: [
      "圣堂后院的废墟里，米蕾娜坐在断墙边，双手环抱膝盖，像一只受伤的鸟。她身上残留着淡淡的、属于地下的蓝光。",
      "“我一直以为我的魔力是诅咒。”她轻声说，“现在我知道，它是龙卵分给我的。可越是明白，我越怕。我怕我根本承受不住它的分量，最后……变成它的一部分。”",
      "她抬头看你，眼里是近乎祈求的光：“如果有一天我控制不住了，你……会亲手阻止我吗？”",
    ],
    location: "church",
    choices: [
      {
        id: "milena_personal_001_a",
        text: "告诉她：我不会让她变成怪物，也不会丢下她。",
        outcome: {
          text: "米蕾娜怔怔望着你，眼眶微红，随即露出一个温柔而脆弱的笑：“……谢谢你愿意接住这样的我。”她轻轻靠了过来，仿佛想借一点温度。",
          effects: [
            { type: "trust", id: "milena", amount: 10 },
            { type: "intimacy", id: "milena", amount: 4 },
            { type: "setFlag", key: "milena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_personal_001_b",
        text: "和她一起研究龙卵与她的联系，想办法解开谜团。",
        outcome: {
          text: "米蕾娜眼睛亮了：“……你愿意和我一起弄清真相？”她认真点头，“好。如果这是钥匙，那我们两个一起来配这把锁。”",
          effects: [
            { type: "trust", id: "milena", amount: 8 },
            { type: "addSecret", key: "milena_connected_to_egg" },
            { type: "setFlag", key: "milena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_personal_001_c",
        text: "实话实说：如果她失去控制，你确实会阻止她。",
        outcome: {
          text: "米蕾娜沉默了很久，最后轻轻点头：“……好。谢谢你愿意对我说实话。比哄我开心，更让我安心。”",
          effects: [
            { type: "trust", id: "milena", amount: 4 },
            { type: "setFlag", key: "milena_personal_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  // ============ 契约事件 ============
  {
    id: "serena_contract_001",
    title: "塞蕾娜 · 守护的誓约",
    text: [
      "龙临之前，你找到塞蕾娜，郑重提出与她订立灵魂契约。",
      "塞蕾娜看了你很久，然后把手按上剑柄，却解下了一枚旧的骑士徽章，放进你掌心：“我宣誓过许多次，都献给‘骑士’这个名号。这一次，我想把誓言，交给一个具体的人。”",
      "你握住徽章。契约成立——你们从此共享安危，她愿为你挡下致命一击。",
    ],
    location: "tavern",
    conditions: [
      { type: "flag", key: "serena_personal_done", value: true },
      { type: "trust", id: "serena", min: 60 },
    ],
    choices: [
      {
        id: "serena_contract_001_a",
        text: "郑重接过徽章，立下守护的誓约。",
        outcome: {
          text: "两道灵魂的契约之光交织。从此，她的守护不止是责任，更是刻入灵魂的承诺。",
          effects: [
            { type: "contract", id: "serena" },
            { type: "setFlag", key: "serena_contracted_event", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },
  {
    id: "lia_contract_001",
    title: "莉娅 · 自由的契约",
    text: [
      "你向莉娅提出契约——不是主从，而是平等互惠的约定。",
      "莉娅眯起眼：“你可想清楚了。我可不会替谁卖命，我们的契约，得是互相都不吃亏那种。”",
      "她笑着伸出手，指尖悬着一枚黑猫的银币：“成交。要是你敢拿这契约拴住我，我第一个翻脸。”",
    ],
    location: "blackstreet",
    conditions: [
      { type: "flag", key: "lia_personal_done", value: true },
      { type: "trust", id: "lia", min: 60 },
    ],
    choices: [
      {
        id: "lia_contract_001_a",
        text: "立下平等互惠的契约。",
        outcome: {
          text: "契约在你们之间成立——不是束缚，而是彼此都不背叛的默契。莉娅抛着银币笑了：“这才对味。”",
          effects: [
            { type: "contract", id: "lia" },
            { type: "setFlag", key: "lia_contracted_event", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },
  {
    id: "milena_contract_001",
    title: "米蕾娜 · 灵魂的契约",
    text: [
      "你向米蕾娜提出契约。她微微一怔，眼底涌上复杂的情绪。",
      "“……契约会让我和你的灵魂相连。”她低声说，“如果我真变成怪物，我的黑暗也会染到你身上。你，真的想清楚了吗？”",
    ],
    location: "church",
    conditions: [
      { type: "flag", key: "milena_personal_done", value: true },
      { type: "trust", id: "milena", min: 60 },
    ],
    choices: [
      {
        id: "milena_contract_001_a",
        text: "告诉她：正因为她的黑暗，你才更要和她分担。",
        outcome: {
          text: "米蕾娜的眼泪终于落下来。她握住你的手，指尖泛起的蓝光缓缓缠上你的手腕：“……好。无论我变成什么，你都别松手。这是约定。”",
          effects: [
            { type: "contract", id: "milena" },
            { type: "setFlag", key: "milena_contracted_event", value: true },
            { type: "corruption", amount: 5 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_contract_001_b",
        text: "犹豫之后，还是放弃契约。",
        outcome: {
          text: "米蕾娜善解人意地松开手，笑容里没有责怪：“……没关系。你能考虑我的感受，我已经很感激了。”",
          effects: [{ type: "trust", id: "milena", amount: 3 }],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  {
    id: "companion_event_end",
    title: "夜谈已毕",
    text: ["长夜未尽。这一夜的谈话，让你们的距离更近了一些，也让彼此的抉择更清晰了一些。"],
    location: "tavern",
    choices: [
      {
        id: "companion_event_end_a",
        text: "回到营地休息。",
        outcome: {
          effects: [
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
