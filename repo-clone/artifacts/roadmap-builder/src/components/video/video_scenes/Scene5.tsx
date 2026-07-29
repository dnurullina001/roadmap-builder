import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000); // Card appears
    const t3 = setTimeout(() => setPhase(3), 1800); // Assignees pop in
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const assignees = [
    { role: "PM", name: "Менеджер", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { role: "AN", name: "Аналитик", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { role: "DEV", name: "Разработка", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { role: "QA", name: "Тестирование", color: "bg-teal-100 text-teal-700 border-teal-200" }
  ];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HEADLINE */}
      <div className="absolute top-20 left-0 w-full flex justify-center z-20 overflow-hidden">
        <motion.h2
          className="font-display font-bold text-[56px] text-foreground"
          initial={{ y: 80 }}
          animate={phase >= 1 ? { y: 0 } : { y: 80 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          Точечное распределение ресурсов
        </motion.h2>
      </div>

      {/* BIG TASK CARD */}
      <motion.div
        className="w-[800px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-border p-10 relative z-10"
        initial={{ y: 100, scale: 0.8, opacity: 0 }}
        animate={phase >= 2 ? { y: 0, scale: 1, opacity: 1 } : { y: 100, scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            T-42
          </div>
          <div>
            <h3 className="font-display font-bold text-3xl text-foreground mb-1">Проектирование архитектуры</h3>
            <p className="text-muted-foreground text-lg">Backend API v2.0</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-border mb-8" />

        <h4 className="font-semibold text-muted-foreground mb-6 text-xl">Исполнители</h4>
        
        <div className="flex gap-4">
          {assignees.map((assignee, i) => (
            <motion.div
              key={i}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border flex-1 \${assignee.color}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={phase >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 250, 
                damping: 18, 
                delay: i * 0.15 + (phase >= 3 ? 0 : 10) // wait until phase 3
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center font-bold text-xl mb-3 shadow-sm">
                {assignee.role}
              </div>
              <span className="font-semibold text-sm">{assignee.name}</span>
            </motion.div>
          ))}
          
          {/* Add Button */}
          <motion.div
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/10 flex-1 text-muted-foreground cursor-pointer"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: assignees.length * 0.15 + 0.3 }}
          >
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center font-bold text-2xl mb-3 shadow-sm border border-border">
              +
            </div>
            <span className="font-semibold text-sm">Добавить</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating abstract avatars in background */}
      {assignees.map((assignee, i) => (
        <motion.div
          key={`bg-\${i}`}
          className={`absolute w-24 h-24 rounded-full filter blur-[2px] opacity-20 flex items-center justify-center text-4xl font-bold \${assignee.color}`}
          initial={{ 
            x: i % 2 === 0 ? "-30vw" : "30vw", 
            y: i < 2 ? "-20vh" : "20vh",
            scale: 0
          }}
          animate={phase >= 2 ? {
            x: i % 2 === 0 ? "-40vw" : "40vw", 
            y: i < 2 ? "-30vh" : "30vh",
            scale: 1,
            rotate: i % 2 === 0 ? 15 : -15
          } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {assignee.role}
        </motion.div>
      ))}

    </motion.div>
  );
}