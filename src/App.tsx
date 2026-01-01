import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, useScroll, useSpring as useScrollSpring } from 'framer-motion';
import {
   FaEnvelope,
   FaGhost, FaBriefcase, FaSave, FaGamepad, FaLeaf, FaPalette, FaGlobeAmericas, FaWindows,
   FaLinux, FaDocker, FaNetworkWired, FaPython, FaBrain, FaGitAlt,
   FaRocket, FaServer, FaShieldAlt, FaTerminal
} from 'react-icons/fa';
import {
   SiTypescript, SiReact, SiTailwindcss, SiOpencv, SiOpenai
} from 'react-icons/si';
import AIChat from './components/AIChat';
// Recharts removed

import './index.css';

// --- MacOS Dock Component ---

function DockIcon({ mouseX, icon: Icon, label, onClick }: { mouseX: MotionValue, icon: any, label: string, onClick: () => void }) {
   const ref = useRef<HTMLDivElement>(null);

   const distance = useTransform(mouseX, (val) => {
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
      >
         <Icon className="text-[var(--text-primary)] w-5 h-5 group-hover:text-[var(--accent-color)] transition-colors" />
         <span className="absolute -top-10 px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
         </span>
      </motion.div>
   );
}

const Dock = () => {
   const mouseX = useMotionValue(Infinity);

   const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
   };

   return (
      <motion.div
         onMouseMove={(e) => mouseX.set(e.pageX)}
         onMouseLeave={() => mouseX.set(Infinity)}
         className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 pb-3 flex items-end gap-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-xl z-50 hidden md:flex"
      >
         <DockIcon mouseX={mouseX} icon={FaTerminal} label="Hero" onClick={() => scrollTo('hero')} />
         <DockIcon mouseX={mouseX} icon={FaRocket} label="Timeline" onClick={() => scrollTo('timeline')} />
         <DockIcon mouseX={mouseX} icon={FaServer} label="Projects" onClick={() => scrollTo('projects')} />
         <DockIcon mouseX={mouseX} icon={FaShieldAlt} label="Global Ops" onClick={() => scrollTo('ops')} />
         <DockIcon mouseX={mouseX} icon={FaEnvelope} label="Contact" onClick={() => scrollTo('contact')} />
      </motion.div>
   );
};

// --- Threat Map Component ---

const ThreatMap = () => {
   // Simple grid based map approximation
   const [pings, setPings] = useState<{ x: number, y: number, id: number }[]>([]);

   useEffect(() => {
      const interval = setInterval(() => {
         const x = Math.random() * 100;
         const y = Math.random() * 100;
         const id = Date.now();
         setPings(prev => [...prev, { x, y, id }].slice(-5));
      }, 800);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="w-full h-full relative overflow-hidden opacity-50 hover:opacity-100 transition-opacity duration-500">
         {/* Grid Lines */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

         {/* Central Hub (Germany approx) */}
         <div className="absolute top-[30%] left-[50%] w-4 h-4 bg-[var(--accent-color)] rounded-full animate-ping z-10 shadow-[0_0_20px_var(--accent-color)]"></div>
         <div className="absolute top-[30%] left-[50%] w-2 h-2 bg-white rounded-full z-20"></div>

         {/* Random Pings & Arcs */}
         {pings.map(p => (
            <React.Fragment key={p.id}>
               {/* Attack Source Ping */}
               <div
                  className="absolute w-2 h-2 bg-[var(--accent-color)] rounded-full animate-ping"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
               />

               {/* Svg Arc Line */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                     transition={{ duration: 1.5, ease: "easeInOut" }}
                     d={`M ${p.x * 10} ${p.y * 5} Q 50 30 50 30`}
                     stroke="var(--accent-color)"
                     strokeWidth="1"
                     fill="none"
                  />
                  <line
                     x1={`${p.x}%`} y1={`${p.y}%`}
                     x2="50%" y2="30%"
                     stroke="url(#grad1)"
                     strokeWidth="0.5"
                     className="vector-line"
                  />
                  <defs>
                     <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: 'var(--accent-color)', stopOpacity: 0 }} />
                        <stop offset="100%" style={{ stopColor: 'var(--accent-color)', stopOpacity: 0.5 }} />
                     </linearGradient>
                  </defs>
               </svg>
            </React.Fragment>
         ))}

         {/* Stats Overlay */}
         <div className="absolute top-4 left-4 p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-mono backdrop-blur-md">
            <div className="text-[var(--text-secondary)]">THREAT LEVEL</div>
            <div className="text-xl text-[var(--accent-color)] font-bold animate-pulse">ACTIVE</div>
            <div className="mt-2 text-[var(--text-secondary)]">EVENTS: {pings.length + 12}</div>
            <div className="text-[var(--text-secondary)]">GLOBAL LATENCY: 24ms</div>
         </div>
      </div>
   );
};

// --- Theme Switcher ---

const themes = [
   { id: 'cyberpunk', name: 'Cyberpunk', icon: FaGhost, color: 'text-green-500' },
   { id: 'corporate', name: 'Corporate', icon: FaBriefcase, color: 'text-blue-600' },
   { id: 'retro', name: 'Windows 95', icon: FaSave, color: 'text-gray-400' },
   { id: 'gamer', name: 'RGB Gamer', icon: FaGamepad, color: 'text-red-500' },
   { id: 'zen', name: 'Zen Mode', icon: FaLeaf, color: 'text-teal-400' },
] as const;

const ThemeSwitcher = ({ current, set }: { current: string, set: (t: string) => void }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [particles, setParticles] = useState<{ x: number, y: number, id: number, color: string }[]>([]);

   const createParticles = () => {
      const colors = ['#10b981', '#0ea5e9', '#ec4899', '#f59e0b', '#8b5cf6'];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
         x: Math.random() * 100,
         y: Math.random() * 100,
         id: Date.now() + i,
         color: colors[Math.floor(Math.random() * colors.length)]
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
                        x: `${p.x + (Math.random() - 0.5) * 20}vw`,
                        y: `${p.y + (Math.random() - 0.5) * 20}vh`
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
               className="p-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-all shadow-xl relative overflow-hidden group"
            >
               <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
               />
               <FaPalette className="relative z-10" />
            </motion.button>

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
         </div>
      </>
   );
};

// --- Enterprise Projects ---

const ProjectCard = ({ title, role, desc, tech, children }: { title: string, role: string, desc: string, tech: string[], children?: React.ReactNode }) => {
   const [isHovered, setIsHovered] = useState(false);

   return (
      <motion.div
         onHoverStart={() => setIsHovered(true)}
         onHoverEnd={() => setIsHovered(false)}
         whileHover={{ y: -5 }}
         className="bento-card p-6 flex flex-col h-full bg-[var(--bg-card)] relative overflow-hidden group"
      >
         <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/0 to-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: '-100%', y: '-100%' }}
            animate={isHovered ? { x: '0%', y: '0%' } : { x: '-100%', y: '-100%' }}
            transition={{ duration: 0.5 }}
         />
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <motion.h3 
                     className="text-xl font-bold text-[var(--text-primary)]"
                     animate={isHovered ? { x: 5 } : { x: 0 }}
                  >
                     {title}
                  </motion.h3>
                  <span className="text-xs font-mono text-[var(--accent-color)] px-2 py-1 rounded bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/20 mt-1 inline-block">
                     {role}
                  </span>
               </div>
               <div className="flex gap-1">
                  {tech.map((t, i) => (
                     <motion.span 
                        key={t} 
                        className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" 
                        title={t}
                        animate={isHovered ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                     />
                  ))}
               </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed flex-1">
               {desc}
            </p>
            {children}
         </div>
      </motion.div>
   );
};

const MockK8sCluster = () => {
   const [nodes, setNodes] = useState(Array(12).fill('active'));

   useEffect(() => {
      const interval = setInterval(() => {
         // Randomly crash and recover nodes
         setNodes(prev => prev.map(() => Math.random() > 0.9 ? 'recovering' : (Math.random() > 0.1 ? 'active' : 'error')));
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="bg-black/20 p-4 rounded-xl border border-[var(--border-color)]">
         <div className="flex items-center justify-between mb-2 text-xs text-[var(--text-secondary)] font-mono">
            <span>Cluster Status: <span className="text-[var(--accent-color)]">HEALTHY</span></span>
            <span>v1.28.2</span>
         </div>
         <div className="grid grid-cols-4 gap-2">
            {nodes.map((status, i) => (
               <motion.div
                  key={i}
                  animate={{
                     backgroundColor: status === 'active' ? 'var(--accent-color)' : (status === 'error' ? '#ef4444' : '#eab308'),
                     opacity: status === 'active' ? 0.5 : 1
                  }}
                  className="h-8 rounded w-full"
               />
            ))}
         </div>
         <div className="mt-2 text-[10px] text-[var(--text-secondary)] flex gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[var(--accent-color)] opacity-50"></div> Ready</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> CrashLoopBackOff</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Pending</span>
         </div>
      </div>
   );
}

const MockFirewall = () => {
   const [attacks, setAttacks] = useState<{ ip: string, country: string }[]>([]);

   useEffect(() => {
      const interval = setInterval(() => {
         const newAttack = {
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            country: ['CN', 'RU', 'BR', 'US', 'DE'][Math.floor(Math.random() * 5)]
         };
         setAttacks(prev => [newAttack, ...prev].slice(0, 5));
      }, 1500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="bg-black/20 p-4 rounded-xl border border-[var(--border-color)] font-mono text-xs overflow-hidden h-[150px] relative">
         <div className="absolute top-0 left-0 w-full p-2 bg-[var(--accent-color)]/10 border-b border-[var(--accent-color)]/20 text-[var(--accent-color)] font-bold flex justify-between">
            <span>AI THREAT GUARD</span>
            <FaShieldAlt className="animate-pulse" />
         </div>
         <div className="mt-8 space-y-1">
            {attacks.map((a, i) => (
               <div key={i} className="flex justify-between animate-in slide-in-from-right fade-in duration-300">
                  <span className="text-[var(--accent-color)]">BLOCKED &gt; {a.ip}</span>
                  <span className="text-[var(--text-secondary)]">[{a.country}]</span>
               </div>
            ))}
         </div>
      </div>
   );
}

// --- Components ---

const BentoItem = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
   <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={`bento-card p-6 flex flex-col justify-between ${className}`}
   >
      {children}
   </motion.div>
);







const TechIcon = ({ icon: Icon, name, color, desc, delay = 0 }: { icon: any, name: string, color?: string, desc?: string, delay?: number }) => (
   <motion.div 
      className="flex flex-col items-center gap-2 group relative tech-icon-float"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      style={{ animationDelay: `${delay}s` }}
   >
      <motion.div 
         className={`p-3 bg-zinc-800/50 rounded-xl group-hover:bg-zinc-700/50 transition-colors relative ${color ? color : ''}`}
         whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
         transition={{ duration: 0.3 }}
      >
         <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-color)]/0 to-[var(--accent-color)]/30 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         />
         <Icon className={`text-2xl text-zinc-300 group-hover:text-white transition-colors relative z-10`} />
      </motion.div>
      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">{name}</span>
      {desc && (
         <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {desc}
         </div>
      )}
   </motion.div>
);



const TimelineItem = ({ year, title, desc, side, children, index = 0 }: { year: string, title: string, desc: string, side: 'left' | 'right', children?: React.ReactNode, index?: number }) => (
   <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative md:w-1/2 mb-8 ${side === 'left' ? 'md:ml-auto md:pr-12 md:text-right' : 'md:mr-auto md:pl-12 md:text-left'}`}
   >
      <motion.div 
         className={`absolute top-0 ${side === 'left' ? '-left-3 md:-left-3' : '-left-3 md:-right-3'} w-6 h-6 rounded-full bg-green-500 border-4 border-zinc-950 z-10 hidden md:block`}
         initial={{ scale: 0 }}
         whileInView={{ scale: 1 }}
         transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
      />
      <motion.div 
         className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors"
         whileHover={{ scale: 1.02, boxShadow: "0 0 20px var(--accent-color)" }}
      >
         <span className="text-green-400 font-mono text-sm mb-2 block">{year}</span>
         <h3 className="text-xl font-bold text-zinc-100 mb-2">{title}</h3>
         <p className="text-zinc-400 text-sm leading-relaxed mb-4">{desc}</p>
         {children}
      </motion.div>
   </motion.div>
);

const BarManagerShowcase = () => (
   <div className="mt-4 text-left font-mono text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 relative overflow-hidden">
      <div className="flex justify-between text-zinc-600 mb-2 border-b border-zinc-800 pb-1">
         <span>bar_inventory.py</span>
         <span>v0.1 (2019)</span>
      </div>
      <div className="text-green-500/80">
         <p>def mix_cocktail(ingredients):</p>
         <p className="pl-4">if inventory.check(ingredients):</p>
         <p className="pl-8">dispense(ingredients)</p>
         <p className="pl-8">log_usage()</p>
         <p className="pl-4">else:</p>
         <p className="pl-8">print("Zu wenig Bestände!")</p>
      </div>
      <div className="mt-3 pt-2 border-t border-zinc-800/50 text-zinc-500 italic">
         "Mein erstes Python-Skript. Ich wollte nicht mehr von Hand zählen."
      </div>
   </div>
);

const Timeline = () => (
   <div className="max-w-4xl mx-auto relative px-4 py-20">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800 -ml-[1px]"></div>
      <div className="flex flex-col gap-12 pl-8 md:pl-0">
         <TimelineItem
            index={0}
            side="right"
            year="2015 - 2017"
            title="Erste Schritte"
            desc="Hauptschulabschluss an der Waldpark-Schule Heidelberg. Verschiedene Jobs in Verkauf und Lieferservice - lernte Eigenständigkeit und Kundenorientierung."
         />
         <TimelineItem
            index={1}
            side="left"
            year="2017 - 2020"
            title="Gastro-Einstieg"
            desc="Bar-Mitarbeiter in Mannheims Jungbusch: Taproom, Beilerei, Nelson Café. Hier entdeckte ich meine Leidenschaft für Cocktails und Gastfreundschaft."
         >
            <div className="flex gap-2 mt-2 flex-wrap">
               <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] rounded border border-amber-500/30">Barista</span>
               <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] rounded border border-amber-500/30">Bar-Service</span>
            </div>
         </TimelineItem>
         <TimelineItem
            index={2}
            side="right"
            year="2021 - 2022"
            title="Dachgarten engelhorn"
            desc="Bar-Mitarbeiter & Service im Premium-Restaurant. Kreierte den 'Mary-Gin' Cocktail - steht noch heute auf der Barkarte."
         />
         <TimelineItem
            index={3}
            side="left"
            year="2022 - 2023"
            title="Bar-Chef bei Fluidum UG"
            desc="Personalverantwortung für bis zu 8 Mitarbeiter. Cocktail-Kreation, Logistik, Einkauf, HACCP-Umsetzung und Bar-Schulungen für das Team."
         >
            <BarManagerShowcase />
         </TimelineItem>
         <TimelineItem
            index={4}
            side="right"
            year="2023 - HEUTE"
            title="Wechsel in die IT"
            desc="Vorbereitung auf IT-Systeminformatik. Linux mastered (Pop!_OS), Home-Lab aufgebaut, Docker & Automation gelernt. Bereit für den Neustart."
         >
            <div className="flex gap-2 mt-2 flex-wrap">
               <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/30">Linux</span>
               <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/30">Docker</span>
               <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] rounded border border-purple-500/30">Python</span>
            </div>
         </TimelineItem>
         <TimelineItem
            index={5}
            side="left"
            year="ZUKUNFT"
            title="IT & Automation"
            desc="Mein Ziel: IT-Systeminformatik kombiniert mit AI-Automation. RAG-Systeme, Computer Vision und autonome Workflows - die Zukunft wartet."
         >
            <div className="flex gap-2 mt-2 flex-wrap">
               <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] rounded border border-purple-500/30">RAG GenAI</span>
               <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/30">Computer Vision</span>
               <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/30">Home-Lab</span>
            </div>
         </TimelineItem>
      </div>
   </div>
);

// --- Main App ---

function App() {
   const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('portfolio-theme');
      return savedTheme || 'cyberpunk';
   });
   const { scrollYProgress } = useScroll();
   const scaleX = useScrollSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.1 });

   useEffect(() => {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
   }, [theme]);

   return (
       <div className="min-h-screen text-[var(--text-primary)] font-body selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-500 pb-20">
          <motion.div className="scroll-progress" style={{ scaleX }} />
          <div className="noise-bg"></div>
          <ThemeSwitcher current={theme} set={setTheme} />
          <AIChat />
          <Dock />

         {/* SECTION 1: HERO CONTROL CENTER */}
         <section id="hero" className="min-h-screen p-4 md:p-8 flex items-center justify-center relative">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

               {/* 1. Hero */}
               <BentoItem className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950">
                  <div>
                     <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                           Offen für Chancen
                        </span>
                     </div>
                     <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 gradient-text-hero">
                        Daten in Intelligenz verwandeln.
                     </h1>
                     <h2 className="text-xl md:text-2xl font-semibold text-[var(--accent-color)] mb-4">
                        Pascal Hintermaier • AI & Automation
                     </h2>
                     <p className="text-zinc-400 text-base leading-relaxed max-w-md mb-6">
                        Von der Bar zur Konsole: 6 Jahre Gastro-Management, jetzt Linux, Python & AI.
                        Stressresistent, problemlösungsorientiert, bereit für die IT.
                     </p>
                     <div className="flex gap-3 flex-wrap">
                        <button
                           onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                           className="px-5 py-2.5 bg-[var(--accent-color)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                           Projekte ansehen
                        </button>
                        <button
                           onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                           className="px-5 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-lg hover:border-[var(--accent-color)] transition-colors"
                        >
                           Kontakt
                        </button>
                     </div>
                  </div>
               </BentoItem>

               {/* 2. Tech Stack */}
               <BentoItem className="md:col-span-2 md:row-span-2" delay={0.2}>
                  <div className="flex flex-col h-full">
                     <div className="flex items-center justify-between mb-4">
                        <div>
                           <h3 className="text-xl font-bold text-white mb-1">Tech Stack</h3>
                           <p className="text-zinc-500 text-sm">Meine Werkzeuge: Ops, Dev & AI</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* OPS */}
                        <div className="space-y-3">
                           <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Infrastructure & Ops</h4>
                           <div className="flex flex-wrap gap-4">
                              <TechIcon icon={FaWindows} name="Windows" desc="15+ Jahre Erfahrung" />
                              <TechIcon icon={FaLinux} name="Linux" desc="Pop!_OS, Debian" />
                              <TechIcon icon={FaDocker} name="Docker" desc="Container & Compose" />
                              <TechIcon icon={FaNetworkWired} name="Netzwerk" desc="TCP/IP, Pi-hole" />
                           </div>
                        </div>

                        {/* AI & DATA */}
                        <div className="space-y-3">
                           <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI & Automation</h4>
                           <div className="flex flex-wrap gap-4">
                              <TechIcon icon={FaPython} name="Python" color="text-yellow-400" desc="OpenCV, Automation Scripts" />
                              <TechIcon icon={SiOpenai} name="RAG / LLM" color="text-green-400" desc="Gemini, lokale Modelle" />
                              <TechIcon icon={FaBrain} name="Auto-Workflow" color="text-purple-400" desc="Task Automation" />
                           </div>
                        </div>

                        {/* DEV */}
                        <div className="space-y-3">
                           <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Web Dev</h4>
                           <div className="flex flex-wrap gap-4">
                              <TechIcon icon={SiReact} name="React" desc="Komponenten-basierte UIs" />
                              <TechIcon icon={SiTypescript} name="TypeScript" desc="Typsichere JS-Entwicklung" />
                              <TechIcon icon={SiTailwindcss} name="Tailwind" desc="Utility-First CSS" />
                              <TechIcon icon={FaGitAlt} name="Git" desc="Versionskontrolle & GitHub" />
                           </div>
                        </div>
                     </div>
                  </div>
               </BentoItem>
            </div>

            {/* Scroll Indicator */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, y: [0, 10, 0] }}
               transition={{ delay: 2, duration: 2, repeat: Infinity }}
               className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 flex flex-col items-center gap-2"
            >
               <span className="text-[10px] uppercase tracking-widest">Scrollen zum Entdecken</span>
               <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent"></div>
            </motion.div>
         </section>

         {/* SECTION 2: THE JOURNEY */}
         <section id="timeline" className="min-h-screen py-24 bg-zinc-950 relative border-t border-zinc-900/50">
            <div className="text-center mb-16 px-4">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Der Werdegang</h2>
               <p className="text-zinc-500 max-w-lg mx-auto">
                  Kein gerader Weg, sondern eine Entwicklung aus Neugier und Problemlösung.
               </p>
            </div>
            <Timeline />
         </section>

         {/* SECTION 2.5: BIG SCALE OPERATIONS */}
         <section id="projects" className="min-h-screen py-24 px-4 bg-[var(--bg-primary)]/50 relative border-t border-[var(--border-color)]">
            <div className="max-w-6xl mx-auto">
               <div className="mb-12">
                  <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Enterprise Projects</h2>
                  <p className="text-[var(--text-secondary)] max-w-lg">
                     Simulationen von Hochverfügbarkeits-Systemen & Security Automation.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FEATURED: IMAGE COMPARE TOOL */}
                  <ProjectCard
                     title="AI Bildvergleich"
                     role="Fullstack & AI"
                     desc="Vergleich von Bildern mit Python, OpenCV & KI. Pixel-Diff, SSIM und Feature Matching."
                     tech={['Python', 'OpenCV', 'React']}
                  >
                     <div className="bg-black/20 p-4 rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center h-[150px] relative overflow-hidden group">
                        <SiOpencv className="text-6xl text-[var(--accent-color)]/20 group-hover:text-[var(--accent-color)] transition-colors duration-500" />
                        <a
                           href="./projects/image-compare/index.html"
                           target="_blank"
                           className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        >
                           <span className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform">
                              Starten 🚀
                           </span>
                        </a>
                     </div>
                  </ProjectCard>
                  {/* PROJECT 1: K8S */}
                  <ProjectCard
                     title="K8s Auto-Healer"
                     role="Platform Engineering"
                     desc="Ein Kubernetes-Operator, der Crashes erkennt und Pods automatisch neu verteilt. Reduzierte Downtime um 99%."
                     tech={['Go', 'K8s', 'Docker']}
                  >
                     <MockK8sCluster />
                  </ProjectCard>

                  {/* PROJECT 2: AI FIREWALL */}
                  <ProjectCard
                     title="Sentient Firewall"
                     role="Security Ops"
                     desc="Machine Learning Modell, das DDOS-Muster in Echtzeit erkennt und IP-Regeln dynamisch in die iptables injiziert."
                     tech={['Python', 'Pytorch', 'Linux']}
                  >
                     <MockFirewall />
                  </ProjectCard>

                  {/* PROJECT 3: CDN */}
                  <ProjectCard
                     title="Global CDN Manager"
                     role="Network Architect"
                     desc="Verteilung von statischen Assets über 5 Kontinente. Smart Routing basierend auf Client-Latenz."
                     tech={['Rust', 'WASM', 'Nginx']}
                  >
                     <div className="bg-black/20 p-4 rounded-xl border border-[var(--border-color)] flex items-center justify-center h-[150px] relative overflow-hidden group">
                        <FaGlobeAmericas className="text-6xl text-[var(--text-secondary)]/20 group-hover:text-[var(--accent-color)]/20 transition-colors duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-center">
                              <div className="text-2xl font-bold text-[var(--text-primary)]">500TB+</div>
                              <div className="text-[10px] text-[var(--text-secondary)]">Traffic / Month</div>
                           </div>
                        </div>
                     </div>
                  </ProjectCard>
               </div>
            </div>
         </section>

         {/* SECTION 3: THREAT MAP */}
         <section id="ops" className="h-[80vh] bg-[var(--bg-primary)] relative border-t border-[var(--border-color)] overflow-hidden">
            <ThreatMap />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
               <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2 shadow-black drop-shadow-lg">Globale Operationen</h2>
               <p className="text-[var(--text-secondary)] bg-[var(--bg-card)]/50 backdrop-blur px-4 py-1 rounded-full">
                  Live Cyber-Security Monitoring Dashboard
               </p>
            </div>
         </section>

         {/* FOOTER */}
         <footer id="contact" className="py-16 text-center border-t border-zinc-900 mb-20">
            <div className="max-w-4xl mx-auto px-4">
               <p className="text-zinc-400 text-sm mb-4">© 2025 Pascal Hintermaier • Mannheim</p>
               <div className="flex justify-center gap-6 text-zinc-500 text-xs">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-color)] transition-colors">
                     GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-color)] transition-colors">
                     LinkedIn
                  </a>
                  <span className="text-zinc-700">|</span>
                  <a href="#impressum" className="hover:text-[var(--accent-color)] transition-colors">
                     Impressum
                  </a>
                  <a href="#datenschutz" className="hover:text-[var(--accent-color)] transition-colors">
                     Datenschutz
                  </a>
               </div>
               <p className="text-zinc-600 text-xs mt-4">Built with React, Tailwind & ☕</p>
            </div>
         </footer>
      </div>
   );
}

export default App;
