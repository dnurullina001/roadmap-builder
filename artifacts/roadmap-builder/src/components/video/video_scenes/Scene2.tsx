import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 2400),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const streams = [
    { name: "Интеграция", color: "#0048F4", owner: "ПМ" },
    { name: "Аналитика", color: "#ED7D31", owner: "АН" },
    { name: "Разработка", color: "#00B8A9", owner: "РА" },
    { name: "Тестирование", color: "#9D4EDD", owner: "ТЕ" },
  ];

  const tasks = [
    { stream: 0, left: "10%", width: "25%", delay: 0 },
    { stream: 0, left: "40%", width: "30%", delay: 0.1 },
    { stream: 1, left: "15%", width: "35%", delay: 0.2 },
    { stream: 1, left: "55%", width: "20%", delay: 0.3 },
    { stream: 2, left: "8%", width: "40%", delay: 0.4 },
    { stream: 2, left: "52%", width: "28%", delay: 0.5 },
    { stream: 3, left: "20%", width: "35%", delay: 0.6 },
    { stream: 3, left: "60%", width: "25%", delay: 0.7 },
  ];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8vw]"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title */}
      <motion.h2
        className="text-[3.5vw] font-bold text-[#0048F4] mb-[3vh]"
        style={{ fontFamily: "var(--font-display)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        Вид «По потокам»
      </motion.h2>

      {/* Gantt chart container */}
      <div className="w-full max-w-[80vw] bg-white rounded-xl shadow-lg p-[2vw] border border-gray-200">
        {/* Timeline header with milestones */}
        <motion.div
          className="flex justify-between mb-[2vh] pb-[1vh] border-b border-gray-200"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={phase >= 2 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-[1vw]">
            <div className="text-[1.2vw] font-semibold text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
              Q1
            </div>
            <motion.div
              className="w-[1.5vw] h-[1.5vw]"
              initial={{ scale: 0 }}
              animate={phase >= 2 ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
            >
              <svg viewBox="0 0 24 24" fill="#ED7D31">
                <path d="M14 2l-8 8 8 8V2z" />
              </svg>
            </motion.div>
          </div>
          <div className="text-[1vw] text-gray-500">Янв — Фев — Мар</div>
        </motion.div>

        {/* Streams with tasks */}
        <div className="space-y-[2vh]">
          {streams.map((stream, idx) => (
            <motion.div
              key={idx}
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              {/* Stream label */}
              <div className="flex items-center gap-[1vw] mb-[0.8vh]">
                <div
                  className="w-[0.4vw] h-[0.4vw] rounded-full"
                  style={{ backgroundColor: stream.color }}
                />
                <div className="text-[1.3vw] font-semibold text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
                  {stream.name}
                </div>
                <div
                  className="px-[0.6vw] py-[0.2vh] rounded-full text-[0.9vw] font-medium"
                  style={{
                    backgroundColor: `${stream.color}20`,
                    color: stream.color,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {stream.owner}
                </div>
              </div>

              {/* Timeline track */}
              <div className="relative h-[3vh] bg-gray-50 rounded">
                {tasks
                  .filter((t) => t.stream === idx)
                  .map((task, taskIdx) => (
                    <motion.div
                      key={taskIdx}
                      className="absolute h-full rounded shadow-sm"
                      style={{
                        left: task.left,
                        width: task.width,
                        backgroundColor: stream.color,
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={phase >= 4 ? { scaleX: 1, opacity: 0.85 } : { scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.4, delay: task.delay, ease: "easeOut" }}
                    />
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <motion.p
        className="mt-[2vh] text-[1.2vw] text-gray-600"
        style={{ fontFamily: "var(--font-body)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
      >
        Горизонтальная временная шкала с задачами и вехами
      </motion.p>
    </motion.div>
  );
}
