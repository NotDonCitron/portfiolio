
import { motion } from 'framer-motion';
import { SiGithub } from 'react-icons/si';

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

export default GitHubStats;