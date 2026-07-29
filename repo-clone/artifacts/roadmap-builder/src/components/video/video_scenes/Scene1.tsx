import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const slogan = "Стратегия. Ясность. Движение.";
  const sloganWords = slogan.split(" ");

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-transparent text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative flex flex-col items-center z-10">
        
        {/* LOGO ICON */}
        <motion.div
          className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center font-display font-bold text-7xl text-white shadow-[0_0_80px_rgba(0,72,244,0.6)] relative overflow-hidden"
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div 
            className="absolute inset-0 bg-white/20 skew-x-12"
            initial={{ x: "-150%" }}
            animate={phase >= 1 ? { x: "150%" } : { x: "-150%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
          />
          V
        </motion.div>

        {/* LOGO TEXT */}
        <div className="overflow-hidden mt-8 mb-6 h-[100px]">
          <motion.h1
            className="font-display font-bold text-[80px] tracking-tight leading-none"
            initial={{ y: 100, opacity: 0 }}
            animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.2 }}
          >
            Вектор
          </motion.h1>
        </div>

        {/* SLOGAN */}
        <div className="flex gap-4 text-3xl font-medium text-white/70 overflow-hidden h-12">
          {sloganWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: 40, opacity: 0, rotateX: -90 }}
              animate={phase >= 2 ? { y: 0, opacity: 1, rotateX: 0 } : { y: 40, opacity: 0, rotateX: -90 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20, 
                delay: i * 0.2 + 0.3
              }}
              style={{ transformOrigin: "bottom" }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Decorative background lines crossing behind logo */}
      <motion.div 
        className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/30"
        initial={{ scaleX: 0 }}
        animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-0 left-1/2 w-[1px] h-full bg-primary/30"
        initial={{ scaleY: 0 }}
        animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
    </motion.div>
  );
}