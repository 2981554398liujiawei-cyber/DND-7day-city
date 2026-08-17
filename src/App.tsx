import { useGameStore } from "./store/gameStore";
import StartScreen from "./components/StartScreen";
import GameShell from "./components/GameShell";
import EndingScreen from "./components/EndingScreen";
import "./styles/global.css";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const state = useGameStore((s) => s.state);

  if (screen === "start" || !state) {
    return <StartScreen />;
  }

  if (screen === "ending") {
    return <EndingScreen />;
  }

  return <GameShell />;
}
