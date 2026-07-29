import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200); // UI reveals
    const t3 = setTimeout(() => setPhase(3), 2000); // Status cells pop in
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const stages = ["Discovery", "Alpha", "Beta", "Release"];
  const tasks = ["Анализ конкурентов", "Проектирование БД", "Дизайн системы", "API Интеграция", "Нагрузочное тестирование"];

  // Status mapping
  // 0: backlog, 1: dev, 2: done, 3: delay
  const matrix = [
    [2, 2, 1, 0], // task 1
    [2, 1, 0, 0], // task 2
    [2, 2, 2, 1], // task 3
    [0, 1, 1, 0], // task 4
    [0, 0, 3, 1], // task 5
  ];

  const getStatusColor = (status: number) => {
    switch(status) {
      case 2: return "bg-emerald-100 text-emerald-700 border-emerald-200"; // Готово
      case 1: return "bg-blue-100 text-blue-700 border-blue-200";       // В работе
      case 3: return "bg-red-100 text-red-700 border-red-200";          // Задержка
      default: return "bg-gray-100 text-gray-500 border-gray-200";      // Бэклог
    }
  };

  const getStatusText = (status: number) => {
    switch(status) {
      case 2: return "Готово";
      case 1: return "В работе";
      case 3: return "Задержка";
      default: return "Бэклог";
    }
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center pt-20 px-24 relative"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ y: "-100vh", opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HEADLINE */}
      <div className="overflow-hidden mb-12 flex-shrink-0 z-20">
        <motion.h2
          className="font-display font-bold text-[64px] text-foreground"
          initial={{ y: 100 }}
          animate={phase >= 1 ? { y: 0 } : { y: 100 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          Или планируй <span className="text-primary">по этапам</span>
        </motion.h2>
      </div>

      {/* APP UI MOCKUP */}
      <motion.div
        className="w-full max-w-[1400px] flex-1 bg-white rounded-t-3xl shadow-[0_0_50px_rgba(0,72,244,0.15)] border border-border flex flex-col overflow-hidden relative z-10"
        initial={{ y: "10vh", opacity: 0, rotateX: -10 }}
        animate={phase >= 2 ? { y: 0, opacity: 1, rotateX: 0 } : { y: "10vh", opacity: 0, rotateX: -10 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ transformOrigin: "bottom" }}
      >
        {/* HEADER / TOOLBAR */}
        <div className="h-16 border-b border-border bg-muted/30 flex items-center px-6 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          <div className="h-8 px-4 bg-white rounded-md border border-border flex items-center ml-4 text-sm font-medium">
            Вид: По этапам
          </div>
        </div>

        {/* TIMELINE HEADER */}
        <div className="flex border-b border-border bg-white h-14">
          <div className="w-[300px] shrink-0 border-r border-border bg-muted/10 flex items-center px-6 font-semibold text-muted-foreground">
            Задачи
          </div>
          {stages.map((stage, i) => (
            <div key={i} className="flex-1 border-r border-border flex items-center justify-center font-display font-bold text-lg text-secondary-foreground">
              {stage}
            </div>
          ))}
        </div>

        {/* PHASE BODY */}
        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
          {tasks.map((task, i) => (
            <div key={i} className="flex-1 border-b border-border flex relative group hover:bg-muted/20 transition-colors">
              {/* Task Title */}
              <div className="w-[300px] shrink-0 border-r border-border flex items-center px-6 font-medium text-foreground z-10">
                {task}
              </div>
              {/* Columns */}
              <div className="flex-1 flex relative">
                {stages.map((_, colIdx) => (
                  <div key={colIdx} className="flex-1 border-r border-border p-3">
                    {phase >= 3 && matrix[i][colIdx] !== 0 && (
                      <motion.div
                        className={`w-full h-full rounded-lg border flex items-center justify-center font-semibold text-sm \${getStatusColor(matrix[i][colIdx])}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20, 
                          delay: (i * 0.1) + (colIdx * 0.1) 
                        }}
                      >
                        {getStatusText(matrix[i][colIdx])}
                      </motion.div>
                    )}
                    {phase >= 3 && matrix[i][colIdx] === 0 && (
                      <motion.div
                        className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        —
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}