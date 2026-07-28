import { AnimatePresence } from "framer-motion";
import { useVideoPlayer } from "@/lib/video/hooks";
import { Scene1 } from "./video_scenes/Scene1";
import { Scene2 } from "./video_scenes/Scene2";
import { Scene3 } from "./video_scenes/Scene3";
import { Scene4 } from "./video_scenes/Scene4";
import { Scene5 } from "./video_scenes/Scene5";
import { Scene6 } from "./video_scenes/Scene6";
import { Scene7 } from "./video_scenes/Scene7";

const SCENE_DURATIONS = {
  intro: 4500,
  streams: 7000,
  stages: 6000,
  editing: 5500,
  versions: 5000,
  export: 6000,
  outro: 5000,
};

export function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Persistent background gradient that shifts per scene */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background:
            currentScene === 0
              ? "linear-gradient(135deg, #F8F9FA 0%, #E8EBF0 100%)"
              : currentScene === 6
              ? "linear-gradient(135deg, #0048F4 0%, #0036B8 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
        }}
      />

      {/* Persistent accent shape - travels across scenes */}
      <div
        className="absolute w-[30vw] h-[30vw] rounded-full transition-all duration-1200 ease-out pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,72,244,0.08) 0%, transparent 70%)",
          left: currentScene === 0 ? "50%" : currentScene === 6 ? "50%" : "-10%",
          top: currentScene === 0 ? "20%" : currentScene === 6 ? "30%" : "10%",
          transform: `translate(-50%, -50%) scale(${currentScene === 0 ? 1.5 : currentScene === 6 ? 2 : 0.8})`,
        }}
      />

      {/* Scene content */}
      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="scene1" />}
        {currentScene === 1 && <Scene2 key="scene2" />}
        {currentScene === 2 && <Scene3 key="scene3" />}
        {currentScene === 3 && <Scene4 key="scene4" />}
        {currentScene === 4 && <Scene5 key="scene5" />}
        {currentScene === 5 && <Scene6 key="scene6" />}
        {currentScene === 6 && <Scene7 key="scene7" />}
      </AnimatePresence>
    </div>
  );
}
