import { motion } from 'framer-motion';

interface TimelineItemProps {
   year: string;
   title: string;
   desc: string;
   side: 'left' | 'right';
   children?: React.ReactNode;
   index?: number;
}

const TimelineItem = ({ year, title, desc, side, children, index = 0 }: TimelineItemProps) => {
   return (
      <motion.div
         initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, delay: index * 0.1 }}
         className={`flex items-center gap-6 ${side === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
      >
         <div className="flex-1">
            <div className="mb-2">
               <span className="text-sm text-[var(--accent-color)] font-bold">{year}</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)]">{desc}</p>
            {children}
         </div>
         <div className="w-4 h-4 rounded-full bg-[var(--accent-color)] ring-4 ring-[var(--bg-primary)] z-10 flex-shrink-0" />
         <div className="flex-1" />
      </motion.div>
   );
};

export default TimelineItem;