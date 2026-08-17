import type { Scene } from "../../types/game";

export const blackStreetD2Scenes: Scene[] = [
  {
    id: "blackstreet_d2_001",
    title: "黑街 · 崩坏前夜",
    text: [
      "第二天，黑街像被掀翻的蚁巢。往日里靠消息吃饭的线人全都不见了，取而代之的是扛着箱子的商人——贵族们在连夜变卖家产，把金银往城外运。",
      "一个你认识的走私贩子抓住你的袖子：“外乡人！快！现在城里的走私渠道全乱了，谁手里有货谁就是爷。你上次要的那批‘圣堂旧档案’——我搞到了，但价格翻了十倍。”",
      "他压低声音：“而且，昨晚有帮派为抢龙卵的消息火并了一场，死了三个人。城防军正在挨家搜捕可疑的人。”",
    ],
    location: "blackstreet",
    choices: [
      {
        id: "blackstreet_d2_001_a",
        text: "买下那份档案（金币 -15）。",
        conditions: [{ type: "gold", min: 15 }],
        outcome: {
          text: "你数出十五枚金币。走私贩子把一卷焦黄的羊皮纸塞进你手里，转身钻进暗巷：“别说是从我这儿买的。”",
          effects: [
            { type: "gold", amount: -15 },
            { type: "addSecret", key: "mages_experimented_on_egg" },
          ],
          nextScene: "blackstreet_d2_danger",
        },
      },
      {
        id: "blackstreet_d2_001_b",
        text: "威胁他把档案交出来。",
        check: { stat: "violence", modifier: 0, tags: ["combat"] },
        success: {
          text: "你按住他的手腕，力道恰到好处。走私贩子脸色发白，乖乖把档案塞给你：“拿、拿去！就当交个朋友！”",
          effects: [
            { type: "addSecret", key: "mages_experimented_on_egg" },
            { type: "alert", amount: 3 },
          ],
          nextScene: "blackstreet_d2_danger",
        },
        partial: {
          text: "他哆嗦着退后半步：“别、别动手！档案给你，但城防军马上就到，你得快走！”你拿走档案，街上已经响起了急促的脚步声。",
          effects: [
            { type: "addSecret", key: "mages_experimented_on_egg" },
            { type: "alert", amount: 5 },
          ],
          nextScene: "blackstreet_d2_danger",
        },
        failure: {
          text: "走私贩子一把甩开你，拔腿就跑，一边跑一边喊：“抢东西啦！城防军！这儿有人闹事！”你只能趁乱离开，档案没到手。",
          effects: [{ type: "alert", amount: 5 }],
          nextScene: "blackstreet_d2_danger",
        },
      },
      {
        id: "blackstreet_d2_001_c",
        text: "不去管档案，先打探城里的最新传言。",
        outcome: {
          text: "你混进人流，竖起耳朵。听到的全是坏消息：“王宫在调集屠龙弩了”“圣堂要当众焚毁一批旧书”“据说龙来是为了讨债”……而其中一条让你心头一紧。",
          effects: [
            { type: "setFlag", key: "tavern_heard_rumors", value: true },
          ],
          nextScene: "blackstreet_d2_danger",
        },
      },
    ],
  },
  {
    id: "blackstreet_d2_danger",
    title: "黑街 · 街垒冲突",
    text: [
      "你正穿行在黑街的窄巷里，前方忽然传来一声闷响——一队城防军推着铁栅栏封死了街道，正挨家挨户盘查。几个帮派分子仗着人多堵在路口，双方剑拔弩张。",
      "退路也被堵住了。你必须选择一种方式通过这片混乱。",
    ],
    location: "blackstreet",
    choices: [
      {
        id: "blackstreet_d2_danger_a",
        text: "⚔️【暴力·combat】从帮派一侧强行开路。",
        check: { stat: "violence", modifier: 0, tags: ["combat"] },
        success: {
          text: "你一拳掀翻挡路的帮派打手，趁着他们愣神的功夫挤进人堆，几下闪身便脱离了封锁。身后传来叫骂声，但已经追不上你了。",
          effects: [
            { type: "alert", amount: 3 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你打出一条路，但肩膀挨了一棍。你咬着牙冲出封锁，疼得直吸冷气——值得，至少没被扣下。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "寡不敌众。你被围住揍了一顿，钱包被摸走，人也被推到墙角。等城防军散开，你才灰头土脸地爬出来，档案的事彻底泡汤。",
          effects: [
            { type: "gold", amount: -10 },
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "blackstreet_d2_danger_b",
        text: "🐈【身手·stealth】从屋顶绕过去。",
        check: { stat: "agility", modifier: 0, tags: ["stealth"], alertPenalty: true },
        success: {
          text: "你借着屋檐与晾衣绳的掩护，像一只无声的猫从屋顶掠过。下面的骚乱与你无关，你稳稳落在封锁线另一侧。",
          effects: [
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你爬到一半，瓦片松动，哗啦一声。下面的城防军抬头张望，你只能趴在屋脊上一动不动，等他们移开目光才继续挪动。有惊无险。",
          effects: [
            { type: "alert", amount: 2 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "一块松动的瓦片宣告了你的存在。城防军一拥而上，你被按在地上，扣了一晚。等放出来时，黑街已经变了个样。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "blackstreet_d2_danger_c",
        text: "🗣️【手腕·social】混进帮派人群，喊话煽动他们先撤。",
        check: { stat: "finesse", modifier: 0, tags: ["social"] },
        success: {
          text: "你三步并作两步冲进帮派人群，压低声音喊：“城防军要的就是咱们打起来！撤了他们的街垒才守得住货！”几个头目互看一眼，当真带着人呼啦一下散了。你趁乱通过。",
          effects: [
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你的喊话只说服了一半人。另一半骂骂咧咧地退开，你从让出的缝隙里挤了过去，但背后传来“这外乡人鬼精鬼精的”的议论——你的人被记住了。",
          effects: [
            { type: "alert", amount: 3 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "帮派分子根本不买账，反而有人认出你：“就是他昨晚打听龙卵的事！”你被追出三条街才甩掉他们，档案自然没拿到。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "blackstreet_d2_danger_d",
        text: "🛡️【塞蕾娜】让塞蕾娜上前，以骑士名义劝双方冷静。",
        conditions: [{ type: "companionInParty", id: "serena" }],
        outcome: {
          text: "塞蕾娜走上前，朗声道：“以王都骑士团之名——龙临在即，城中内斗只会让所有人都死在这里。放下武器，各回各处！”她一身银甲在日光下熠熠生辉，威严得让双方都愣住了。对峙的场面，竟真的就此化解。",
          effects: [
            { type: "trust", id: "serena", amount: 6 },
            { type: "setFlag", key: "blackstreet_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
