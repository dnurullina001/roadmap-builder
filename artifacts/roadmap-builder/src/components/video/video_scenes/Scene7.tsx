import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene7() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.6 }}
    >
      {/* Centered content */}
      <div className="text-center">
        {/* Logo icon */}
        <motion.div
          className="mx-auto mb-[3vh]"
          initial={{ scale: 0, rotate: 180 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 180 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        >
          <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
            <path
              d="M30 20 L60 80 L90 20"
              stroke="white"
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

        {/* Brand name */}
        <motion.h1
          className="text-[7vw] font-bold mb-[2vh] text-white"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Вектор
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-[2.2vw] font-medium text-white/90"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Ваша стратегия — ясно и по делу.
        </motion.p>

        {/* Decorative accent line */}
        <motion.div
          className="mx-auto mt-[3vh] h-[0.3vh] bg-gradient-to-r from-transparent via-white to-transparent"
          style={{ width: "50%" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={phase >= 3 ? { scaleX: 1, opacity: 0.5 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1vw] h-[1vw] rounded-full bg-white/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
}
