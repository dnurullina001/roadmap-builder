import { AnimatePresence } from "framer-motion";
import { useVideoPlayer } from "@/lib/video/hooks";
import { Scene1 } from "./video_scenes/Scene1";
import { Scene2 } from "./video_scenes/Scene2";
import { Scene3 } from "./video_scenes/Scene3";
import { Scene4 } from "./video_scenes/Scene4";
import { Scene5 } from "./video_scenes/Scene5";
import { Scene6 } from "./video_scenes/Scene6";
import { useEffect, useRef } from "react";

const SCENE_DURATIONS = {
  intro: 5000,
  streams: 10000,
  stages: 9000,
  editing: 5500,
  versions: 5000,
  export: 6000,
};

const TOTAL_DURATION_MS = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Generates a gentle ambient background chord using Web Audio API.
// Uses three sine oscillators (C3, E3, G3) with slow panning and a gain envelope.
function useAmbientMusic() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let ctx: AudioContext | null = null;
    let masterGain: GainNode | null = null;
    const oscillators: OscillatorNode[] = [];
    let stopped = false;

    const start = () => {
      if (stopped) return;
      try {
        ctx = new AudioContext();
        audioCtxRef.current = ctx;
        masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 2.5); // fade in
        masterGain.connect(ctx.destination);

        // Soft chord: C3, G3, E4 — pure sine gives a calm, neutral tone
        const frequencies = [130.81, 196.0, 329.63, 261.63];
        const detunes   =  [0,      3,      -3,      5]; // slight chorus
        const gains     =  [0.25,   0.20,   0.18,   0.15];

        frequencies.forEach((freq, i) => {
          const osc = ctx!.createOscillator();
          const oscGain = ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.detune.value = detunes[i];
          oscGain.gain.value = gains[i];
          osc.connect(oscGain);
          oscGain.connect(masterGain!);
          osc.start();
          oscillators.push(osc);
        });

        // Schedule a gentle fade-out at the end of the video
        const fadeStartSec = TOTAL_DURATION_MS / 1000 - 2.5;
        masterGain.gain.setValueAtTime(0.07, ctx.currentTime + Math.max(fadeStartSec, 3));
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + TOTAL_DURATION_MS / 1000);
      } catch {
        // AudioContext blocked or unavailable — continue silently
      }
    };

    // Try to start immediately; retry on first user interaction if blocked
    try {
      start();
      if (ctx && ctx.state === 'suspended') {
        const resume = () => {
          ctx?.resume();
          document.removeEventListener('click', resume);
          document.removeEventListener('keydown', resume);
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      }
    } catch {
      const onInteraction = () => {
        start();
        document.removeEventListener('click', onInteraction);
        document.removeEventListener('keydown', onInteraction);
      };
      document.addEventListener('click', onInteraction, { once: true });
      document.addEventListener('keydown', onInteraction, { once: true });
    }

    return () => {
      stopped = true;
      oscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      ctx?.close().catch(() => {});
    };
  }, []);
}

export function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });
  useAmbientMusic();

  return (
    // Fixed 16:9 container prevents squishing when viewport dimensions vary
    <div
      className="relative overflow-hidden bg-[#F8F9FA]"
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        aspectRatio: '16 / 9',
      }}
    >
      {/* Persistent background gradient that shifts per scene */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background:
            currentScene === 0
              ? "linear-gradient(135deg, #F8F9FA 0%, #E8EBF0 100%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
        }}
      />

      {/* Persistent accent shape */}
      <div
        className="absolute w-[30vw] h-[30vw] rounded-full transition-all duration-1200 ease-out pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,72,244,0.08) 0%, transparent 70%)",
          left: currentScene === 0 ? "50%" : "-10%",
          top: currentScene === 0 ? "20%" : "10%",
          transform: `translate(-50%, -50%) scale(${currentScene === 0 ? 1.5 : 0.8})`,
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
      </AnimatePresence>
    </div>
  );
}
