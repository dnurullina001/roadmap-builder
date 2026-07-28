import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2200),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-[8vw] gap-[4vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left: Main roadmap view (simplified) */}
      <motion.div
        className="flex-1 bg-white rounded-lg shadow-md p-[2vw] border border-gray-200"
        initial={{ opacity: 0, x: -100 }}
        animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-[1.5vh]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[3vh] bg-gray-100 rounded" />
          ))}
        </div>
      </motion.div>

      {/* Right: Sidebar panel */}
      <motion.div
        className="w-[35vw] bg-white rounded-xl shadow-xl p-[2.5vw] border-2 border-[#0048F4]"
        initial={{ opacity: 0, x: 100, rotateY: -15 }}
        animate={phase >= 2 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: 100, rotateY: -15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Panel header */}
        <motion.h3
          className="text-[2vw] font-bold text-[#0048F4] mb-[2vh]"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: -10 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          Редактирование
        </motion.h3>

        {/* Form fields */}
        <motion.div
          className="space-y-[2vh]"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Name field */}
          <div>
            <div className="text-[0.9vw] font-medium text-gray-600 mb-[0.5vh]" style={{ fontFamily: "var(--font-body)" }}>
              Название задачи
            </div>
            <motion.div
              className="h-[4vh] bg-gray-50 border-2 border-gray-200 rounded-lg px-[1vw] flex items-center"
              whileHover={{ borderColor: "#0048F4" }}
            >
              <span className="text-[1vw] text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
                Интеграция API
              </span>
            </motion.div>
          </div>

          {/* Period fields */}
          <div className="grid grid-cols-2 gap-[1vw]">
            <div>
              <div className="text-[0.9vw] font-medium text-gray-600 mb-[0.5vh]" style={{ fontFamily: "var(--font-body)" }}>
                Начало
              </div>
              <div className="h-[4vh] bg-gray-50 border-2 border-gray-200 rounded-lg px-[1vw] flex items-center">
                <span className="text-[1vw] text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
                  15.01.24
                </span>
              </div>
            </div>
            <div>
              <div className="text-[0.9vw] font-medium text-gray-600 mb-[0.5vh]" style={{ fontFamily: "var(--font-body)" }}>
                Конец
              </div>
              <div className="h-[4vh] bg-gray-50 border-2 border-gray-200 rounded-lg px-[1vw] flex items-center">
                <span className="text-[1vw] text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
                  28.02.24
                </span>
              </div>
            </div>
          </div>

          {/* Add task button */}
          <motion.div
            className="mt-[2vh] h-[5vh] bg-[#0048F4] rounded-lg flex items-center justify-center text-white font-semibold text-[1.1vw] shadow-lg"
            style={{ fontFamily: "var(--font-body)" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={phase >= 4 ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 20 }}
          >
            + Добавить задачу
          </motion.div>
        </motion.div>

        {/* Decorative accent */}
        <motion.div
          className="absolute -top-[0.3vw] -right-[0.3vw] w-[2vw] h-[2vw] bg-[#ED7D31] rounded-full"
          initial={{ scale: 0 }}
          animate={phase >= 2 ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
        />
      </motion.div>
    </motion.div>
  );
}
