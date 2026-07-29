import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1500); // Button click
    const t3 = setTimeout(() => setPhase(3), 2000); // UI shrinks
    const t4 = setTimeout(() => setPhase(4), 2500); // Slides spread
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-20 left-0 w-full flex justify-center z-20 overflow-hidden">
        <motion.h2
          className="font-display font-bold text-[56px] text-foreground"
          initial={{ y: 80 }}
          animate={phase >= 1 ? { y: 0 } : { y: 80 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          Мгновенный экспорт для презентаций
        </motion.h2>
      </div>

      <div className="relative w-full h-[600px] flex items-center justify-center mt-20">
        
        {/* EXPORT BUTTON */}
        <motion.div
          className="absolute z-50 bg-accent text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg flex items-center gap-3 cursor-pointer"
          initial={{ scale: 0, y: 100 }}
          animate={
            phase >= 3 ? { scale: 0, opacity: 0 } : 
            phase >= 2 ? { scale: 0.95 } : // Click effect
            phase >= 1 ? { scale: 1, y: 0 } : 
            { scale: 0, y: 100 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 13L12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 17V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Экспорт в PPTX
        </motion.div>

        {/* FAKE CURSOR */}
        <motion.div
          className="absolute z-[60] w-6 h-6"
          initial={{ x: 200, y: 300, opacity: 0 }}
          animate={
            phase >= 3 ? { opacity: 0 } :
            phase >= 2 ? { x: 20, y: 20, scale: 0.8, opacity: 1 } :
            phase >= 1 ? { x: 0, y: 0, opacity: 1 } :
            { x: 200, y: 300, opacity: 0 }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path fill="white" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
          </svg>
        </motion.div>

        {/* SLIDES */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Slide 1 */}
          <Slide index={0} phase={phase} />
          {/* Slide 2 */}
          <Slide index={1} phase={phase} />
          {/* Slide 3 */}
          <Slide index={2} phase={phase} />
        </div>

      </div>
    </motion.div>
  );
}

function Slide({ index, phase }: { index: number, phase: number }) {
  const getTransform = () => {
    if (phase < 3) return { scale: 0, opacity: 0, x: 0, rotate: 0 };
    if (phase === 3) return { scale: 0.8, opacity: 1, x: 0, rotate: 0 };
    
    // phase 4: spread out
    if (index === 0) return { scale: 0.8, opacity: 1, x: -450, rotate: -10 };
    if (index === 1) return { scale: 0.9, opacity: 1, x: 0, rotate: 0, zIndex: 10 };
    if (index === 2) return { scale: 0.8, opacity: 1, x: 450, rotate: 10 };
  };

  return (
    <motion.div
      className="absolute w-[600px] h-[337px] bg-white rounded-lg shadow-2xl border-4 border-muted overflow-hidden flex flex-col"
      initial={{ scale: 0, opacity: 0 }}
      animate={getTransform()}
      transition={{ 
        type: "spring", 
        stiffness: phase === 4 ? 120 : 200, 
        damping: 15,
        delay: phase === 4 ? index * 0.1 : 0
      }}
    >
      {/* PPTX Header fake */}
      <div className="h-12 bg-primary/10 border-b flex items-center px-6">
        <div className="w-1/2 h-4 bg-primary/20 rounded" />
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="w-3/4 h-8 bg-muted rounded" />
        <div className="flex-1 bg-muted/30 rounded flex items-center justify-center relative overflow-hidden">
          {/* Fake Gantt bars */}
          <div className="absolute top-4 left-4 w-1/3 h-6 bg-blue-400 rounded-sm" />
          <div className="absolute top-12 left-1/4 w-1/2 h-6 bg-teal-400 rounded-sm" />
          <div className="absolute top-20 left-1/2 w-1/3 h-6 bg-accent rounded-sm" />
        </div>
      </div>
    </motion.div>
  );
}