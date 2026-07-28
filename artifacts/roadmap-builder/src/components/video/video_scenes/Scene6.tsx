import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => setPhase(4), 2500),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-[8vw] gap-[5vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left: Browser window mockup */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
        initial={{ opacity: 0, x: -80, rotateY: 10 }}
        animate={phase >= 1 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -80, rotateY: 10 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Browser chrome */}
        <div className="h-[3vh] bg-gray-100 border-b border-gray-200 flex items-center px-[1vw] gap-[0.5vw]">
          <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-red-400" />
          <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-yellow-400" />
          <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-green-400" />
        </div>

        {/* Content */}
        <div className="p-[2vw] space-y-[1.5vh]">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-[2.5vh] bg-gray-100 rounded"
              style={{ width: `${90 - i * 8}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase >= 2 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right: Export animation */}
      <motion.div
        className="w-[35vw] flex flex-col items-center"
        initial={{ opacity: 0, x: 80 }}
        animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Arrow */}
        <motion.div
          className="mb-[3vh]"
          initial={{ x: -30, opacity: 0 }}
          animate={phase >= 3 ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <path
              d="M5 20 L75 20 M60 10 L75 20 L60 30"
              stroke="#0048F4"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* PPTX file icon */}
        <motion.div
          className="relative bg-gradient-to-br from-[#D24726] to-[#B33A1A] rounded-2xl shadow-2xl p-[2vw] w-[18vw] h-[22vh]"
          initial={{ scale: 0, rotate: -10 }}
          animate={phase >= 4 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* PowerPoint icon */}
          <div className="text-white text-center">
            <div className="text-[4vw] font-bold mb-[1vh]" style={{ fontFamily: "var(--font-display)" }}>
              P
            </div>
            <div className="text-[1.2vw] font-medium opacity-90" style={{ fontFamily: "var(--font-body)" }}>
              PPTX
            </div>
          </div>

          {/* Decorative lines */}
          <div className="absolute bottom-[2vh] left-[2vw] right-[2vw] space-y-[0.5vh]">
            <div className="h-[0.3vh] bg-white/40 rounded" />
            <div className="h-[0.3vh] bg-white/40 rounded w-3/4" />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p
          className="mt-[2vh] text-[1.3vw] font-semibold text-[#0048F4]"
          style={{ fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          Экспорт в PowerPoint
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
