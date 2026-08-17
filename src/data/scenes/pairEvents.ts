import type { Scene } from "../../types/game";

// V0.3 Phase 7：双人组合短事件——让玩家第一次感觉"我带哪两个人，剧情真的不一样"
export const pairScenes: Scene[] = [
  {
    id: "pair_serena_lia_001",
    title: "守法，还是生存？",
    text: [
      "营地的篝火旁，塞蕾娜和莉娅又拌上了嘴。莉娅叼着一根草茎，把今晚在黑街看到的情形添油加醋地讲了一遍：“骑士大人，你说那些被搜走家底的难民，是守法的人过得好，还是像我这样会躲的人活得好？”",
      "塞蕾娜皱起眉：“秩序崩塌的那天，最先死的就是不守规矩的人。”莉娅嗤笑一声：“规矩？规矩先把你卖了，你还帮着数钱呢。”",
      "两人同时看向你，等你说句公道话。",
    ],
    location: "tavern",
    conditions: [
      { type: "companionInParty", id: "serena" },
      { type: "companionInParty", id: "lia" },
      { type: "flag", key: "pair_serena_lia_done", value: false },
    ],
    choices: [
      {
        id: "pair_serena_lia_a",
        text: "🛡️ 支持塞蕾娜：“秩序或许不完美，但它是穷人的屋檐。”",
        outcome: {
          text: "塞蕾娜目光微亮，点头：“正是。若无秩序，连屋檐都没有。”莉娅撇撇嘴，却没有反驳——她见过太多秩序破碎后的街巷，知道这话不全是迂腐。",
          effects: [
            { type: "trust", id: "serena", amount: 3 },
            { type: "setFlag", key: "pair_serena_lia_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_serena_lia_b",
        text: "🐈 支持莉娅：“活下来的人才有资格谈秩序。”",
        outcome: {
          text: "莉娅得意地朝塞蕾娜扬了扬下巴：“听见没？”塞蕾娜沉默片刻，却没动怒：“……我承认，你的活法，救过你的命。这一点，我敬你。”莉娅一愣，难得没有回嘴。",
          effects: [
            { type: "trust", id: "lia", amount: 3 },
            { type: "setFlag", key: "pair_serena_lia_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_serena_lia_c",
        text: "🤝 调停：“一个守规矩，一个懂变通——我们两个都需要。”",
        outcome: {
          text: "塞蕾娜和莉娅对视一眼。莉娅先笑了：“行吧，骑士大人，明晚突围，你带路，我兜底。”塞蕾娜的嘴角也松动了：“成交。你那份‘变通’，用在刀刃上。”",
          effects: [
            { type: "trust", id: "serena", amount: 1 },
            { type: "trust", id: "lia", amount: 1 },
            { type: "intimacy", id: "lia", amount: 1 },
            { type: "setFlag", key: "pair_serena_lia_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
    ],
  },

  {
    id: "pair_serena_milena_001",
    title: "骑士的剑，与血脉的刃",
    text: [
      "篝火另一头，米蕾娜正低头研究手心里泛着蓝光的符文，塞蕾娜抱着剑，眉头拧成疙瘩：“那东西……还在侵蚀你吗？”米蕾娜摇头：“它在变强，但也在变听话。只要我守住本心，它只是一把刃。”",
      "塞蕾娜沉默良久：“我曾经以为，力量必须来自规矩和训练。但你让我看见另一种可能——来自血脉、来自代价的力量。”她顿了顿，“我只怕你为它付的代价，有一天会高得你付不起。”",
      "米蕾娜抬起头，眼神平静：“所以我才需要有人，在我付不起的时候提醒我。”两人都看向你。",
    ],
    location: "tavern",
    conditions: [
      { type: "companionInParty", id: "serena" },
      { type: "companionInParty", id: "milena" },
      { type: "flag", key: "pair_serena_milena_done", value: false },
    ],
    choices: [
      {
        id: "pair_serena_milena_a",
        text: "🛡️ 支持塞蕾娜：“力量要有界限——我会帮你守住这条线。”",
        outcome: {
          text: "塞蕾娜认真地点头：“那我就做那条线。”米蕾娜怔了怔，低声道：“……谢谢。有界限的力量，才不会伤到想守护的人。”她指尖的蓝光，似乎因此收敛了几分。",
          effects: [
            { type: "trust", id: "serena", amount: 3 },
            { type: "intimacy", id: "milena", amount: 1 },
            { type: "setFlag", key: "pair_serena_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_serena_milena_b",
        text: "🕯️ 支持米蕾娜：“力量本身没有善恶，善恶在握剑的手里。”",
        outcome: {
          text: "米蕾娜的眼里亮起光：“……正是如此。”塞蕾娜沉吟片刻，竟没有反驳，反而低声说：“……骑士团教过我‘剑无善恶’的道理。是我狭隘了。米蕾娜，若你迷失，我会拉你回来——这也是我的修行。”",
          effects: [
            { type: "trust", id: "milena", amount: 3 },
            { type: "intimacy", id: "milena", amount: 1 },
            { type: "setFlag", key: "pair_serena_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_serena_milena_c",
        text: "🤝 调停：“你们一个管界限，一个管方向——我信你们。”",
        outcome: {
          text: "塞蕾娜和米蕾娜相视一笑。塞蕾娜伸出手，米蕾娜犹豫了一下，也把手放上去。“那就说定了，”塞蕾娜说，“她若越界，我挡；我若固执，你劝。”夜风拂过，篝火跳了跳，仿佛替她们作证。",
          effects: [
            { type: "trust", id: "serena", amount: 1 },
            { type: "trust", id: "milena", amount: 1 },
            { type: "intimacy", id: "milena", amount: 1 },
            { type: "setFlag", key: "pair_serena_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
    ],
  },

  {
    id: "pair_lia_milena_001",
    title: "黑街的规矩，学院的规矩",
    text: [
      "莉娅盘腿坐在火堆边，用匕首削着一根树枝：“所以你们学院的人，从不为钱发愁？读书不用交束脩，出任务有人供饭？”米蕾娜温和地摇头：“学院的供给，是用‘成果’换的。我那些年的研究……也算是替人扛过不少黑锅。”",
      "莉娅挑眉：“黑锅？那不还是被人当刀使。”米蕾娜没有反驳，反而笑了笑：“是。所以我现在学聪明了——自己挑要扛的锅。”",
      "莉娅一愣，随即大笑：“哈！你这人，有点意思。”她丢给你一个眼神，“外乡人，你说说，我和她，谁更会看人？”",
    ],
    location: "tavern",
    conditions: [
      { type: "companionInParty", id: "lia" },
      { type: "companionInParty", id: "milena" },
      { type: "flag", key: "pair_lia_milena_done", value: false },
    ],
    choices: [
      {
        id: "pair_lia_milena_a",
        text: "🐈 支持莉娅：“她一眼就能看穿谁在撒谎——这条命是她救的。”",
        outcome: {
          text: "莉娅的嘴角翘上天：“听见没，学院派？看人的本事，得在街角练。”米蕾娜认真地点头：“……这我认。书里写不出人心。莉娅，明晚要是真打起来，帮我盯着背后。”莉娅先是一愣，随即咧嘴：“成交。背后归我，前头归你。”",
          effects: [
            { type: "trust", id: "lia", amount: 3 },
            { type: "intimacy", id: "lia", amount: 1 },
            { type: "setFlag", key: "pair_lia_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_lia_milena_b",
        text: "🕯️ 支持米蕾娜：“她看得透人心，却从不拿这个伤人。”",
        outcome: {
          text: "米蕾娜的眼睫颤了颤，声音很轻：“……谢谢你这么说。”莉娅难得收起玩世不恭的神情，打量了米蕾娜几眼：“……行吧，我也承认，你比我想的靠谱。能忍住不拿人心当筹码的人，黑街里一个巴掌数得过来。”",
          effects: [
            { type: "trust", id: "milena", amount: 3 },
            { type: "intimacy", id: "milena", amount: 1 },
            { type: "setFlag", key: "pair_lia_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
      {
        id: "pair_lia_milena_c",
        text: "🤝 调停：“一个懂人心，一个懂世道——你们加起来，我在这城里什么都不怕。”",
        outcome: {
          text: "莉娅和米蕾娜交换了一个眼神，都在对方眼里看到了认可。“行，”莉娅把手搭在米蕾娜肩上，“那说定了，你管那些弯弯绕绕的世道，我管直来直往的人心。”米蕾娜笑出声：“……成交。”",
          effects: [
            { type: "trust", id: "lia", amount: 1 },
            { type: "trust", id: "milena", amount: 1 },
            { type: "intimacy", id: "lia", amount: 1 },
            { type: "intimacy", id: "milena", amount: 1 },
            { type: "setFlag", key: "pair_lia_milena_done", value: true },
          ],
          nextScene: "pair_event_end",
        },
      },
    ],
  },

  {
    id: "pair_event_end",
    title: "夜色正长",
    text: ["这场夜谈，让这个小小的营地更像一个真正的队伍了。"],
    location: "tavern",
    choices: [
      {
        id: "pair_event_end_a",
        text: "回到营地，继续安排这一夜。",
        outcome: {
          text: "你回到营地。夜色还长，如果你愿意，还可以与其他人谈谈，或直接休息。",
          effects: [{ type: "setScene", id: "camp_night" }],
        },
      },
    ],
  },
];
