import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardTab from './tabs/DashboardTab';
import ResearchTab from './tabs/ResearchTab';
import SimulatorTab from './tabs/SimulatorTab';
import ChatTab from './tabs/ChatTab';
import './AmtGPT.css';

type TabId = 'dashboard' | 'research' | 'simulator' | 'chat';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'research', label: 'Research', icon: '📚' },
  { id: 'simulator', label: 'Simulator', icon: '🤖' },
  { id: 'chat', label: 'Chat', icon: '💬' },
];

const AmtGPTWorkbench = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'research':
        return <ResearchTab />;
      case 'simulator':
        return <SimulatorTab />;
      case 'chat':
        return <ChatTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="amt-gpt-workbench">
      {/* Workbench Header */}
      <div className="workbench-header">
        <h2 className="workbench-title">
          <span className="title-icon">🏛️</span>
          Amt-GPT Workbench
        </h2>
        <p className="workbench-subtitle">
          Nüchterne Investigativ-Satire zur IT-Infrastruktur der Bundesagentur für Arbeit
        </p>
      </div>

      {/* Tab Navigation */}
      <nav className="workbench-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`workbench-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                className="tab-indicator"
                layoutId="tabIndicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="workbench-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="tab-content-wrapper"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AmtGPTWorkbench;