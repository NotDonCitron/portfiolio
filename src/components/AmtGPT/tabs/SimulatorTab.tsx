import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaLightbulb, FaUsers } from 'react-icons/fa';
import { enhancedProblems } from '../enhancedProblems';
import type { EnhancedProblem } from '../enhancedProblems';

const SimulatorTab = () => {
  const [selectedProblem, setSelectedProblem] = useState<EnhancedProblem | null>(null);

  return (
    <div className="simulator-tab">
      {/* Header */}
      <div className="simulator-header">
        <h3>🤖 Amt-GPT Simulator</h3>
        <p>Wählen Sie ein Szenario und erleben Sie die "digitale Transformation" der BA</p>
      </div>

      {/* Warning */}
      <div className="simulator-warning">
        ⚠️ <strong>Satirische Darstellung:</strong> Die Antworten basieren auf echten technischen Problemen, 
        dokumentiert durch Bundesrechnungshof, akademische Forschung und Nutzerbeschwerden.
      </div>

      {/* Main Content */}
      <div className="simulator-content">
        {/* Problem Cards Grid */}
        <div className="problem-cards-grid">
          {enhancedProblems.map((problem, index) => (
            <motion.button
              key={problem.id}
              className={`enhanced-problem-card ${selectedProblem?.id === problem.id ? 'active' : ''}`}
              onClick={() => setSelectedProblem(problem)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="card-header">
                <span className="problem-icon">{problem.icon}</span>
                <span className={`severity-indicator ${problem.severity.toLowerCase()}`}>
                  {problem.severity}
                </span>
              </div>
              <h4 className="problem-title">{problem.title}</h4>
              <div className="persona-preview">
                <span className="avatar">{problem.persona.avatar}</span>
                <span className="name">{problem.persona.name}, {problem.persona.age > 0 ? `${problem.persona.age}` : ''}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Response Panel */}
        <div className="response-panel">
          <AnimatePresence mode="wait">
            {selectedProblem ? (
              <motion.div
                key={selectedProblem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="problem-detail"
              >
                {/* Persona & Story */}
                <div className="persona-story-box">
                  <div className="persona-header">
                    <span className="avatar-large">{selectedProblem.persona.avatar}</span>
                    <div className="persona-info">
                      <h4>{selectedProblem.persona.name}</h4>
                      <p>{selectedProblem.persona.context}</p>
                    </div>
                  </div>
                  <p className="story-text">{selectedProblem.story}</p>
                </div>

                {/* Bot Response */}
                <div className="bot-response-box">
                  <div className="response-header">
                    <FaRobot className="bot-icon" />
                    <span>Amt-GPT sagt:</span>
                  </div>
                  <p className="response-text">{selectedProblem.botResponse}</p>
                </div>

                {/* Technical Cause */}
                <div className="technical-cause-box">
                  <div className="cause-header">
                    <span>🔧 Technische Ursache</span>
                  </div>
                  <p className="cause-text">{selectedProblem.technicalCause}</p>
                </div>

                {/* Modern Alternative */}
                <div className="modern-alternative-box">
                  <div className="alternative-header">
                    <FaLightbulb className="lightbulb-icon" />
                    <span>Moderne Alternative</span>
                  </div>
                  <p className="alternative-text">{selectedProblem.modernAlternative}</p>
                </div>

                {/* Affected Groups */}
                <div className="affected-groups-box">
                  <div className="groups-header">
                    <FaUsers className="users-icon" />
                    <span>Betroffene Gruppen</span>
                  </div>
                  <div className="groups-list">
                    {selectedProblem.affectedGroups.map((group, idx) => (
                      <span key={idx} className="group-chip">{group}</span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="tags-row">
                  {selectedProblem.tags.map((tag, idx) => (
                    <span key={idx} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="placeholder-message"
              >
                <span className="placeholder-icon">👈</span>
                <p>Wählen Sie ein Szenario aus der Liste</p>
                <p className="placeholder-hint">Jedes Szenario zeigt eine reale Person mit echten Problemen</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SimulatorTab;