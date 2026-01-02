import { motion } from 'framer-motion';

interface BentoItemProps {
   children: React.ReactNode;
   className?: string;
   delay?: number;
}

const BentoItem = ({ children, className, delay = 0 }: BentoItemProps) => (
   <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-colors ${className || ''}`}
   >
      {children}
   </motion.div>
);

export default BentoItem;