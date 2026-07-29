import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1500); // UI reveals
    const t3 = setTimeout(() => setPhase(3), 2500); // Cards pop in
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const streams = ["Frontend", "Backend", "Design", "DevOps"];
  const months = ["Июль", "Август", "Сентябрь", "Октябрь"];

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center pt-20 px-24 relative"
      initial={{ x: "100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
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
          Наведи порядок с <span className="text-primary">картой потоков</span>
        </motion.h2>
      </div>

      {/* APP UI MOCKUP */}
      <motion.div
        className="w-full max-w-[1400px] flex-1 bg-white rounded-t-3xl shadow-[0_0_50px_rgba(0,72,244,0.15)] border border-border flex flex-col overflow-hidden relative z-10"
        initial={{ y: "100%", opacity: 0 }}
        animate={phase >= 2 ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* HEADER / TOOLBAR */}
        <div className="h-16 border-b border-border bg-muted/30 flex items-center px-6 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          <div className="h-8 px-4 bg-white rounded-md border border-border flex items-center ml-4 text-sm font-medium">
            Вид: По потокам
          </div>
        </div>

        {/* TIMELINE HEADER */}
        <div className="flex border-b border-border bg-white h-12">
          <div className="w-[200px] shrink-0 border-r border-border bg-muted/10"></div>
          {months.map((m, i) => (
            <div key={i} className="flex-1 border-r border-border flex items-center px-4 font-semibold text-muted-foreground">
              {m}
            </div>
          ))}
        </div>

        {/* SWIMLANE BODY */}
        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
          {streams.map((stream, i) => (
            <div key={i} className="flex-1 border-b border-border flex relative group">
              {/* Stream Title */}
              <div className="w-[200px] shrink-0 border-r border-border bg-muted/10 flex items-center px-6 font-display font-bold text-lg text-secondary-foreground z-10">
                {stream}
              </div>
              {/* Columns */}
              <div className="flex-1 flex relative">
                {months.map((_, colIdx) => (
                  <div key={colIdx} className="flex-1 border-r border-border border-dashed opacity-50" />
                ))}
                
                {/* SAMPLE CARDS per stream */}
                {phase >= 3 && i === 0 && (
                  <TaskCard title="UI Kit Redesign" start={0.2} width={1.5} color="bg-primary text-white" delay={0.2} />
                )}
                {phase >= 3 && i === 0 && (
                  <TaskCard title="Dashboard" start={1.8} width={1} color="bg-muted text-foreground border border-border" delay={0.4} />
                )}
                {phase >= 3 && i === 1 && (
                  <TaskCard title="API Gateway v2" start={0.5} width={2} color="bg-accent text-white" delay={0.5} />
                )}
                {phase >= 3 && i === 2 && (
                  <TaskCard title="User Research" start={0} width={1.2} color="bg-teal-500 text-white" delay={0.3} />
                )}
                {phase >= 3 && i === 3 && (
                  <TaskCard title="CI/CD Pipeline" start={1.5} width={1.5} color="bg-purple-500 text-white" delay={0.6} />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TaskCard({ title, start, width, color, delay }: { title: string, start: number, width: number, color: string, delay: number }) {
  return (
    <motion.div
      className={\`absolute top-4 bottom-4 rounded-xl shadow-sm flex items-center px-4 font-medium \${color}\`}
      style={{
        left: \`\${start * 25}%\`,
        width: \`\${width * 25}%\`,
      }}
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
    >
      <span className="truncate">{title}</span>
    </motion.div>
  );
}