// AmtGPT Component Exports
// Amt-GPT Workbench V2 - Enhanced Investigative Satire

// Main Components
export { default as AmtGPTPreview } from './AmtGPTPreview';
export { default as AmtGPTModal } from './AmtGPTModal';
export { default as AmtGPTWorkbench } from './AmtGPTWorkbench';
export { default as AmtGPTSimulator } from './AmtGPTSimulator'; // Legacy

// Tab Components
export { default as DashboardTab } from './tabs/DashboardTab';
export { default as ResearchTab } from './tabs/ResearchTab';
export { default as SimulatorTab } from './tabs/SimulatorTab';
export { default as ChatTab } from './tabs/ChatTab';

// Data - Original
export { problems, stats, sources } from './data';

// Data - Enhanced Problems
export { enhancedProblems } from './enhancedProblems';

// Data - Dashboard
export { 
  burdenIndex, 
  comparisonData, 
  keyStats, 
  trustpilotData,
  nonTakeUpRates,
  brhFindings
} from './dashboardData';

// Data - Research
export {
  architectureDiagram,
  batchProcessingFlow,
  burdenFramework,
  cobolSnippet,
  errorGallery,
  userQuotes,
  behoerdendeutsch,
  researchSources,
  improvementVision
} from './researchData';

// Types - Original
export type { Problem, Stat, Source } from './types';

// Types - Dashboard
export type { 
  BurdenIndexItem, 
  ComparisonItem, 
  KeyStat, 
  TrustpilotData 
} from './dashboardData';

// Types - Research
export type {
  ArchitectureSection,
  BurdenCost,
  ErrorCode,
  UserQuote,
  Source as ResearchSource
} from './researchData';

// Types - Enhanced Problems
export type { EnhancedProblem, Persona } from './enhancedProblems';