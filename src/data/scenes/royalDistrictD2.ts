import type { Scene } from "../../types/game";

export const royalDistrictD2Scenes: Scene[] = [
  {
    id: "royal_d2_001",
    title: "王城区 · 屠龙械",
    text: [
      "王城区的广场上，巨大的钢铁弩炮正在被组装——那是传说中的‘屠龙械’，据说一箭能射穿龙鳞。平民被驱赶到广场边缘，望着那狰狞的器械，眼里只有恐惧。",
      "一名传令官骑着马沿街宣告：“奉王命——龙临之日，全城戒严！所有青壮年编入守城队，违令者以通敌论处！”",
      "塞蕾娜站在你身边，握剑的手指微微发白。她低声说：“……我认得那架弩炮。它是用来杀龙的，可它瞄准的方向，也从来不是龙会来的方向。”",
    ],
    location: "royal",
    choices: [
      {
        id: "royal_d2_001_a",
        text: "问塞蕾娜，她到底会听谁的——王室，还是自己的判断。",
        conditions: [{ type: "companionInParty", id: "serena" }],
        outcome: {
          text: "塞蕾娜沉默了很久。“……我宣誓效忠的是王国，是这片土地上的人。如果有一天，王室的命令和人民的性命冲突——”她抬起眼，“我会选择后者。这句话，我只对你说。”",
          effects: [
            { type: "trust", id: "serena", amount: 8 },
            { type: "intimacy", id: "serena", amount: 3 },
          ],
          nextScene: "royal_d2_danger",
        },
      },
      {
        id: "royal_d2_001_b",
        text: "观察弩炮的结构，记下可能的弱点。",
        check: { stat: "knowledge", modifier: 0, tags: ["ancient"] },
        success: {
          text: "你绕到弩炮侧面，借着施工的间隙看清了它的构架：绞盘、轴承、一枚嵌着符文的核心。你默默记下——只要破坏核心，整架器械就会报废。",
          effects: [
            { type: "setFlag", key: "knows_ballista_weakpoint", value: true },
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
          ],
          nextScene: "royal_d2_danger",
        },
        partial: {
          text: "你只来得及看清大概的构架——绞盘和轴承一目了然，但核心的位置被帆布盖住了。至少你知道该怎么破坏它的传动结构。",
          effects: [
            { type: "setFlag", key: "knows_ballista_weakpoint", value: true },
          ],
          nextScene: "royal_d2_danger",
        },
        failure: {
          text: "你刚靠近弩炮，就被守军喝止：“闲人退开！”你只能远远看几眼，什么细节都没记下。",
          effects: [{ type: "alert", amount: 2 }],
          nextScene: "royal_d2_danger",
        },
      },
      {
        id: "royal_d2_001_c",
        text: "拦住一名传令官，套问王室的真实打算。",
        check: { stat: "finesse", modifier: 0, tags: ["social"] },
        success: {
          text: "你装作迷路的贵族随从，几句话套出传令官的口风：“……上头说了，龙卵必须保住，城可以换。”你心头一沉——王室打算牺牲整座城，也要留下地下的龙卵。",
          effects: [
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
          ],
          nextScene: "royal_d2_danger",
        },
        partial: {
          text: "传令官警惕地打量你，只肯漏出一句：“……总之，龙卵比命重要。”他匆匆离开，留下你咀嚼这句话的含义。",
          effects: [{ type: "alert", amount: 2 }],
          nextScene: "royal_d2_danger",
        },
        failure: {
          text: "传令官一眼识破你不是贵族随从，冷着脸把你赶开：“戒严期间，闲杂人等不得接近！再靠近，按间谍处置！”",
          effects: [{ type: "alert", amount: 3 }],
          nextScene: "royal_d2_danger",
        },
      },
    ],
  },
  {
    id: "royal_d2_danger",
    title: "王城区 · 撤离骚乱",
    text: [
      "你正要离开广场，西侧忽然传来骚乱——一队骑士押着不肯撤离的平民往外推，有人跌倒，有人哭喊。人群开始冲击封锁线，局面即将失控。",
      "骑士队长拔剑高喊：“王命如山！胆敢抗命者，格杀勿论！”他手里的剑，已经对准了一个抱着孩子的母亲。",
    ],
    location: "royal",
    choices: [
      {
        id: "royal_d2_danger_a",
        text: "⚔️【暴力·combat】冲上去夺下骑士队长的剑。",
        check: { stat: "violence", modifier: 0, tags: ["combat"] },
        success: {
          text: "你两步并作一步冲上前，一把扣住骑士队长的手腕，卸下他的剑。周围骑士一时怔住。你压着声音：“王命是要他们活，不是要他们死。”",
          effects: [
            { type: "alert", amount: 5 },
            { type: "trust", id: "serena", amount: 6 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你夺剑成功，但自己也挨了一记剑鞘。骑士队长后退半步，脸色铁青：“你好大的胆子！”不过骚乱总算暂时平息。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "你刚伸手就被两名骑士架住。骑士队长冷笑：“抓起来！”你被关进临时营房，直到黄昏才被放出来——城里已经彻底戒严。",
          effects: [
            { type: "alert", amount: 8 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "royal_d2_danger_b",
        text: "🗣️【手腕·social】大声斥责骑士队长，在人群面前让他下不来台。",
        check: { stat: "finesse", modifier: 0, tags: ["social"] },
        success: {
          text: "你朗声质问：“王命是让平民活命，还是让你屠杀手无寸铁的母亲？！屠龙未成，先屠城民——这剑，是王国的剑还是你的剑？！”人群哗然，骑士队长脸涨得通红，终究收回了剑。",
          effects: [
            { type: "trust", id: "serena", amount: 8 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你的质问让骑士队长愣了一瞬，人群趁机往前挤，封锁线松动了一条缝。他恨恨地瞪你一眼，却没再挥剑。",
          effects: [
            { type: "alert", amount: 4 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "骑士队长冷笑：“哪来的刁民！”两名骑士上前把你拖走。你被推搡出广场，骚乱继续，你什么也没能改变。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "royal_d2_danger_c",
        text: "🐈【身手·stealth】趁乱溜到弩炮旁，动手脚破坏它的核心。",
        conditions: [{ type: "flag", key: "knows_ballista_weakpoint", value: true }],
        check: { stat: "agility", modifier: 0, tags: ["stealth"] },
        success: {
          text: "你趁着人群骚乱，猫着腰溜到弩炮侧面，用随身工具撬开核心舱门，将一枚小石子卡进符文核心的缝隙。它表面看不出任何异样，但真到发射时，必会卡壳。",
          effects: [
            { type: "setFlag", key: "ballista_sabotaged", value: true },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你成功撬开核心舱门，但手一抖，划伤了手指，血滴在符文上。你赶紧擦掉——应该没人注意到。核心被你塞入一枚石子，但你的行踪留下了痕迹。",
          effects: [
            { type: "alert", amount: 4 },
            { type: "setFlag", key: "ballista_sabotaged", value: true },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "你刚摸到弩炮旁就被巡逻的骑士喝止：“什么人！”你只能仓皇逃走，什么也没做成。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "royal_d2_danger_d",
        text: "🛡️【塞蕾娜】让塞蕾娜上前制止骑士队长。",
        conditions: [{ type: "companionInParty", id: "serena" }],
        outcome: {
          text: "塞蕾娜走上前，声音平静却不容置疑：“队长。骑士团的剑，是用来保护王国的，不是用来对准王国子民的。收剑，让我带这些平民走。”骑士队长认得她，犹豫片刻，终究收剑让路。",
          effects: [
            { type: "trust", id: "serena", amount: 10 },
            { type: "intimacy", id: "serena", amount: 4 },
            { type: "setFlag", key: "royal_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
