import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2100),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo icon */}
      <motion.div
        className="mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
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
        className="text-[8vw] font-bold tracking-tight text-[#0048F4] leading-none mb-3"
        style={{ fontFamily: "var(--font-display)" }}
        initial={{ opacity: 0, y: 24 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Вектор
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-[1.8vw] font-semibold text-[#0048F4]/80 mb-2 text-center"
        style={{ fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
      >
        Инструмент для быстрого создания дорожной карты
      </motion.p>

      {/* Divider */}
      <motion.div
        className="h-[2px] bg-gradient-to-r from-transparent via-[#0048F4] to-transparent mb-3"
        style={{ width: "36%" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={phase >= 3 ? { scaleX: 1, opacity: 0.35 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />

      {/* Tagline */}
      <motion.p
        className="text-[1.6vw] font-medium text-[#44546A] tracking-widest uppercase"
        style={{ fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5 }}
      >
        Стратегия · Ясность · Движение
      </motion.p>
    </motion.div>
  );
}
