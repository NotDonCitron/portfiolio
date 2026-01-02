import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGhost, FaBriefcase, FaSave, FaGamepad, FaLeaf, FaPalette } from 'react-icons/fa';

const themes = [
   { id: 'cyberpunk', name: 'Cyberpunk', icon: FaGhost, color: 'text-green-500' },
   { id: 'corporate', name: 'Corporate', icon: FaBriefcase, color: 'text-blue-600' },
   { id: 'retro', name: 'Windows 95', icon: FaSave, color: 'text-gray-400' },
   { id: 'gamer', name: 'RGB Gamer', icon: FaGamepad, color: 'text-red-500' },
   { id: 'zen', name: 'Zen Mode', icon: FaLeaf, color: 'text-teal-400' },
] as const;

interface ThemeSwitcherProps {
   current: string;
   set: (t: string) => void;
}

const ThemeSwitcher = ({ current, set }: ThemeSwitcherProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [particles, setParticles] = useState<{ x: number, y: number, id: number, color: string, offsetX: number, offsetY: number }[]>([]);

   const createParticles = () => {
      const colors = ['#10b981', '#0ea5e9', '#ec4899', '#f59e0b', '#8b5cf6'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
         x: Math.random() * 100,
         y: Math.random() * 100,
         id: Date.now() + i,
         color: colors[Math.floor(Math.random() * colors.length)],
         offsetX: (Math.random() - 0.5) * 20,
         offsetY: (Math.random() - 0.5) * 20
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
   };

   const handleThemeChange = (themeId: string) => {
      set(themeId);
      setIsOpen(false);
      createParticles();
   };

   return (
      <>
         {particles.length > 0 && (
            <div className="particle-container">
               {particles.map(p => (
                  <motion.div
                     key={p.id}
                     initial={{ opacity: 1, scale: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
                     animate={{
                        opacity: 0,
                        scale: 2,
                        x: `${p.x + p.offsetX}vw`,
                        y: `${p.y + p.offsetY}vh`
                     }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="absolute w-3 h-3 rounded-full"
                     style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
                  />
               ))}
            </div>
         )}
         <div className="fixed  top-4 right-4 z-50 flex flex-col items-end gap-2">
            <motion.button
               whileHover={{ scale: 1.1, rotate: 180 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setIsOpen(!isOpen)}
               aria-label="Theme auswählen"
               aria-expanded={isOpen}
               className="p-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-all shadow-xl relative overflow-hidden group"
            >
               <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
               />
               <FaPalette className="relative z-10" />
            </motion.button>

            <AnimatePresence>
               {isOpen && (
                  <motion.div
                     initial={{ opacity: 0, x: 20, scale: 0.9 }}
                     animate={{ opacity: 1, x: 0, scale: 1 }}
                     exit={{ opacity: 0, x: 20, scale: 0.9 }}
                     className="flex flex-col gap-2 bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)] backdrop-blur-xl"
                  >
                     {themes.map(t => (
                        <motion.button
                           key={t.id}
                           whileHover={{ scale: 1.05, x: -5 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => handleThemeChange(t.id)}
                           className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/5 ${current === t.id ? 'bg-white/10 border border-[var(--accent-color)]' : ''}`}
                        >
                           <t.icon className={t.color} />
                           <span className="text-xs font-bold text-[var(--text-primary)]">{t.name}</span>
                        </motion.button>
                     ))}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </>
   );
};

export default ThemeSwitcher;