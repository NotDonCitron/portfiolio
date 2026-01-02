import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { problems, stats, sources } from './data';
import type { Problem } from './types';
import './AmtGPT.css';

const AmtGPTSimulator: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-blue-500 text-white';
      default: return 'bg-zinc-500 text-white';
    }
  };

  return (
    <div className="amt-gpt-simulator p-4 md:p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
      {/* Satire Warning Banner */}
      <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="text-xs text-red-200 uppercase tracking-widest font-bold">
          Satirische Simulation: Basiert auf echten technischen Fehlern & akademischer Forschung (Administrative Burden)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problems Selection */}
        <div className="space-y-3">
          <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">Problem wählen</h3>
          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {problems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${selectedProblem?.id === p.id
                    ? 'bg-zinc-800 border-zinc-600 shadow-lg translate-x-1'
                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
              >
                <div className="font-bold text-sm mb-1">{p.title}</div>
                <div className="flex gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getSeverityColor(p.severity)}`}>
                    {p.severity}
                  </span>
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] text-zinc-500 font-mono">#{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Response Area */}
        <div className="flex flex-col h-full">
          <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">Amt-GPT Antwort</h3>
          <div className="flex-grow bg-black rounded-2xl border border-zinc-800 p-6 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
            {/* Background Robot Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] opacity-5 pointer-events-none">
              🤖
            </div>

            <AnimatePresence mode="wait">
              {selectedProblem ? (
                <motion.div
                  key={selectedProblem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative z-10"
                >
                  <div className="text-xl md:text-2xl font-serif italic text-zinc-100 mb-6 leading-relaxed">
                    "{selectedProblem.response}"
                  </div>
                  <div className="mt-8 pt-6 border-t border-zinc-800">
                    <div className="text-xs font-mono text-zinc-500 uppercase mb-2">Technische Ursache (Reales System)</div>
                    <div className="text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                      {selectedProblem.reason}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-zinc-500 italic">
                  Bitte wählen Sie links ein Szenario aus,<br />um die Reaktion des Systems zu simulieren.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div className="mt-8 pt-6 border-t border-zinc-800">
        <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">Referenzen & Quellen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source, i) => (
            <div key={i} className="text-[11px] text-zinc-500 bg-zinc-900/20 p-2 rounded-lg border border-zinc-900">
              <span className="font-bold text-zinc-400 mr-2">[{source.badge}]</span>
              <span className="text-zinc-300">{source.title}:</span> {source.description}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmtGPTSimulator;
