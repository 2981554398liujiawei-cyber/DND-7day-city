import type { Scene } from "../../types/game";

export const blackStreetScenes: Scene[] = [
  {
    id: "blackstreet_001",
    title: "黑街 · 猫与消息",
    text: [
      "黑街像一条蛰伏在城腹的蛇。浓烟从无牌炼金铺里飘出，酒鬼和扒手共享同一根灯柱下的阴影，墙根处有人压着嗓子买卖带血的情报。",
      "莉娅熟练地拨开人群，跟一个蜷在腌鱼桶边、戴着歪帽子的老头打了声招呼：“老秃鹫，龙的消息，什么价？”",
      "老头咧嘴笑，露出缺了半边的门牙：“龙？小姑娘，这条消息可不止卖你一个人的钱。王室、圣堂、还有那些穿袍子的法师，这两天都来买过。”",
    ],
    location: "blackstreet",
    choices: [
      {
        id: "blackstreet_001_a",
        text: "询问黑市里关于龙的传闻。",
        outcome: {
          text: "老头压低声：“听说那龙不是来毁城的。有人见过它在城外的废墟里盘旋，像在……找东西。还有人说，它绕着地下魔力核心的地界打转，那地方连盗墓贼都不敢进。”",
          effects: [
            { type: "addSecret", key: "dragon_is_parent" },
            { type: "setFlag", key: "underground_hint", value: true },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
      },
      {
        id: "blackstreet_001_b",
        text: "问老头，城里的权贵们都在买什么。",
        check: { stat: "finesse", modifier: 1, tags: ["social"] },
        success: {
          text: "老头眯眼：“王室在买‘屠龙师’的联络方式；圣堂在买‘龙卵’这个词——出价高得吓人；法师学院……他们在买旧的实验记录，专挑能抹掉的那种。”",
          effects: [
            { type: "setFlag", key: "told_factions_orders", value: true },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
        partial: {
          text: "“都在买，谁都要在龙来之前站好队。”老头含糊道，“买得最凶的是圣堂，出价能买下半个码头。”",
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_002",
        },
        failure: {
          text: "老头警惕地扫了你一眼：“问这么多，你也不是什么好东西。钱呢？”",
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_002",
        },
      },
      {
        id: "blackstreet_001_c",
        text: "注意莉娅听到这些话时的反应。",
        check: { stat: "insight", modifier: 1, tags: ["social"] },
        success: {
          text: "提到‘法师学院的实验记录’时，莉娅的手指在硬币上停了一瞬——只一瞬，又若无其事地转起来。你察觉，她知道的比她说出来的多得多。",
          effects: [
            { type: "addSecret", key: "lia_spy_history" },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
        partial: {
          text: "莉娅始终没看老头，只是偶尔插一句玩笑。你看不出更多，但直觉她有事瞒着。",
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_002",
        },
        failure: {
          text: "莉娅敏锐地回望你一眼，笑问：“看我做什么？怕我吞了你的消息钱？”",
          effects: [{ type: "setLocation", id: "blackstreet" }],
          nextScene: "blackstreet_002",
        },
      },
      {
        id: "blackstreet_001_d",
        text: "向老头打听地下魔力核心怎么进。",
        check: { stat: "agility", modifier: 1, tags: ["stealth"] },
        success: {
          text: "老头伸出三根手指：“往东三条街，有口枯井，井底铁栅上挂着锈锁。那下面是法师的老管线——没几个人敢走，但你要是有胆子，够你摸到核心边上。”",
          effects: [
            { type: "setFlag", key: "underground_hint", value: true },
            { type: "setFlag", key: "knows_underground_route", value: true },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
        partial: {
          text: "“东边有口枯井能通管线。”老头含糊道，“不过近来常有人看见穿长袍的在那边徘徊，你自己掂量。”",
          effects: [
            { type: "setFlag", key: "underground_hint", value: true },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
        failure: {
          text: "老头冷哼一声：“老管线？那种地方连黑猫都绕道。你要是进去，大概会变成管线里的一具尸骨。”",
          effects: [
            { type: "setFlag", key: "underground_hint", value: true },
            { type: "setLocation", id: "blackstreet" },
          ],
          nextScene: "blackstreet_002",
        },
      },
    ],
  },
  {
    id: "blackstreet_002",
    title: "黑街 · 真话的价码",
    text: [
      "消息买得差不多了。莉娅用一枚银币买下了老头手里那份‘王室屠龙名单’的抄件——上面列着几名潜伏的屠龙师，以及一个代号：『翼』。",
      "“王室在备刀。”莉娅把抄件塞进怀里，语气罕见地正经，“他们不是想谈判，是想在龙落地之前杀了它。你知道这意味着什么吗？他们根本没打算跟龙谈。”",
      "这条情报分量十足。",
    ],
    location: "blackstreet",
    choices: [
      {
        id: "blackstreet_002_a",
        text: "记下这个情报，转向下一处调查。",
        outcome: {
          text: "你将黑街的情报收好。这里能挖的线索已经挖尽，是时候去别处看看了。",
          effects: [
            { type: "addSecret", key: "royal_plan_destroy_dragon" },
            { type: "setFlag", key: "blackstreet_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "blackstreet_002_b",
        text: "问莉娅，为什么一提法师学院的实验她就回避。",
        conditions: [{ type: "secret", key: "lia_spy_history" }],
        outcome: {
          text: "莉娅的笑容冷下来：“……没什么，我以前替他们跑过腿，知道那帮穿袍子的心有多黑。你打听这个做什么？”她警惕地看着你，“我们是合作，不是查户口。”",
          effects: [
            { type: "trust", id: "lia", amount: -2 },
            { type: "setFlag", key: "blackstreet_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "blackstreet_002_c",
        text: "决定在夜里单独找莉娅谈谈她的过去。",
        conditions: [{ type: "secret", key: "lia_spy_history" }],
        outcome: {
          text: "莉娅沉默片刻，最后松了口：“……行吧，晚上再说。有些话，不适合在黑街的风里讲。”",
          effects: [
            { type: "trust", id: "lia", amount: 3 },
            { type: "setFlag", key: "lia_agreed_talk", value: true },
            { type: "setFlag", key: "blackstreet_main_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
