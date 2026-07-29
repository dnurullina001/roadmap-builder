import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000); // Logo reveals
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center relative bg-transparent text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="overflow-hidden mb-16">
        <motion.h2
          className="font-display font-bold text-[72px] text-white text-center leading-tight"
          initial={{ y: 100, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          Готово к показу<br/>
          <span className="text-primary">заказчику</span>
        </motion.h2>
      </div>

      {/* BIG LOGO */}
      <motion.div
        className="flex items-center gap-6"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={phase >= 2 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center font-display font-bold text-[48px] text-white shadow-[0_0_60px_rgba(0,72,244,0.5)]">
          V
        </div>
        <span className="font-display font-bold text-[64px] tracking-tight text-white">Вектор</span>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className="mt-16 px-10 py-5 bg-white text-primary rounded-full font-bold text-2xl shadow-xl cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.05 }}
      >
        Создать дорожную карту
      </motion.div>

    </motion.div>
  );
}