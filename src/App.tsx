import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring as useScrollSpring } from 'framer-motion';
import {
   FaEnvelope, FaBriefcase,
   FaClipboardList, FaBoxOpen, FaCocktail, FaCheckCircle, FaExclamationTriangle, FaUsers
} from 'react-icons/fa';
import { SiGithub } from 'react-icons/si';

import { Routes, Route, Link } from 'react-router-dom';
const FluidumDashboard = lazy(() => import('./pages/FluidumDashboard'));
const AIChat = lazy(() => import('./components/AIChat').then(m => ({ default: m.default })));
const StartupAnimation = lazy(() => import('./components/StartupAnimation'));
const HACCPScanner = lazy(() => import('./components/HACCPScanner'));
const InventoryTwin = lazy(() => import('./components/InventoryTwin'));

import Dock from './components/Dock';
import MobileNav from './components/MobileNav';
import TypingText from './components/TypingText';
import GitHubStats from './components/GitHubStats';
import ThemeSwitcher from './components/ThemeSwitcher';
import MockFirewall from './components/MockFirewall';
import BentoItem from './components/BentoItem';
import TimelineItem from './components/TimelineItem';

import './index.css';

// --- Enterprise Projects ---

// Project badge types for clarity
type ProjectBadge = 'live' | 'demo' | 'concept' | 'research' | 'tool';

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
   },
   tool: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      label: 'Tool',
      icon: '🛠️'
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
         className="bento-card p-6 flex flex-col h-full bg-(--bg-card) relative overflow-hidden group"
      >
         <motion.div
            className="absolute inset-0 bg-linear-to-br from-(--accent-color)/0 to-(--accent-color)/10 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: '-100%', y: '-100%' }}
            animate={isHovered ? { x: '0%', y: '0%' } : { x: '-100%', y: '-100%' }}
            transition={{ duration: 0.5 }}
         />
         <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <motion.h3
                        className="text-xl font-bold text-(--text-primary)"
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
                  <span className="text-xs font-mono text-(--accent-color) px-2 py-1 rounded bg-(--accent-color)/10 border border-(--accent-color)/20 mt-1 inline-block">
                     {role}
                  </span>
               </div>
               <div className="flex gap-1">
                  {tech.map((t, i) => (
                     <motion.span
                        key={t}
                        className="w-2 h-2 rounded-full bg-(--text-secondary)"
                        title={t}
                        animate={isHovered ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                     />
                  ))}
               </div>
            </div>
            <p className="text-sm text-(--text-secondary) mb-6 leading-relaxed flex-1">
               {desc}
            </p>
            {children}
         </div>
      </motion.div>
   );
};



// --- Components ---

const BarManagementCard = () => (
   <div className="mt-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm group hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2 justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Operations Log</span>
         </div>
         <Link to="/fluidum" className="text-xs px-2 py-1 bg-(--accent-color) text-white rounded hover:bg-blue-600 transition-colors">
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
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800 -ml-px"></div>
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



   const handleStartupComplete = () => {
      setShowStartup(false);
      sessionStorage.setItem('portfolio-startup-seen', 'true');
   };

   useEffect(() => {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
   }, [theme]);

   const scrollTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
   };

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
            <div className="min-h-screen text-(--text-primary) font-body selection:bg-(--accent-color) selection:text-white transition-colors duration-500 pb-20">
               <motion.div className="scroll-progress" style={{ scaleX }} />
               <div className="noise-bg"></div>
               <ThemeSwitcher current={theme} set={setTheme} />
               <Suspense fallback={<div className="fixed bottom-20 right-4 w-[50px] h-[50px] rounded-full bg-(--bg-card) border border-(--border-color) animate-pulse"></div>}>
                  <AIChat />
               </Suspense>
               <Suspense fallback={null}>
                  <HACCPScanner isOpen={showHACCP} onClose={() => setShowHACCP(false)} />
               </Suspense>
               <Dock onNav={scrollTo} />
               <MobileNav scrollTo={scrollTo} />

               {/* Hero Section */}
               <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative p-8">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-(--accent-color)/20 rounded-full blur-[100px] animate-pulse"></div>
                     <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                  </div>

                  <div className="z-10 text-center space-y-6 max-w-4xl">
                     <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                     >
                        <h2 className="text-xl md:text-2xl font-mono text-(--accent-color) mb-4">
                           <TypingText text="> SYSTEM.INIT(USER='PASCAL');" />
                        </h2>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 glitch-text" data-text="PASCAL HINTERMAIER">
                           PASCAL HINTERMAIER
                        </h1>
                        <p className="text-xl md:text-2xl text-(--text-secondary) max-w-2xl mx-auto leading-relaxed">
                           Vom <span className="text-(--text-primary) font-bold">Bar-Management</span> zur <span className="text-(--text-primary) font-bold">IT-Systeminformatik</span>.
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
                        <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-(--accent-color) text-white rounded-lg font-bold hover:bg-blue-600 transition-all shadow-[0_0_20px_var(--accent-color)] hover:shadow-[0_0_40px_var(--accent-color)]">
                           Projekte ansehen
                        </button>
                        <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-lg font-bold hover:border-(--accent-color) transition-all">
                           Kontakt aufnehmen
                        </button>
                     </motion.div>
                  </div>
               </section>

               <section id="timeline" className="min-h-screen bg-(--bg-card)/50 backdrop-blur-sm py-20">
                  <div className="max-w-7xl mx-auto px-6">
                     <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-16 text-center md:text-left"
                     >
                        WERDEGANG<span className="text-(--accent-color)">.log</span>
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
                        PROJECTS<span className="text-(--accent-color)">.exe</span>
                     </motion.h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <BentoItem className="col-span-1 md:col-span-2 bg-linear-to-br from-zinc-900 to-zinc-950">
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
                              title="Bar Inventory Twin"
                              role="Fullstack & IoT"
                              desc="Digitaler Zwilling für Bar-Bestände. Echtzeit-Tracking und Visualisierung von Flaschenbeständen. Interaktive Demo verfügbar."
                              tech={['JavaScript', 'CSS', 'HTML', 'LocalStorage']}
                              badge="demo"
                           >
                              <div className="mt-4 flex gap-2">
                                 <a
                                    href="/projects/bar-inventory/"
                                    rel="external"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-(--accent-color) text-white rounded-lg hover:opacity-90 transition-opacity"
                                 >
                                    Live Demo 🚀
                                 </a>
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem delay={0.3}>
                           <ProjectCard
                              title="HACCP Digital"
                              role="Compliance Engineer"
                              desc="Digitale Checklisten für Lebensmittelsicherheit. Ersetzt Papierkram durch smarte, mobile-first Protokolle."
                              tech={['PWA', 'JavaScript', 'Forms']}
                              badge="demo"
                           >
                              <div className="mt-4 flex gap-2">
                                 <a
                                    href="/projects/haccp-checklist/"
                                    target="_self"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-(--accent-color) text-white rounded-lg hover:opacity-90 transition-opacity"
                                 >
                                    Live Demo 📋
                                 </a>
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem delay={0.4}>
                           <ProjectCard
                              title="Visual Regression"
                              role="QA Automation"
                              desc="Pixel-genauer Bildvergleich für UI-Testing. Erkennt visuelle Regressionen zwischen Deployments automatisch."
                              tech={['Python', 'OpenCV', 'JS']}
                              badge="tool"
                           >
                              <div className="mt-4 flex gap-2">
                                 <a
                                    href="/projects/image-compare/"
                                    target="_self"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-(--accent-color) text-white rounded-lg hover:opacity-90 transition-opacity"
                                 >
                                    Tool öffnen 🔍
                                 </a>
                              </div>
                           </ProjectCard>
                        </BentoItem>

                        <BentoItem delay={0.5}>
                           <ProjectCard
                              title="Password Strength"
                              role="Security Audit"
                              desc="Client-side Passwort-Analyse. Prüft Entropie und Common-Patterns ohne Datenübertragung."
                              tech={['Crypto', 'JavaScript']}
                              badge="tool"
                           >
                              <div className="mt-4 flex gap-2">
                                 <a
                                    href="/projects/password-checker/"
                                    target="_self"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-(--accent-color) text-white rounded-lg hover:opacity-90 transition-opacity"
                                 >
                                    Check Now 🔒
                                 </a>
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
                                    target="_self"
                                    className="flex-1 text-center px-3 py-2 text-xs font-bold bg-(--accent-color) text-white rounded-lg hover:opacity-90 transition-opacity"
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

               <section id="inventory" className="py-20 bg-(--bg-card)/30 backdrop-blur-sm relative border-t border-(--border-color)">
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
                     <div className="md:col-span-2 h-[500px] bg-black/40 rounded-2xl border border-(--border-color) relative overflow-hidden shadow-2xl flex flex-col">
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
                        className="text-6xl md:text-9xl font-black mb-8 text-(--accent-color) opacity-20 select-none"
                     >
                        CONTACT
                     </motion.h2>
                     <h3 className="text-3xl font-bold mb-8">Bereit für den nächsten Schritt?</h3>
                     <div className="flex justify-center gap-6 mb-12">
                        <a href="mailto:pascal.hintermaier@example.com" className="p-4 bg-zinc-800 rounded-full hover:bg-(--accent-color) hover:text-white transition-all transform hover:scale-110">
                           <FaEnvelope className="text-2xl" />
                        </a>
                        <a href="https://github.com/NotDonCitron" className="p-4 bg-zinc-800 rounded-full hover:bg-(--accent-color) hover:text-white transition-all transform hover:scale-110">
                           <SiGithub className="text-2xl" />
                        </a>
                        <a href="https://linkedin.com" className="p-4 bg-zinc-800 rounded-full hover:bg-(--accent-color) hover:text-white transition-all transform hover:scale-110">
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
         <Route path="/projects/*" element={null} />
      </Routes>
   );
}

export default App;
