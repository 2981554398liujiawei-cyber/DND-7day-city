import type { Scene } from "../../types/game";

export const cathedralD2Scenes: Scene[] = [
  {
    id: "church_d2_001",
    title: "圣堂 · 神罚布告",
    text: [
      "圣堂前，人山人海。大主教站在高台上，捧着一卷金丝封面的经卷，声音洪亮地宣布：“龙临乃神罚！我等当以忏悔涤荡此城之罪！一切质疑圣言者，皆为异端！”",
      "台下的信徒有的跪地痛哭，有的跟着高呼。而米蕾娜紧紧攥着你的袖子，声音发颤：“……他们要烧档案了。我昨晚听见执事们连夜把地下室的老档案往外搬，说‘不该留的证据，一把火烧了干净’。”",
    ],
    location: "church",
    choices: [
      {
        id: "church_d2_001_a",
        text: "问米蕾娜，她知道那些档案里有什么。",
        conditions: [{ type: "companionInParty", id: "milena" }],
        outcome: {
          text: "米蕾娜深吸一口气：“他们一直都知道龙卵的真相。地下那东西，是上古留给这座城的‘心脏’。教会怕信徒知道真相后不再信‘神罚’，所以要把证据都烧了。”她看着你，“你信吗？”",
          effects: [
            { type: "trust", id: "milena", amount: 8 },
            { type: "intimacy", id: "milena", amount: 3 },
          ],
          nextScene: "church_d2_danger",
        },
      },
      {
        id: "church_d2_001_b",
        text: "趁乱潜入地下档案室，抢在焚烧前带出关键卷宗。",
        check: { stat: "agility", modifier: 0, tags: ["stealth"] },
        success: {
          text: "你贴着墙根溜进地下室，在执事们忙着搬运的间隙，从火堆旁抢出几卷最旧的羊皮纸。其中一卷的落款让你瞳孔一缩——那是圣堂第一任大主教的亲笔：龙卵封印始末。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你抢出一卷档案，但火势蔓延得比想象快，其余的被烧成了灰。你翻开抢出的那卷，是几十年前关于‘地下能源’的账目——间接印证了龙卵之说。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "你刚摸进地下室就被一名执事撞见：“异端！异端潜入圣堂了！”你只能夺路而逃，什么也没拿到。身后的火舌吞噬了那些旧档案。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_d2_001_c",
        text: "走到台前，当众质疑大主教的说法。",
        check: { stat: "finesse", modifier: 0, tags: ["social"] },
        success: {
          text: "你穿过人群走到台前，朗声质问：“大主教说龙临是神罚——可圣堂地下的封印又是谁写的？！四十年前，是你们亲手把‘龙卵’封在地下！今日的神罚，是你们自己招来的！”全场哗然，大主教脸色煞白。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你的质问让台下出现骚动，但大主教反应极快：“妖言惑众！此人必是龙的走狗！”信徒们半信半疑，你被几名圣武士请出了广场。至少，动摇了一部分人的信念。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "大主教一句话就压住了你：“异端之口，岂能玷污圣言？”信徒们围上来推搡你，你被轰出圣堂。台下的质疑声也很快被祷告声淹没。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
  {
    id: "church_d2_danger",
    title: "圣堂 · 焚卷大火",
    text: [
      "圣堂后院的广场上堆起了小山般的旧档案。执事们举着火把，正要引燃。而火焰边缘，一个老执事忽然扑向火堆，抱住一卷档案痛哭：“这卷不能烧！这是第一任大主教的手书啊！”",
      "几个圣武士上前拖他，老人死死抱住卷宗不放手。火把已经凑到了纸堆边缘。",
    ],
    location: "church",
    choices: [
      {
        id: "church_d2_danger_a",
        text: "⚔️【暴力·combat】推开圣武士，把老执事和档案一起救出来。",
        check: { stat: "violence", modifier: 0, tags: ["combat"] },
        success: {
          text: "你几步冲进人群，一把将老执事连同那卷档案拽出火圈。圣武士们正要动手，你亮出架势：“为了一卷纸，要在圣堂门口杀人吗？！”他们终究没敢在众目睽睽下动手。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你救出了老执事，但火势已经烧起来，那卷手书被烧掉了一半。老执事看着残卷，老泪纵横：“……天要亡这城啊。”",
          effects: [
            { type: "alert", amount: 4 },
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "你被圣武士挡住，只能眼睁睁看着老执事被拖开，卷宗被投入火中。老人瘫坐在地，哭得撕心裂肺。你什么都没能救下。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_d2_danger_b",
        text: "🐈【身手·stealth】趁乱混进搬卷宗的行列，把那卷手书藏进怀里。",
        check: { stat: "agility", modifier: 0, tags: ["stealth"] },
        success: {
          text: "你假扮成搬运的杂役，混进行列，趁执事们不注意，把那卷手书塞进怀里，又顺手换了一卷废纸放回原处。整个过程行云流水，无人察觉。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你成功换出那卷手书，但一名执事多看了你两眼：“新来的？手脚快点。”你低着头匆匆离开，后背出了一层冷汗。",
          effects: [
            { type: "alert", amount: 3 },
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "你伸手去拿手书时，一名执事猛地回头，和你四目相对。你只能装作脚滑摔了一跤，趁乱溜走。手书最终还是被投入了火中。",
          effects: [
            { type: "alert", amount: 4 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_d2_danger_c",
        text: "🗣️【手腕·social】当众质问大主教：烧档案，是怕真相还是怕信徒？",
        check: { stat: "finesse", modifier: 0, tags: ["social"] },
        success: {
          text: "你朗声道：“大主教说龙临是神罚，那为什么圣堂要偷偷烧掉几十年的老档案？怕神罚来临时，神明没法和你们对质吗？”人群哄笑又哗然。大主教脸色铁青，火把终究没能点下去。",
          effects: [
            { type: "addSecret", key: "church_knew_truth" },
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        partial: {
          text: "你的质问让大主教语塞了一瞬，但旁边的圣武士立刻上前：“异端！把他带走！”你被拖走时回头，看到火把已经落了下去。至少，你在信徒心里种下了疑问。",
          effects: [
            { type: "alert", amount: 6 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
        failure: {
          text: "大主教阴沉地看着你：“圣言面前，无信者之词不值一驳。”信徒们高呼着把你推了出去。火把落下，档案化为灰烬。",
          effects: [
            { type: "alert", amount: 5 },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
      {
        id: "church_d2_danger_d",
        text: "✨【米蕾娜】让米蕾娜用魔力护住火堆旁的手书。",
        conditions: [{ type: "companionInParty", id: "milena" }],
        outcome: {
          text: "米蕾娜闭上眼睛，指尖泛起幽蓝的光。火焰像被无形的手拨开，那卷手书从火堆里滑出，完好无损地落进她的掌心。全场寂静——包括大主教，都震惊地看着这一幕。",
          effects: [
            { type: "trust", id: "milena", amount: 10 },
            { type: "intimacy", id: "milena", amount: 4 },
            { type: "addSecret", key: "church_knew_truth" },
            { type: "setFlag", key: "church_d2_done", value: true },
            { type: "advanceTime" },
            { type: "setScene", id: "location_hub" },
          ],
        },
      },
    ],
  },
];
