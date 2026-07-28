import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo icon - geometric V shape */}
      <motion.div
        className="absolute"
        initial={{ scale: 0, rotate: -180 }}
        animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path
            d="M30 20 L60 80 L90 20"
            stroke="#0048F4"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M40 50 L60 85 L80 50"
            stroke="#ED7D31"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="absolute text-[8vw] font-bold tracking-tight text-[#0048F4]"
        style={{ fontFamily: "var(--font-display)", top: "58%" }}
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Вектор
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="absolute text-[2vw] font-medium text-[#44546A] tracking-wide"
        style={{ fontFamily: "var(--font-body)", top: "68%" }}
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Стратегия. Ясность. Движение.
      </motion.p>

      {/* Decorative lines */}
      <motion.div
        className="absolute left-[30%] h-[2px] bg-gradient-to-r from-transparent via-[#0048F4] to-transparent"
        style={{ top: "75%", width: "40%" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 3 ? { scaleX: 1, opacity: 0.3 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
}
