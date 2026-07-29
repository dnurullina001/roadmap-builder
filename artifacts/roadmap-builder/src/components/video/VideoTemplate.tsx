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

// Keys are scene names; values are durations in ms.
// useVideoPlayer requires an OBJECT (not an array).
const SCENE_DURATIONS = {
  intro:      5000,
  problem:    6000,
  streams:    7000,
  phases:     7000,
  assignees:  6000,
  milestones: 5000,
  export:     6000,
  outro:      6000,
};

const SCENE_COMPONENTS = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];

export function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  const SceneComponent = SCENE_COMPONENTS[currentScene] ?? Scene1;

  // Scenes 2-6 (index 2..6) show the light UI — all others are dark branding scenes
  const isLight = currentScene >= 2 && currentScene <= 6;

  const bgColor   = isLight ? "hsl(210,40%,98%)" : "hsl(222,47%,11%)";
  const glowMain  = isLight
    ? "radial-gradient(circle, rgba(0,72,244,0.10) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(0,72,244,0.28) 0%, transparent 70%)";
  const glowAccent = isLight
    ? "radial-gradient(circle, rgba(237,125,49,0.08) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(237,125,49,0.22) 0%, transparent 70%)";

  const logoTextClass = "font-display font-bold text-2xl " + (isLight ? "text-foreground" : "text-white");
  const gridBg = isLight
    ? "linear-gradient(to right, rgba(0,72,244,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,72,244,0.06) 1px, transparent 1px)"
    : "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)";

  return (
    <div className="w-full h-screen overflow-hidden relative">

      {/* ── Layer 0: bg_corp.png subtle texture ── */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url(" + import.meta.env.BASE_URL + "bg_corp.png)" }}
        animate={{ scale: [1, 1.08, 1], opacity: isLight ? 0.04 : 0.25 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Layer 1: dynamic background color ── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* ── Layer 2: grid overlay ── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundImage: gridBg, backgroundSize: "60px 60px" }}
        transition={{ duration: 1.2 }}
      />

      {/* ── Layer 3: primary glow blob ── */}
      <motion.div
        className="absolute w-[60vw] h-[60vw] rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          background: glowMain,
          x: currentScene % 2 === 0 ? "50vw" : "-10vw",
          y: currentScene % 3 === 0 ? "-20vh" : "40vh",
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
      />

      {/* ── Layer 4: accent orange glow ── */}
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          background: glowAccent,
          x: currentScene % 2 === 0 ? "-10vw" : "60vw",
          y: currentScene % 3 === 0 ? "50vh" : "-10vh",
        }}
        transition={{ duration: 7, ease: "easeInOut" }}
      />

      {/* ── Persistent brand logo (hidden on intro/outro) ── */}
      <motion.div
        className="absolute top-8 left-10 z-50 flex items-center gap-3"
        animate={{
          opacity: currentScene === 0 || currentScene === 7 ? 0 : 1,
          y: currentScene === 0 || currentScene === 7 ? -20 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(0,72,244,0.4)]">
          V
        </div>
        <span className={logoTextClass}>Вектор</span>
      </motion.div>

      {/* ── Scene content ── */}
      <div className="relative w-full h-full z-10">
        <AnimatePresence mode="popLayout">
          <SceneComponent key={currentScene} />
        </AnimatePresence>
      </div>
    </div>
  );
}
