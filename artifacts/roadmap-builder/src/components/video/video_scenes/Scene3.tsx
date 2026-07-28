import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const stages = ["Подготовка", "Разработка", "Тестирование", "Запуск"];
  const projects = ["Интеграция API", "Дашборд аналитики", "Мобильное приложение"];

  const statuses = [
    ["complete", "complete", "progress", "planned"],
    ["complete", "progress", "planned", "planned"],
    ["progress", "planned", "planned", "planned"],
  ];

  const statusColors: Record<string, string> = {
    complete: "#00B8A9",
    progress: "#ED7D31",
    planned: "#E8EBF0",
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[8vw]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
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
        Вид «По этапам»
      </motion.h2>

      {/* Stage table */}
      <motion.div
        className="w-full max-w-[75vw] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Table header */}
        <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
          <div className="p-[1.5vw] text-[1.2vw] font-semibold text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
            Проект
          </div>
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="p-[1.5vw] text-[1.2vw] font-semibold text-[#44546A] text-center border-l border-gray-200"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {stage}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {projects.map((project, rowIdx) => (
          <motion.div
            key={rowIdx}
            className="grid grid-cols-5 border-b border-gray-100 last:border-b-0"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, delay: rowIdx * 0.15 }}
          >
            <div className="p-[1.5vw] text-[1.1vw] font-medium text-[#44546A]" style={{ fontFamily: "var(--font-body)" }}>
              {project}
            </div>
            {statuses[rowIdx].map((status, colIdx) => (
              <motion.div
                key={colIdx}
                className="p-[1.5vw] border-l border-gray-100 flex items-center justify-center"
                initial={{ backgroundColor: "#F8F9FA" }}
                animate={{ backgroundColor: statusColors[status] }}
                transition={{ duration: 0.5, delay: 0.5 + colIdx * 0.1 }}
              >
                <div
                  className="w-[2vw] h-[2vw] rounded-full shadow-sm"
                  style={{
                    backgroundColor: status === "planned" ? "#C4C9D1" : "white",
                    opacity: status === "planned" ? 0.5 : 1,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mt-[2vh] flex gap-[3vw]"
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        {[
          { label: "Завершено", color: "#00B8A9" },
          { label: "В работе", color: "#ED7D31" },
          { label: "Запланировано", color: "#E8EBF0" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-[0.5vw]">
            <div className="w-[1vw] h-[1vw] rounded" style={{ backgroundColor: item.color }} />
            <span className="text-[1vw] text-gray-600" style={{ fontFamily: "var(--font-body)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
