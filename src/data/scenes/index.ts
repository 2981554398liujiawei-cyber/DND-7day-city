import type { Scene } from "../../types/game";
import { introScenes } from "./intro";
import { tavernScenes } from "./tavern";
import { blackStreetScenes } from "./blackStreet";
import { royalDistrictScenes } from "./royalDistrict";
import { cathedralScenes } from "./cathedral";
import { undergroundScenes } from "./underground";
import { companionEventsScenes } from "./companionEvents";
import { campScenes } from "./camp";
import { locationHubScenes } from "./locationHub";
import { finaleScenes } from "./finale";

export const ALL_SCENES: Scene[] = [
  ...introScenes,
  ...tavernScenes,
  ...blackStreetScenes,
  ...royalDistrictScenes,
  ...cathedralScenes,
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
