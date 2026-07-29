import { AnimatePresence, motion } from "framer-motion";
import { useVideoPlayer } from "@/lib/video/hooks";

import { Scene1 } from "./video_scenes/Scene1";
import { Scene2 } from "./video_scenes/Scene2";
import { Scene3 } from "./video_scenes/Scene3";
import { Scene4 } from "./video_scenes/Scene4";
import { Scene5 } from "./video_scenes/Scene5";
import { Scene6 } from "./video_scenes/Scene6";
import { Scene7 } from "./video_scenes/Scene7";
import { Scene8 } from "./video_scenes/Scene8";

const SCENE_DURATIONS = [
  5000, // 1. Intro
  6000, // 2. Problem
  7000, // 3. Solution
  7000, // 4. Phase View
  6000, // 5. Assignees
  5000, // 6. Milestones
  6000, // 7. Export PPTX
  6000, // 8. Outro
];

const SCENES = [
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
];

export function VideoTemplate() {
  const { currentScene } = useVideoPlayer(SCENE_DURATIONS);
  
  const CurrentSceneComponent = SCENES[currentScene] || SCENES[0];
  
  // 0, 1, 7 are Dark Mode scenes. 2-6 are Light Mode UI scenes.
  const isLightScene = currentScene >= 2 && currentScene <= 6;

  return (
    <div className="w-full h-screen overflow-hidden relative font-sans text-foreground">
      {/* PERSISTENT BACKGROUND LAYER */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg_corp.png)` }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: isLightScene ? 0.05 : 0.3
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* DYNAMIC BACKGROUND COLOR */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundColor: isLightScene ? "hsl(210, 40%, 98%)" : "hsl(222, 47%, 11%)"
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* GRID PATTERN */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          backgroundImage: isLightScene 
            ? "linear-gradient(to right, rgba(0, 72, 244, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 72, 244, 0.06) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
        transition={{ duration: 1.2 }}
      />

      {/* ACCENT GLOWS - Persist but move */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          background: isLightScene 
            ? "radial-gradient(circle, rgba(0, 72, 244, 0.1) 0%, rgba(0, 72, 244, 0) 70%)"
            : "radial-gradient(circle, rgba(0, 72, 244, 0.25) 0%, rgba(0, 72, 244, 0) 70%)",
          x: currentScene % 2 === 0 ? "50vw" : "-10vw",
          y: currentScene % 3 === 0 ? "-20vh" : "40vh",
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          background: isLightScene 
            ? "radial-gradient(circle, rgba(237, 125, 49, 0.08) 0%, rgba(237, 125, 49, 0) 70%)"
            : "radial-gradient(circle, rgba(237, 125, 49, 0.2) 0%, rgba(237, 125, 49, 0) 70%)",
          x: currentScene % 2 === 0 ? "-10vw" : "60vw",
          y: currentScene % 3 === 0 ? "50vh" : "-10vh",
        }}
        transition={{ duration: 7, ease: "easeInOut" }}
      />

      {/* BRAND PERSISTENT LOGO */}
      <motion.div
        className="absolute top-8 left-10 z-50 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: currentScene === 0 || currentScene === 7 ? 0 : 1, // Hidden on intro/outro, visible in UI scenes
          y: currentScene === 0 || currentScene === 7 ? -20 : 0
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(0,72,244,0.4)]">
          V
        </div>
        <span className={\`font-display font-bold text-2xl \${isLightScene ? 'text-foreground' : 'text-white'}\`}>Вектор</span>
      </motion.div>

      {/* SCENE CONTENT */}
      <div className="relative w-full h-full z-10">
        <AnimatePresence mode="popLayout">
          <CurrentSceneComponent key={currentScene} />
        </AnimatePresence>
      </div>
    </div>
  );
}