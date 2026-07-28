import { useEffect, useRef, useState } from "react";

/**
 * Video player hook that manages scene progression and recording lifecycle.
 * Do NOT modify this file -- the export pipeline depends on its exact implementation.
 */
export function useVideoPlayer(sceneDurations: number[]) {
  const [currentScene, setCurrentScene] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const recordingStartedRef = useRef(false);

  useEffect(() => {
    // Start recording on first render
    if (!recordingStartedRef.current && typeof window !== 'undefined' && window.startRecording) {
      window.startRecording();
      recordingStartedRef.current = true;
    }

    const totalDuration = sceneDurations.reduce((sum, duration) => sum + duration, 0);
    
    function tick() {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Calculate which scene should be active
      let accumulatedTime = 0;
      let sceneIndex = 0;
      
      for (let i = 0; i < sceneDurations.length; i++) {
        if (elapsed < accumulatedTime + sceneDurations[i]) {
          sceneIndex = i;
          break;
        }
        accumulatedTime += sceneDurations[i];
      }
      
      // Loop back to start when video completes
      if (elapsed >= totalDuration) {
        startTimeRef.current = Date.now();
        setCurrentScene(0);
      } else {
        setCurrentScene(sceneIndex);
      }
    }

    const interval = setInterval(tick, 1000 / 60); // 60fps
    
    return () => clearInterval(interval);
  }, [sceneDurations]);

  // Stop recording after total duration + 1 second buffer
  useEffect(() => {
    const totalDuration = sceneDurations.reduce((sum, duration) => sum + duration, 0);
    
    const stopTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.stopRecording) {
        window.stopRecording();
      }
    }, totalDuration + 1000);

    return () => clearTimeout(stopTimer);
  }, [sceneDurations]);

  return { currentScene };
}

// Extend window type for recording functions
declare global {
  interface Window {
    startRecording?: () => void;
    stopRecording?: () => void;
  }
}
