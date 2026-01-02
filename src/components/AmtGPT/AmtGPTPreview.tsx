import React from 'react';
import { motion } from 'framer-motion';

interface AmtGPTPreviewProps {
  onClick: () => void;
}

const AmtGPTPreview: React.FC<AmtGPTPreviewProps> = ({ onClick }) => {
  return (
    <div className="h-full min-h-[150px] bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden group cursor-pointer relative" onClick={onClick}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-300 group-hover:bg-zinc-900/50">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl mb-4"
        >
          🤖
        </motion.div>
        <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest text-center group-hover:text-zinc-300">
          Simulation Starten
        </div>
      </div>
      
      {/* Decorative pulse */}
      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    </div>
  );
};

export default AmtGPTPreview;
