import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import AmtGPTSimulator from './AmtGPTSimulator';

interface AmtGPTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AmtGPTModal: React.FC<AmtGPTModalProps> = ({ isOpen, onClose }) => {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 right-0 p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md z-20 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <h2 className="text-xl font-bold">Amt-GPT Workbench</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 md:p-8">
              <AmtGPTSimulator />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AmtGPTModal;
