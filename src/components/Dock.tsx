import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { FaHome, FaBriefcase, FaTerminal, FaUsers, FaEnvelope } from 'react-icons/fa';

interface DockIconProps {
   mouseX: MotionValue;
   icon: React.ComponentType<{ className?: string }>;
   label: string;
   onClick: () => void;
}

function DockIcon({ mouseX, icon: Icon, label, onClick }: DockIconProps) {
   const ref = React.useRef<HTMLDivElement>(null);

   const distance = useTransform(mouseX, (val: number) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return val - bounds.x - bounds.width / 2;
   });

   const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
   const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

   return (
      <motion.div
         ref={ref}
         style={{ width }}
         className="aspect-square w-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center relative group cursor-pointer hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 backdrop-blur-md"
         onClick={onClick}
         role="button"
         aria-label={label}
         tabIndex={0}
      >
         <Icon className="text-[var(--text-primary)] w-5 h-5 group-hover:text-[var(--accent-color)] transition-colors" />
         <span className="absolute -top-10 px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
         </span>
      </motion.div>
   );
}

interface DockProps {
   onNav: (id: string) => void;
}

export default function Dock({ onNav }: DockProps) {
   const mouseX = useMotionValue(Infinity);
   const items = [
      { icon: FaHome, label: 'Home', id: 'home' },
      { icon: FaBriefcase, label: 'Projects', id: 'projects' },
      { icon: FaTerminal, label: 'Skills', id: 'skills' },
      { icon: FaUsers, label: 'About', id: 'about' },
      { icon: FaEnvelope, label: 'Contact', id: 'contact' },
   ];

   return (
      <motion.div
         initial={{ y: 100 }}
         animate={{ y: 0 }}
         transition={{ type: "spring", stiffness: 260, damping: 20 }}
         className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
         <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="flex items-end gap-2 px-4 py-3 rounded-2xl bg-[var(--bg-card)]/80 border border-[var(--border-color)] backdrop-blur-xl shadow-2xl"
         >
            {items.map((item) => (
               <DockIcon
                  key={item.id}
                  mouseX={mouseX}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => onNav(item.id)}
               />
            ))}
         </motion.div>
      </motion.div>
   );
}