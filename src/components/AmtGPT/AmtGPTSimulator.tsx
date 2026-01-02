import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChevronDown } from 'react-icons/fa';
import type { Problem } from './types';
import { problems, stats, sources } from './data';
import './AmtGPT.css';

const AmtGPTSimulator = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div className="amt-gpt-container">
      <div className="amt-gpt-simulator">
        {/* Header */}
        <div className="amt-gpt-header">
          <h2>
            <FaRobot />
            Amt-GPT Simulator
          </h2>
          <p>Erleben Sie die "digitale Transformation" der Bundesagentur für Arbeit</p>
        </div>

        {/* Warning Banner */}
        <div className="amt-gpt-warning">
          <p>
            ⚠️ <strong>Satirische Darstellung:</strong> Diese Antworten basieren auf echten technischen Problemen, 
            dokumentiert durch Bundesrechnungshof, akademische Forschung und Nutzerbeschwerden.
          </p>
        </div>

        {/* Simulation Area - Two Column Grid */}
        <div className="simulation-area">
          {/* Left: Problems List */}
          <div className="problems-list">
            {problems.map((problem) => (
              <motion.button
                key={problem.id}
                className={`problem-button ${selectedProblem?.id === problem.id ? 'active' : ''}`}
                onClick={() => setSelectedProblem(problem)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="title">{problem.title}</span>
                <span className={`severity-badge ${problem.severity.toLowerCase()}`}>
                  {problem.severity}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right: Response Area */}
          <div className="response-area">
            <AnimatePresence mode="wait">
              {selectedProblem ? (
                <motion.div
                  key={selectedProblem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="response-content"
                >
                  {/* Bot Response */}
                  <div className="bot-response">
                    <div className="label">
                      <FaRobot /> Amt-GPT sagt:
                    </div>
                    <p className="text">{selectedProblem.response}</p>
                  </div>

                  {/* Technical Reason */}
                  <div className="technical-reason">
                    <div className="label">🔧 Technische Ursache:</div>
                    <p className="text">{selectedProblem.reason}</p>
                  </div>

                  {/* Tags */}
                  <div className="tags-container">
                    {selectedProblem.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="response-placeholder"
                >
                  <span className="icon">👈</span>
                  <p>Wählen Sie ein Problem aus der Liste</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Sources Section */}
        <div className="sources-section">
          <div 
            className="sources-header"
            onClick={() => setSourcesOpen(!sourcesOpen)}
          >
            <h4>📚 Quellen & Dokumentation</h4>
            <FaChevronDown className={`toggle-icon ${sourcesOpen ? 'open' : ''}`} />
          </div>
          
          <AnimatePresence>
            {sourcesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="sources-list">
                  {sources.map((source, index) => (
                    <motion.div
                      key={index}
                      className="source-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="source-badge">{source.badge}</span>
                      <div className="title">{source.title}</div>
                      <div className="description">{source.description}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AmtGPTSimulator;