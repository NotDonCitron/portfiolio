import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StartupAnimation.css';

interface StartupAnimationProps {
    onComplete: () => void;
}

const StartupAnimation: React.FC<StartupAnimationProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState<'gauge' | 'letters'>('gauge');

    useEffect(() => {
        if (stage === 'gauge') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStage('letters'), 500);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 20);
            return () => clearInterval(interval);
        }

        if (stage === 'letters') {
            // Go directly to main site after showing PH letters
            const timer = setTimeout(() => {
                onComplete();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [stage, onComplete]);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="startup-container">
            <AnimatePresence mode="wait">
                {stage === 'gauge' && (
                    <motion.div
                        key="gauge"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="gauge-wrapper"
                    >
                        <div id="circle">
                            <svg>
                                <circle className="bg" cx="80" cy="80" r={radius}></circle>
                                <circle
                                    className="fill"
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    style={{
                                        strokeDasharray: circumference,
                                        strokeDashoffset: offset,
                                    }}
                                ></circle>
                            </svg>
                            <div id="percent">{progress}%</div>
                        </div>
                    </motion.div>
                )}

                {stage === 'letters' && (
                    <motion.div
                        key="letters"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.8 }}
                        id="letters"
                    >
                        <span style={{ color: '#00ffff' }}>P</span>
                        <span style={{ color: '#00ffff' }}>H</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StartupAnimation;
