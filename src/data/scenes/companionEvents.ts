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
            { type: "setPersonalQuestComplete", id: "serena", value: true },
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
            { type: "setPersonalQuestComplete", id: "serena", value: true },
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
            { type: "setPersonalQuestComplete", id: "serena", value: true },
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
            { type: "setPersonalQuestComplete", id: "lia", value: true },
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
            { type: "setPersonalQuestComplete", id: "lia", value: true },
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
            { type: "setPersonalQuestComplete", id: "lia", value: true },
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
            { type: "setPersonalQuestComplete", id: "milena", value: true },
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
            { type: "setPersonalQuestComplete", id: "milena", value: true },
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
            { type: "setPersonalQuestComplete", id: "milena", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  // ============ 第二关系事件（"她决定成为什么人？"） ============
  {
    id: "serena_rel2_001",
    title: "塞蕾娜 · 剑锋所向",
    text: [
      "第二天入夜，塞蕾娜独自站在城墙下，望着广场上那架崭新的屠龙械。骑士团刚刚送来一纸调令——明日龙临，她必须加入屠龙队，听命于王。",
      "她攥着调令，指节发白：“他们要我杀龙。可我知道——龙只是来讨回它的孩子。我该听谁的？命令……还是我自己看到的真相？”她看向你，“换作你，你会怎么选？”",
    ],
    location: "royal",
    conditions: [
      { type: "personalQuestDone", id: "serena" },
      { type: "companionInParty", id: "serena" },
    ],
    choices: [
      {
        id: "serena_rel2_001_a",
        text: "告诉她：忠于你的本心，而不是命令。",
        outcome: {
          text: "塞蕾娜的眉头缓缓松开，仿佛卸下千斤重担：“……谢谢你。骑士团的剑该为谁而挥，我这一生都在寻找答案。今天，我找到了。”她把调令撕成两半，“明日，我不会站在屠龙队里。”",
          effects: [
            { type: "trust", id: "serena", amount: 12 },
            { type: "intimacy", id: "serena", amount: 5 },
            { type: "setFlag", key: "serena_rel2_done", value: true },
            { type: "setFlag", key: "serena_chooses_own_path", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_rel2_001_b",
        text: "告诉她：骑士的荣耀就是服从命令，先保全自己。",
        outcome: {
          text: "塞蕾娜低下头，很久没有说话。“……或许你说得对。荣耀、命令、王国——这些才是骑士该信的东西。”她收好调令，声音平静得发冷，“我会听命。”但你知道，有些东西在她心里熄灭了。",
          effects: [
            { type: "trust", id: "serena", amount: 6 },
            { type: "setFlag", key: "serena_rel2_done", value: true },
            { type: "setFlag", key: "serena_follows_order", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_rel2_001_c",
        text: "告诉她：明日见机行事——明着听命，暗里自有打算。",
        outcome: {
          text: "塞蕾娜怔了怔，随即低笑一声：“……你这外乡人，比我想的狡猾。”她收好调令，“好。明面上听命，暗地里，你我见机行事。这把剑，先欠着骑士团的。”",
          effects: [
            { type: "trust", id: "serena", amount: 8 },
            { type: "intimacy", id: "serena", amount: 3 },
            { type: "setFlag", key: "serena_rel2_done", value: true },
            { type: "setFlag", key: "serena_waits_and_sees", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },
  {
    id: "lia_rel2_001",
    title: "莉娅 · 旧主的来信",
    text: [
      "夜里，一只信鸽落在酒馆窗台，腿上绑着一卷蜡封的信。莉娅拆开，脸色一点点冷下来。",
      "“帝国情报机构找到我了。”她把信纸揉成一团，“他们说，只要我交出你掌握的地下情报，就恢复我的身份，让我回到帝国，享受一生的庇护。”她看向你，“……你猜，我该怎么回？”",
    ],
    location: "blackstreet",
    conditions: [
      { type: "personalQuestDone", id: "lia" },
      { type: "companionInParty", id: "lia" },
    ],
    choices: [
      {
        id: "lia_rel2_001_a",
        text: "告诉她：你自己决定，我尊重你的选择。",
        outcome: {
          text: "莉娅盯着你看了很久，忽然笑了，笑里带着罕见的柔软：“……我这一辈子，都在被人当工具使。你是第一个说‘你自己决定’的人。”她把信扔进烛火，“回什么回。帝国那帮人，见鬼去吧。”",
          effects: [
            { type: "trust", id: "lia", amount: 12 },
            { type: "intimacy", id: "lia", amount: 5 },
            { type: "setFlag", key: "lia_rel2_done", value: true },
            { type: "setFlag", key: "lia_chooses_freedom", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_rel2_001_b",
        text: "要求她拒绝帝国，留下来和我们一起。",
        outcome: {
          text: "莉娅的笑意淡了：“……你在命令我？”她沉默片刻，把信折好放进怀里，“我欠你一个人情，但决定权在我。帝国那边，我会拖着。至于留下——”她顿了顿，“看心情。”",
          effects: [
            { type: "trust", id: "lia", amount: 6 },
            { type: "setFlag", key: "lia_rel2_done", value: true },
            { type: "setFlag", key: "lia_stays_but_resentful", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_rel2_001_c",
        text: "让她将计就计，假装答应帝国，反骗他们一份关键情报。",
        outcome: {
          text: "莉娅的眼睛亮起来：“……好主意。帝国那群蠢货，大概想不到我会反咬一口。”她连夜写了回信，假意投诚，换来一份帝国在城内的眼线名单，“这份名单，够我们明天用。”",
          effects: [
            { type: "trust", id: "lia", amount: 10 },
            { type: "intimacy", id: "lia", amount: 4 },
            { type: "addSecret", key: "lia_spy_history" },
            { type: "setFlag", key: "lia_rel2_done", value: true },
            { type: "setFlag", key: "lia_counter_espionage", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },
  {
    id: "milena_rel2_001",
    title: "米蕾娜 · 共鸣之潮",
    text: [
      "深夜，米蕾娜忽然浑身发颤，指尖泛起不受控制的幽蓝光芒。地下深处传来一阵强烈的共鸣，她痛苦地按住心口。",
      "“它……龙卵在呼唤我。”她艰难地说，“它想让我带它走，或者……和它融为一体。我不知道这力量会把我变成什么。”她抬头看你，眼里有恐惧，也有渴望，“你说，我该怎么办？”",
    ],
    location: "church",
    conditions: [
      { type: "personalQuestDone", id: "milena" },
      { type: "companionInParty", id: "milena" },
    ],
    choices: [
      {
        id: "milena_rel2_001_a",
        text: "让她压制这股力量，别让龙卵影响她的心智。",
        outcome: {
          text: "米蕾娜咬牙闭眼，用意志强行压住翻涌的魔力。蓝光渐渐熄灭，她大口喘着气，冷汗湿透衣衫：“……我压住了。谢谢你，至少现在，我还是我自己。”她虚弱地笑了笑，眼里却多了一分坚定。",
          effects: [
            { type: "trust", id: "milena", amount: 10 },
            { type: "intimacy", id: "milena", amount: 4 },
            { type: "setFlag", key: "milena_rel2_done", value: true },
            { type: "setFlag", key: "milena_suppresses_power", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_rel2_001_b",
        text: "让她试着理解这股力量，研究它与龙卵的关联。",
        outcome: {
          text: "米蕾娜静下心来，让魔力缓缓流淌过身体，与地下的共鸣对话。片刻后她睁开眼，瞳孔深处泛起一丝蓝光：“……我听见了。它在说，它是被偷走的孩子。它在等母亲。”她低声，“我需要弄清楚这件事。”",
          effects: [
            { type: "trust", id: "milena", amount: 8 },
            { type: "intimacy", id: "milena", amount: 5 },
            { type: "addSecret", key: "milena_connected_to_egg" },
            { type: "setFlag", key: "milena_rel2_done", value: true },
            { type: "setFlag", key: "milena_studies_power", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_rel2_001_c",
        text: "让她接受力量，但约定一条底线：任何时候，都不许伤害无辜。",
        outcome: {
          text: "米蕾娜的指尖泛起幽蓝的光，却没有失控。她握住你的手，郑重地说：“好。我接受这份力量——但以你为证，我发誓，绝不让它伤及无辜。这是我和龙卵的约定，也是和你的约定。”",
          effects: [
            { type: "trust", id: "milena", amount: 12 },
            { type: "intimacy", id: "milena", amount: 6 },
            { type: "setFlag", key: "milena_rel2_done", value: true },
            { type: "setFlag", key: "milena_accepts_with_boundary", value: true },
            { type: "corruption", amount: 5 },
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
      { type: "personalQuestDone", id: "serena" },
      { type: "flag", key: "serena_rel2_done", value: true },
      { type: "trust", id: "serena", min: 45 },
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
      { type: "personalQuestDone", id: "lia" },
      { type: "flag", key: "lia_rel2_done", value: true },
      { type: "trust", id: "lia", min: 45 },
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
      { type: "personalQuestDone", id: "milena" },
      { type: "flag", key: "milena_rel2_done", value: true },
      { type: "trust", id: "milena", min: 45 },
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

  // ============ 最终羁绊事件（V0.3：恋爱/战友选择） ============
  {
    id: "serena_bond_001",
    title: "塞蕾娜 · 城墙之夜",
    text: [
      "龙临前的最后一夜。塞蕾娜独自站在城墙上，夜风把她未束的头发吹得凌乱。你走过去，她没有回头，只是望着地平线，忽然开口：",
      "“……如果明天我们都活下来——你打算去哪？”",
    ],
    location: "royal",
    conditions: [
      { type: "contracted", id: "serena" },
      { type: "companionInParty", id: "serena" },
      { type: "intimacy", id: "serena", min: 8 },
    ],
    choices: [
      {
        id: "serena_bond_001_a",
        text: "❤️【恋爱】“如果你愿意，我想让未来里有你。”",
        outcome: {
          text: "塞蕾娜怔住了，半晌才转过身。月光下，她的眼眶有些发红，却倔强地不肯让眼泪落下：“……骑士不该有软肋。可你，不是我的软肋。你是我的选择。”她向前一步，轻轻环住你。夜风里，她把脸埋进你的肩头，声音闷闷的，“答应我，明天我们都活着。”",
          effects: [
            { type: "setFlag", key: "serena_bond_done", value: true },
            { type: "setFlag", key: "romance_serena", value: true },
            { type: "intimacy", id: "serena", amount: 10 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_bond_001_b",
        text: "🛡️【战友】“去哪里都行。下次，还一起冒险。”",
        outcome: {
          text: "塞蕾娜的嘴角扬起一抹笑意，带着释然：“……好。龙归故乡也好，城毁人亡也罢，只要你还愿意和我并肩，我就没什么好怕的。”她握紧剑柄，目光落在你身上，“一言为定。”",
          effects: [
            { type: "setFlag", key: "serena_bond_done", value: true },
            { type: "setFlag", key: "bond_serena_companion", value: true },
            { type: "intimacy", id: "serena", amount: 5 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "serena_bond_001_c",
        text: "保持距离——“先活过明天再说。”",
        outcome: {
          text: "塞蕾娜沉默片刻，轻轻点头：“……也对。有些话，留到明天之后再说，才算数。”她不再追问，只是与你并肩站着，安静地等待黎明。",
          effects: [
            { type: "setFlag", key: "serena_bond_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  {
    id: "lia_bond_001",
    title: "莉娅 · 黑猫不走了",
    text: [
      "龙临前的最后一夜，你回到营地，看见莉娅的行李已经打好，放在门边。她正望着那包袱出神。",
      "“天亮我就走。”她说得干脆，像在说服自己，“我不是骑士，没必要陪你死磕一条龙。”",
      "可你注意到，包袱口系着的绳结，是松的。她根本没有真的收拾好离开的东西。",
    ],
    location: "blackstreet",
    conditions: [
      { type: "contracted", id: "lia" },
      { type: "companionInParty", id: "lia" },
      { type: "intimacy", id: "lia", min: 8 },
    ],
    choices: [
      {
        id: "lia_bond_001_a",
        text: "❤️【恋爱】“留下来，不是因为契约。因为我想你留下。”",
        outcome: {
          text: "莉娅盯着你看了很久，久到你以为她要开口拒绝。然后她嗤笑一声，把包袱往角落里一踢：“……麻烦。你最好别让我后悔。”她别过脸去，耳尖却泛红，“行了行了，我留下。去睡吧，明早龙来了，我可没空给你擦眼泪。”",
          effects: [
            { type: "setFlag", key: "lia_bond_done", value: true },
            { type: "setFlag", key: "romance_lia", value: true },
            { type: "intimacy", id: "lia", amount: 10 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_bond_001_b",
        text: "🐈【战友】“不管你去哪，我这里都给你留个位置。”",
        outcome: {
          text: "莉娅的眉毛挑了挑，嘴角却藏不住笑意：“……哟，外乡人，这话听着怪肉麻的。”她顿了顿，声音低下来，“不过……行吧。我本来也没打算真走。黑街的猫认了主，就懒得挪窝了。”",
          effects: [
            { type: "setFlag", key: "lia_bond_done", value: true },
            { type: "setFlag", key: "bond_lia_companion", value: true },
            { type: "intimacy", id: "lia", amount: 5 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "lia_bond_001_c",
        text: "保持距离——“想走就走吧，不必勉强。”",
        outcome: {
          text: "莉娅的笑容僵了一瞬，随即恢复成那副吊儿郎当的模样：“……哈，你可真够大方的。”她把包袱重新系好，却始终没有真的拎起来，“行了，天亮的事，天亮再说。”",
          effects: [
            { type: "setFlag", key: "lia_bond_done", value: true },
          ],
          nextScene: "companion_event_end",
        },
      },
    ],
  },

  {
    id: "milena_bond_001",
    title: "米蕾娜 · 与怪物同行",
    text: [
      "龙临前的最后一夜，米蕾娜坐在火堆旁，把脸埋在膝盖间。你走近时，她抬起头，眼里映着跳动的火光，声音很轻：",
      "“……如果我真的变成怪物——不是‘像’，而是彻底变成非人的存在——你还会站在我身边吗？”",
    ],
    location: "church",
    conditions: [
      { type: "contracted", id: "milena" },
      { type: "companionInParty", id: "milena" },
      { type: "intimacy", id: "milena", min: 8 },
    ],
    choices: [
      {
        id: "milena_bond_001_a",
        text: "❤️【恋爱】“我喜欢的是你，不是你属于哪个物种。”",
        outcome: {
          text: "米蕾娜的瞳孔颤了颤，眼泪毫无预兆地落下来。她伸出手，又缩回去，最后只是用指尖轻轻碰了碰你的手背，像触碰一件易碎的珍宝：“……从来没有人，对我说过这种话。”她把额头抵在你的手背上，声音哽咽，“那你答应我，无论我变成什么样，你都不许先松手。”",
          effects: [
            { type: "setFlag", key: "milena_bond_done", value: true },
            { type: "setFlag", key: "romance_milena", value: true },
            { type: "intimacy", id: "milena", amount: 10 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_bond_001_b",
        text: "🕯️【羁绊】“无论你变成什么，我们都是伙伴。”",
        outcome: {
          text: "米蕾娜怔了怔，随即破涕为笑：“……伙伴。我这一生，第一次有人这么认真地跟我说这个词。”她深吸一口气，握紧拳头，“那好，就算明天变成怪物，我也要做一头记得朋友的怪物。”",
          effects: [
            { type: "setFlag", key: "milena_bond_done", value: true },
            { type: "setFlag", key: "bond_milena_companion", value: true },
            { type: "intimacy", id: "milena", amount: 5 },
          ],
          nextScene: "companion_event_end",
        },
      },
      {
        id: "milena_bond_001_c",
        text: "保持距离——“先活过明天，再说这些。”",
        outcome: {
          text: "米蕾娜垂下眼帘，没有追问：“……嗯，你说得对。”她抱紧膝盖，望着火焰沉默了很久，“那明天，我会努力活下来的。为了……为了还能站在你身边。”",
          effects: [
            { type: "setFlag", key: "milena_bond_done", value: true },
          ],
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
        text: "回到营地，继续安排这一夜。",
        outcome: {
          text: "你回到营地。夜色还长，如果你愿意，还可以与其他人谈谈，或直接休息。",
          effects: [{ type: "setScene", id: "camp_night" }],
        },
      },
    ],
  },
];
