export type Origin = "mercenary" | "scholar" | "trickster";

export type StatKey =
  | "violence"
  | "agility"
  | "insight"
  | "knowledge"
  | "finesse"
  | "will";

export type CheckTag = "combat" | "stealth" | "social" | "ancient";

export type Stats = Record<StatKey, number>;

export type PeriodKey =
  | "d1_morning"
  | "d1_afternoon"
  | "d1_dusk"
  | "d1_night"
  | "d2_morning"
  | "d2_afternoon"
  | "d2_dusk"
  | "d2_night"
  | "finale";

export type CompanionId = "serena" | "lia" | "milena";

export interface CompanionState {
  met: boolean;
  recruited: boolean;
  trust: number;
  intimacy: number;
  contracted: boolean;
  personalQuestComplete: boolean;
}

export interface PlayerState {
  name: string;
  origin: Origin;
  stats: Stats;
}

export interface GameStateData {
  version: number;
  player: PlayerState;
  periodIndex: number;
  location: string;
  gold: number;
  corruption: number;
  alert: number;
  flags: Record<string, boolean>;
  secrets: string[];
  companions: Record<CompanionId, CompanionState>;
  party: string[];
  currentSceneId: string;
  history: string[];
  ending?: string;
}

export interface CompanionDef {
  id: CompanionId;
  name: string;
  age: number;
  job: string;
  role: string;
  ability: "guardian" | "blackCat" | "forbiddenExchange";
  abilityName: string;
  abilityDesc: string;
  avatarChar: string;
  color: string;
  tagline: string;
  personality: string[];
  desire: string;
  fear: string;
  bottomLine: string;
  likes: string[];
  dislikes: string[];
}

export type Condition =
  | { type: "flag"; key: string; value: boolean }
  | { type: "secret"; key: string }
  | { type: "companionInParty"; id: CompanionId; value?: boolean }
  | { type: "partyNotFull" }
  | { type: "personalQuestDone"; id: CompanionId; value?: boolean }
  | { type: "trust"; id: CompanionId; min: number }
  | { type: "intimacy"; id: CompanionId; min: number }
  | { type: "contracted"; id: CompanionId }
  | { type: "stat"; stat: StatKey; min: number }
  | { type: "gold"; min: number }
  | { type: "alert"; min: number }
  | { type: "corruption"; min: number }
  | { type: "period"; at: PeriodKey }
  | { type: "periodIn"; in: PeriodKey[] }
  | { type: "origin"; in: Origin[] };

export type Effect =
  | { type: "setFlag"; key: string; value: boolean }
  | { type: "addSecret"; key: string }
  | { type: "trust"; id: CompanionId; amount: number }
  | { type: "intimacy"; id: CompanionId; amount: number }
  | { type: "gold"; amount: number }
  | { type: "corruption"; amount: number }
  | { type: "alert"; amount: number }
  | { type: "recruit"; id: CompanionId }
  | { type: "contract"; id: CompanionId }
  | { type: "joinParty"; id: CompanionId }
  | { type: "leaveParty"; id: CompanionId }
  | { type: "advanceTime" }
  | { type: "setLocation"; id: string }
  | { type: "setScene"; id: string }
  | { type: "setPersonalQuestComplete"; id: CompanionId; value: boolean };

export interface Outcome {
  text?: string | string[];
  nextScene?: string;
  effects?: Effect[];
}

export interface Choice {
  id: string;
  text: string;
  conditions?: Condition[];
  check?: {
    stat: StatKey;
    modifier?: number;
    companion?: CompanionId;
    tags?: CheckTag[];
    alertPenalty?: boolean; // 警戒 ≥ 30 时 modifier -1
  };
  success?: Outcome;
  partial?: Outcome;
  failure?: Outcome;
  outcome?: Outcome;
}

export interface Scene {
  id: string;
  title?: string;
  text: string | string[];
  location?: string;
  conditions?: Condition[];
  choices: Choice[];
}
