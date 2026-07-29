import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 2000); // Cards start snapping
    const t3 = setTimeout(() => setPhase(3), 4500); // Exit prep
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const text = "Сложно показать план команде и заказчику?";
  const words = text.split(" ");

  // Generate chaotic starting positions for 5 abstract cards
  const cards = [
    { start: { x: -300, y: -200, r: -45 }, color: "bg-white/10" },
    { start: { x: 200, y: -150, r: 25 }, color: "bg-white/10" },
    { start: { x: -100, y: 200, r: 60 }, color: "bg-white/10" },
    { start: { x: 300, y: 150, r: -15 }, color: "bg-white/10" },
    { start: { x: 0, y: -50, r: -10 }, color: "bg-accent/40" },
  ];

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center relative bg-transparent text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "-100vw", filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      
      {/* CHAOTIC CARDS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className={`absolute w-64 h-24 rounded-2xl border border-white/20 backdrop-blur-md \${card.color}`}
            initial={{ 
              x: card.start.x * 2, 
              y: card.start.y * 2, 
              rotate: card.start.r * 2,
              opacity: 0,
              scale: 0.5
            }}
            animate={
              phase >= 2 ? {
                x: (i - 2) * 280, // Spread evenly in a row
                y: 150,           // Move down
                rotate: 0,
                opacity: 0.3,
                scale: 0.8
              } : phase >= 1 ? { 
                x: card.start.x, 
                y: card.start.y, 
                rotate: card.start.r,
                opacity: 1,
                scale: 1
              } : {}
            }
            transition={{ 
              type: "spring", 
              stiffness: phase >= 2 ? 150 : 80, 
              damping: phase >= 2 ? 20 : 15,
              delay: phase >= 2 ? i * 0.1 : i * 0.15 
            }}
          >
            {/* Fake content */}
            <div className="w-1/2 h-3 bg-white/20 rounded-full m-4 mt-6"></div>
            <div className="w-3/4 h-3 bg-white/10 rounded-full m-4"></div>
          </motion.div>
        ))}
      </div>

      {/* TEXT */}
      <div className="relative z-10 flex flex-wrap justify-center max-w-[1200px] gap-x-6 gap-y-4 px-20 text-center">
        {words.map((word, i) => (
          <motion.div
            key={i}
            className="overflow-hidden"
          >
            <motion.span
              className="inline-block font-display font-bold text-[72px] leading-tight"
              initial={{ y: 80, rotate: 10, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, rotate: 0, opacity: 1 } : { y: 80, rotate: 10, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20, 
                delay: i * 0.1 + 0.5 
              }}
            >
              {word}
            </motion.span>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}