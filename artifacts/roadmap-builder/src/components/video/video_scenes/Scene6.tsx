import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000); // Timeline base
    const t3 = setTimeout(() => setPhase(3), 1500); // Milestones pop
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const milestones = [
    { label: "Design Freeze", delay: 0, x: 20, color: "text-purple-600", bg: "bg-purple-600" },
    { label: "MVP Release", delay: 0.3, x: 50, color: "text-accent", bg: "bg-accent" },
    { label: "Beta Testing", delay: 0.6, x: 75, color: "text-teal-500", bg: "bg-teal-500" },
    { label: "V1 Launch", delay: 0.9, x: 95, color: "text-primary", bg: "bg-primary" },
  ];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: "-100vw", opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-20 left-0 w-full flex justify-center z-20 overflow-hidden">
        <motion.h2
          className="font-display font-bold text-[56px] text-foreground"
          initial={{ y: 80 }}
          animate={phase >= 1 ? { y: 0 } : { y: 80 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          Ключевые вехи всегда на виду
        </motion.h2>
      </div>

      {/* TIMELINE UI */}
      <div className="w-[1000px] h-[300px] relative mt-20 flex items-center">
        
        {/* BASE LINE */}
        <motion.div
          className="absolute left-0 right-0 h-2 bg-muted rounded-full"
          initial={{ scaleX: 0 }}
          animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />

        {/* PROGRESS LINE */}
        <motion.div
          className="absolute left-0 h-2 bg-gradient-to-r from-primary/50 to-primary rounded-full"
          initial={{ width: "0%" }}
          animate={phase >= 3 ? { width: "60%" } : { width: "0%" }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />

        {/* MILESTONES */}
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: \`\${m.x}%\` }}
            initial={{ opacity: 0, scale: 0, y: "-50%" }}
            animate={phase >= 3 ? { opacity: 1, scale: 1, y: "-50%" } : { opacity: 0, scale: 0, y: "-50%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15, 
              delay: m.delay + 0.2
            }}
          >
            {/* Flag line */}
            <div className="w-[2px] h-16 bg-border absolute bottom-full mb-2 origin-bottom scale-y-0"
              style={{
                animation: phase >= 3 ? \`scaleUp 0.3s ease-out forwards \${m.delay + 0.3}s\` : "none"
              }}
            />
            {/* Diamond */}
            <div className={\`w-8 h-8 rotate-45 border-4 border-white shadow-md \${m.bg} relative z-10 flex items-center justify-center\`} />
            
            {/* Label */}
            <motion.div 
              className={\`absolute bottom-[calc(100%+80px)] whitespace-nowrap font-bold text-2xl \${m.color}\`}
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: m.delay + 0.5 }}
            >
              {m.label}
            </motion.div>
          </motion.div>
        ))}
        
        <style>{`
          @keyframes scaleUp {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
          }
        `}</style>
      </div>

    </motion.div>
  );
}