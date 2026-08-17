import type { Scene } from "../../types/game";
import { introScenes } from "./intro";
import { tavernScenes } from "./tavern";
import { tavernD2Scenes } from "./tavernD2";
import { blackStreetScenes } from "./blackStreet";
import { blackStreetD2Scenes } from "./blackStreetD2";
import { royalDistrictScenes } from "./royalDistrict";
import { royalDistrictD2Scenes } from "./royalDistrictD2";
import { cathedralScenes } from "./cathedral";
import { cathedralD2Scenes } from "./cathedralD2";
import { undergroundScenes } from "./underground";
import { companionEventsScenes } from "./companionEvents";
import { campScenes } from "./camp";
import { locationHubScenes } from "./locationHub";
import { finaleScenes } from "./finale";

export const ALL_SCENES: Scene[] = [
  ...introScenes,
  ...tavernScenes,
  ...tavernD2Scenes,
  ...blackStreetScenes,
  ...blackStreetD2Scenes,
  ...royalDistrictScenes,
  ...royalDistrictD2Scenes,
  ...cathedralScenes,
  ...cathedralD2Scenes,
  ...undergroundScenes,
  ...companionEventsScenes,
  ...campScenes,
  ...locationHubScenes,
  ...finaleScenes,
];

export const SCENE_MAP: Record<string, Scene> = (() => {
  const map: Record<string, Scene> = {};
  for (const scene of ALL_SCENES) {
    if (map[scene.id]) {
      throw new Error(`重复的 Scene ID: ${scene.id}`);
    }
    map[scene.id] = scene;
  }
  return map;
})();

export function getScene(id: string): Scene {
  const scene = SCENE_MAP[id];
  if (!scene) {
    throw new Error(`未知 Scene ID: ${id}`);
  }
  return scene;
}
