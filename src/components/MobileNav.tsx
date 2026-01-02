import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaBriefcase, FaTerminal, FaUsers, FaEnvelope } from 'react-icons/fa';

interface MobileNavProps {
   scrollTo: (id: string) => void;
}

const MobileNav = ({ scrollTo }: MobileNavProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const navItems = [
      { id: 'home', label: 'Home', icon: FaHome },
      { id: 'projects', label: 'Projects', icon: FaBriefcase },
      { id: 'skills', label: 'Skills', icon: FaTerminal },
      { id: 'about', label: 'About', icon: FaUsers },
      { id: 'contact', label: 'Contact', icon: FaEnvelope },
   ];

   return (
      <div className="md:hidden fixed bottom-6 right-6 z-50">
         <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 rounded-full bg-[var(--accent-color)] text-white shadow-xl relative overflow-hidden"
            aria-label="Menu"
            aria-expanded={isOpen}
         >
            <motion.div
               className="absolute inset-0 bg-white"
               initial={{ x: '-100%' }}
               animate={{ x: isOpen ? '0%' : '-100%' }}
               transition={{ duration: 0.2 }}
            />
            <span className={`relative z-10 ${isOpen ? 'text-[var(--accent-color)]' : ''}`}>
               {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </span>
         </motion.button>

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
                        onClick={() => {
                           scrollTo(item.id);
                           setIsOpen(false);
                        }}
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

export default MobileNav;