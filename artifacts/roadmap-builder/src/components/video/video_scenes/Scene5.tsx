import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const versions = [
    { name: "v2.4 — Текущая", date: "15.01.24", status: "current" },
    { name: "v2.3 — Релиз Q4", date: "12.12.23", status: "saved" },
    { name: "v2.2 — Пилот", date: "03.11.23", status: "saved" },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8vw]"
      initial={{ opacity: 0, rotateX: 10 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, rotateX: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title */}
      <motion.h2
        className="text-[3.5vw] font-bold text-[#0048F4] mb-[3vh]"
        style={{ fontFamily: "var(--font-display)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        Управление версиями
      </motion.h2>

      {/* Version list */}
      <div className="w-full max-w-[60vw] space-y-[2vh]">
        {versions.map((version, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-xl shadow-md p-[2vw] border-2 flex items-center justify-between"
            style={{
              borderColor: version.status === "current" ? "#0048F4" : "#E8EBF0",
            }}
            initial={{ opacity: 0, x: -50, rotateY: -5 }}
            animate={phase >= 2 ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -50, rotateY: -5 }}
            transition={{ duration: 0.5, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-[2vw]">
              {/* Icon */}
              <div
                className="w-[3vw] h-[3vw] rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: version.status === "current" ? "#0048F4" : "#E8EBF0",
                }}
              >
                <svg
                  width="60%"
                  height="60%"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={version.status === "current" ? "white" : "#44546A"}
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>

              {/* Info */}
              <div>
                <div className="text-[1.4vw] font-bold text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
                  {version.name}
                </div>
                <div className="text-[1vw] text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
                  {version.date}
                </div>
              </div>
            </div>

            {/* Status badge */}
            {version.status === "current" && (
              <motion.div
                className="px-[1.5vw] py-[0.8vh] bg-[#00B8A9] text-white rounded-full text-[1vw] font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + idx * 0.15, type: "spring", stiffness: 400, damping: 15 }}
              >
                Активна
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Caption */}
      <motion.p
        className="mt-[3vh] text-[1.2vw] text-gray-600"
        style={{ fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
      >
        Сохраняйте снимки, возвращайтесь к любой версии
      </motion.p>
    </motion.div>
  );
}
