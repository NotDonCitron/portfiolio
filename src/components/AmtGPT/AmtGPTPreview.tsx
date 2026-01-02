import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';
import './AmtGPT.css';

interface AmtGPTPreviewProps {
  onClick: () => void;
}

const AmtGPTPreview = ({ onClick }: AmtGPTPreviewProps) => {
  return (
    <motion.div
      className="amt-gpt-preview"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="robot-icon"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FaRobot />
      </motion.div>
      <span className="title">🤖 Amt-GPT</span>
      
      {/* Hover Overlay */}
      <div className="preview-overlay">
        <span className="start-button">Starten 🚀</span>
      </div>
    </motion.div>
  );
};

export default AmtGPTPreview;