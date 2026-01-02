import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, useScroll, useSpring as useScrollSpring, AnimatePresence } from 'framer-motion';
import {
   FaEnvelope,
   FaGhost, FaBriefcase, FaSave, FaGamepad, FaLeaf, FaPalette,
   FaRocket, FaServer, FaTerminal, FaBars, FaTimes, FaShieldAlt,
   FaUsers, FaClipboardList, FaBoxOpen, FaCocktail, FaQrcode, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import { SiGithub } from 'react-icons/si';

import { Routes, Route, Link } from 'react-router-dom';
const FluidumDashboard = lazy(() => import('./pages/FluidumDashboard'));

const AIChat = lazy(() => import('./components/AIChat').then(m => ({ default: m.default })));
const StartupAnimation = lazy(() => import('./components/StartupAnimation').then(m => ({ default: m.default })));
const HACCPScanner = lazy(() => import('./components/HACCPScanner'));
const InventoryTwin = lazy(() => import('./components/InventoryTwin'));

import './index.css';

interface BeforeInstallPromptEvent extends Event {
   readonly platforms: string[];
   prompt(): Promise<void>;
   readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// --- MacOS Dock Component ---

function DockIcon({ mouseX, icon: Icon, label, onClick }: { mouseX: MotionValue, icon: React.ComponentType<{ className?: string }>, label: string, onClick: () => void }) {
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
         <DockIcon mouseX={mouseX} icon={FaBoxOpen} label="Inventory" onClick={() => scrollTo('inventory')} />
         <DockIcon mouseX={mouseX} icon={FaQrcode} label="HACCP" onClick={() => window.dispatchEvent(new CustomEvent('open-haccp'))} />
         <DockIcon mouseX={mouseX} icon={FaEnvelope} label="Contact" onClick={() => scrollTo('contact')} />
      </motion.div>
   );
};

// --- Mobile Navigation ---
const MobileNav = () => {
   const [isOpen, setIsOpen] = useState(false);

   const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
   };

   const navItems = [
      { id: 'hero', label: 'Start', icon: FaTerminal },
      { id: 'timeline', label: 'Werdegang', icon: FaRocket },
      { id: 'projects', label: 'Projekte', icon: FaServer },
      { id: 'inventory', label: 'Inventory Twin', icon: FaBoxOpen },
      { id: 'contact', label: 'Kontakt', icon: FaEnvelope },
   ];

   return (
      <div className="md:hidden fixed bottom-4 right-4 z-50">
         {/* Toggle Button */}
         <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/30"
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
         >
            {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
         </motion.button>

         {/* Menu Items */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  className="absolute bottom-16 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-2 backdrop-blur-xl shadow-xl"
               >
                  {navItems.map((item, index) => (
                     <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => scrollTo(item.id)}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[var(--accent-color)]/10 transition-colors text-left"
                     >
                        <item.icon className="text-[var(--accent-color)]" />
                        <span className="text-[var(--text-primary)] text-sm font-medium">{item.label}</span>
                     </motion.button>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

// --- Typing Animation Component ---
const TypingText = ({ text, className }: { text: string, className?: string }) => {
   const [displayedText, setDisplayedText] = useState('');
   const [currentIndex, setCurrentIndex] = useState(0);
   const [showCursor, setShowCursor] = useState(true);

   useEffect(() => {
      if (currentIndex < text.length) {
         const timeout = setTimeout(() => {
            setDisplayedText(prev => prev + text[currentIndex]);
            setCurrentIndex(prev => prev + 1);
         }, 50);
         return () => clearTimeout(timeout);
      }
   }, [currentIndex, text]);

   useEffect(() => {
      const cursorInterval = setInterval(() => {
         setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
   }, []);

   return (
      <span className={className}>
         {displayedText}
         <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
      </span>
   );
};

// --- GitHub Stats Widget ---
const GitHubStats = () => {
   return (
      <motion.a
         href="https://github.com/NotDonCitron"
         target="_blank"
         rel="noopener noreferrer"
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         whileHover={{ scale: 1.02 }}
         className="bento-card p-4 flex items-center gap-4 bg-[var(--bg-card)] cursor-pointer group"
      >
         <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-[var(--accent-color)]/20 transition-colors">
            <SiGithub className="text-2xl text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" />
         </div>
         <div className="flex-1">
            <div className="text-sm font-bold text-[var(--text-primary)]">GitHub Activity</div>
            <div className="text-xs text-[var(--text-secondary)]">Active Learning & Building</div>
         </div>
         <div className="flex gap-2">
            <div className="text-center">
               <div className="text-lg font-bold text-[var(--accent-color)]">10+</div>
               <div className="text-[10px] text-[var(--text-secondary)]">Repos</div>
            </div>
            <div className="text-center">
               <div className="text-lg font-bold text-[var(--accent-color)]">📈</div>
               <div className="text-[10px] text-[var(--text-secondary)]">Active</div>
            </div>
         </div>
      </motion.a>
   );
};

// --- Threat Map Component ---



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

// Project badge types for clarity
type ProjectBadge = 'live' | 'demo' | 'concept' | 'research';

const badgeStyles: Record<ProjectBadge, { bg: string, text: string, border: string, label: string, icon: string }> = {
   live: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      label: 'Live Demo',
      icon: '🚀'
   },
   demo: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Demo',
      icon: '🎮'
   },
   concept: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      label: 'Konzept',
      icon: '📐'
   },
   research: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      label: 'UX Research',
      icon: '🔬'
   }
};

const ProjectCard = ({ title, role, desc, tech, badge, children }: { title: string, role: string, desc: string, tech: string[], badge?: ProjectBadge, children?: React.ReactNode }) => {
   const [isHovered, setIsHovered] = useState(false);
   const badgeInfo = badge ? badgeStyles[badge] : null;

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
                  <div className="flex items-center gap-2 mb-1">
                     <motion.h3
                        className="text-xl font-bold text-[var(--text-primary)]"
                        animate={isHovered ? { x: 5 } : { x: 0 }}
                     >
                        {title}
                     </motion.h3>
                     {badgeInfo && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border} border whitespace-nowrap`}>
                           {badgeInfo.icon} {badgeInfo.label}
                        </span>
                     )}
                  </div>
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

const BarManagementCard = () => (
   <div className="mt-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm group hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2 justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Operations Log</span>
         </div>
         <Link to="/fluidum" className="text-xs px-2 py-1 bg-[var(--accent-color)] text-white rounded hover:bg-blue-600 transition-colors">
            Open Dashboard
         </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><FaUsers className="text-[10px]" /> Personnel</div>
            <div className="text-sm text-zinc-300 font-medium">8 Mitarbeiter</div>
         </div>
         <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><FaClipboardList className="text-[10px]" /> Protocol</div>
            <div className="text-sm text-zinc-300 font-medium">HACCP & Safety</div>
         </div>
         <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><FaBoxOpen className="text-[10px]" /> Logistics</div>
            <div className="text-sm text-zinc-300 font-medium">Einkauf & Supply</div>
         </div>
         <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><FaCocktail className="text-[10px]" /> Product</div>
            <div className="text-sm text-zinc-300 font-medium">Creation & Menu</div>
         </div>
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
            <BarManagementCard />
         </TimelineItem>
         <TimelineItem
            index={4}
            side="right"
            year="2023 - HEUTE"
            title="Wechsel in die IT"
            desc="Vorbereitung auf IT-Systeminformatik. Linux mastered (Pop!_OS), Home-Lab & Electronics Lab aufgebaut. Hardware-Hacking, Docker & Automation gelernt. Bereit für den Neustart."
         >
            <div className="flex gap-2 mt-2 flex-wrap">
               <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/30">Linux</span>
               <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] rounded border border-amber-500/30">Electronics</span>
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
   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
   const [showInstall, setShowInstall] = useState(false);
   const [showStartup, setShowStartup] = useState(() => {
      // Only show startup animation once per session
      const hasSeenStartup = sessionStorage.getItem('portfolio-startup-seen');
      return !hasSeenStartup;
   });
   const { scrollYProgress } = useScroll();
   const scaleX = useScrollSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.1 });
   const [showHACCP, setShowHACCP] = useState(false);

   useEffect(() => {
      const handleOpenHaccp = () => setShowHACCP(true);
      window.addEventListener('open-haccp', handleOpenHaccp);
      return () => window.removeEventListener('open-haccp', handleOpenHaccp);
   }, []);

   useEffect(() => {
      const handler = (e: Event) => {
         e.preventDefault();
         setDeferredPrompt(e as BeforeInstallPromptEvent);
         setShowInstall(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
   }, []);

   const handleInstall = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
         setDeferredPrompt(null);
         setShowInstall(false);
      }
   };

   const handleStartupComplete = () => {
      setShowStartup(false);
      sessionStorage.setItem('portfolio-startup-seen', 'true');
   };

   useEffect(() => {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
   }, [theme]);

   // Show startup animation
   if (showStartup) {
      return (
         <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
            <StartupAnimation onComplete={handleStartupComplete} />
         </Suspense>
      );
   }



   return (
      <Routes>
         <Route path="/" element={
            <div className="min-h-screen text-[var(--text-primary)] font-body selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-500 pb-20">
               <motion.div className="scroll-progress" style={{ scaleX }} />
               <div className="noise-bg"></div>
               <ThemeSwitcher current={theme} set={setTheme} />
               <Suspense fallback={<div className="fixed bottom-20 right-4 w-[50px] h-[50px] rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"></div>}>
                  <AIChat />
               </Suspense>
               <Suspense fallback={null}>
                  <HACCPScanner isOpen={showHACCP} onClose={() => setShowHACCP(false)} />
               </Suspense>
               <Dock />
               <MobileNav />

               {/* Hero Section */}
               <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative p-8">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-color)]/20 rounded-full blur-[100px] animate-pulse"></div>
                     <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                  </div>

                  <div className="z-10 text-center space-y-6 max-w-4xl">
                     <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                     >
                        <h2 className="text-xl md:text-2xl font-mono text-[var(--accent-color)] mb-4">
                           <TypingText text="> SYSTEM.INIT(USER='PASCAL');" />
                        </h2>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 glitch-text" data-text="PASCAL HINTERMAIER">
                           PASCAL HINTERMAIER
                        </h1>
                        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                           Vom <span className="text-[var(--text-primary)] font-bold">Bar-Management</span> zur <span className="text-[var(--text-primary)] font-bold">IT-Systeminformatik</span>.
                           <br />
                           <span className="text-sm mt-2 block">Building Autonomous Agents & Resilient Infrastructure.</span>
                        </p>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="flex flex-wrap justify-center gap-4 mt-8"
                     >
                        <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-[var(--accent-color)] text-white rounded-lg font-bold hover:bg-blue-600 transition-all shadow-[0_0_20px_var(--accent-color)] hover:shadow-[0_0_40px_var(--accent-color)]">
                           Projekte ansehen
                        </button>
                        <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg font-bold hover:border-[var(--accent-color)] transition-all">
                           Kontakt aufnehmen
                        </button>
                     </motion.div>
                  </div>
               </section>

               <section id="timeline" className="min-h-screen bg-[var(--bg-card)]/50 backdrop-blur-sm py-20">
                  <div className="max-w-7xl mx-auto px-6">
                     <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-16 text-center md:text-left"
                     >
                        WERDEGANG<span className="text-[var(--accent-color)]">.log</span>
                     </motion.h2>
                     <Timeline />
                  </div>
               </section>

               <section id="projects" className="min-h-screen py-20 relative">
                  <div className="max-w-7xl mx-auto px-6">
                     <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-16 text-right"
                     >
                        PROJECTS<span className="text-[var(--accent-color)]">.exe</span>
                     </motion.h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <BentoItem className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950">
                           <ProjectCard
                              title="Portfolio Modernization"
                              role="Fullstack Engineer"
                              desc="Diese Website selbst ist ein Showcase. Built with React 19, Vite, Tailwind v4 und Framer Motion. Integriert lokale LLMs via HuggingFace und bietet eine PWA-Experience."
                              tech={['React', 'TypeScript', 'Tailwind', 'Vite', 'Framer Motion']}
                              badge="live"
                           >
                              <div className="mt-4 flex gap-2">
                                 <GitHubStats />
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem delay={0.2}>
                           <ProjectCard
                              title="Kubernetes Home-Lab"
                              role="DevOps Engineer"
                              desc="3-Node K3s Cluster auf Raspberry Pis. Hosting von Nextcloud, Pi-hole und personal Gitea Instance. Monitoring via Grafana & Prometheus."
                              tech={['K3s', 'Docker', 'Linux', 'Ansible']}
                              badge="demo"
                           >
                              <div className="mt-4">
                                 <MockK8sCluster />
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem delay={0.4}>
                           <ProjectCard
                              title="Sentient Firewall"
                              role="Security Researcher"
                              desc="AI-driven Firewall mit LSTM Neural Network für Echtzeit-Traffic-Analyse. Erkennt DDoS, Port Scanning und Brute Force Angriffe. Open Source auf GitHub."
                              tech={['Python', 'PyTorch', 'Scapy', 'Flask']}
                              badge="live"
                           >
                              <div className="mt-4">
                                 <MockFirewall />
                              </div>
                              <div className="mt-3 flex gap-2">
                                 <a
                                    href="/projects/sentient-firewall/"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
                                 >
                                    Demo 🚀
                                 </a>
                                 <a
                                    href="https://github.com/NotDonCitron/sentient-firewall"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1"
                                 >
                                    <SiGithub /> Code
                                 </a>
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem className="md:col-span-3">
                           <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                              <div>
                                 <h3 className="text-xl font-bold mb-1">Mehr Projekte auf GitHub</h3>
                                 <p className="text-zinc-400">Schauen Sie sich meine Repositories und Contributions an.</p>
                              </div>
                              <a href="https://github.com/NotDonCitron" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold transition-colors">
                                 GitHub Profile
                              </a>
                           </div>
                        </BentoItem>
                     </div>
                  </div>
               </section>

               <section id="inventory" className="py-20 bg-[var(--bg-card)]/30 backdrop-blur-sm relative border-t border-[var(--border-color)]">
                  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                     <div className="md:col-span-1">
                        <h2 className="text-4xl font-bold mb-6">Digital Inventory Twin</h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                           Ein Echtzeit-Abbild der physischen Bestände. Demonstriert die Verbindung von klassischer Logistik mit moderner IT-Infrastruktur.
                        </p>
                        <ul className="space-y-4 mb-8">
                           <li className="flex items-center gap-3 text-zinc-300">
                              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm"><FaCheckCircle /></span>
                              <span>Live-Status Überwachung</span>
                           </li>
                           <li className="flex items-center gap-3 text-zinc-300">
                              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm"><FaBoxOpen /></span>
                              <span>Smart Location Tracking</span>
                           </li>
                           <li className="flex items-center gap-3 text-zinc-300">
                              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm"><FaExclamationTriangle /></span>
                              <span>Auto-Alert bei Low Stock</span>
                           </li>
                        </ul>
                        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                           <div className="text-xs font-mono text-zinc-500 mb-2">SYSTEM STATUS</div>
                           <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                              <span className="relative flex h-2 w-2">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                              </span>
                              ONLINE • SYNCED
                           </div>
                        </div>
                     </div>
                     <div className="md:col-span-2 h-[500px] bg-black/40 rounded-2xl border border-[var(--border-color)] relative overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                           <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                           </div>
                           <div className="text-xs font-mono text-zinc-500">inventory_node_v2.0.1</div>
                        </div>
                        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading Inventory Module...</div>}>
                           <InventoryTwin />
                        </Suspense>
                     </div>
                  </div>
               </section>

               <section id="contact" className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
                  {/* Footer / Contact */}
                  <div className="text-center z-10">
                     <motion.h2
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="text-6xl md:text-9xl font-black mb-8 text-[var(--accent-color)] opacity-20 select-none"
                     >
                        CONTACT
                     </motion.h2>
                     <h3 className="text-3xl font-bold mb-8">Bereit für den nächsten Schritt?</h3>
                     <div className="flex justify-center gap-6 mb-12">
                        <a href="mailto:pascal.hintermaier@example.com" className="p-4 bg-zinc-800 rounded-full hover:bg-[var(--accent-color)] hover:text-white transition-all transform hover:scale-110">
                           <FaEnvelope className="text-2xl" />
                        </a>
                        <a href="https://github.com/NotDonCitron" className="p-4 bg-zinc-800 rounded-full hover:bg-[var(--accent-color)] hover:text-white transition-all transform hover:scale-110">
                           <SiGithub className="text-2xl" />
                        </a>
                        <a href="https://linkedin.com" className="p-4 bg-zinc-800 rounded-full hover:bg-[var(--accent-color)] hover:text-white transition-all transform hover:scale-110">
                           <FaBriefcase className="text-2xl" />
                        </a>
                     </div>
                     <p className="text-zinc-500">© 2026 Pascal Hintermaier. Built with AI & Passion.</p>
                  </div>
               </section>
            </div>
         } />

         <Route path="/fluidum" element={
            <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Fluidum OS...</div>}>
               <FluidumDashboard />
            </Suspense>
         } />
      </Routes>
   );
}

export default App;
