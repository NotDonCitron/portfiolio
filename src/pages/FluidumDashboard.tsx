import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBoxOpen, FaGraduationCap, FaCalendarAlt, FaUserShield, FaShieldAlt, FaWrench, FaDownload, FaTimes } from 'react-icons/fa';
import StaffList from '../components/fluidum/StaffList';
import LogisticsView from '../components/fluidum/LogisticsView';
import TrainingCenter from '../components/fluidum/TrainingCenter';
import ShiftPlanner from '../components/fluidum/ShiftPlanner';
import { AmtGPTSimulator } from '../components/AmtGPT';

// State Dump Modal Component
const StateDumpModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl"
                >
                    <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                        <div className="flex items-center gap-2 font-mono text-sm text-emerald-400">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            SYSTEM_STATE_DUMP.json
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white"><FaTimes /></button>
                    </div>
                    <div className="p-6 overflow-auto max-h-[70vh]">
                        <pre className="text-xs font-mono text-emerald-500/90 leading-relaxed">
                            {JSON.stringify(data, null, 4)}
                        </pre>
                    </div>
                    <div className="bg-zinc-800/50 p-4 border-t border-zinc-700 flex justify-end">
                        <button
                            onClick={() => {
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `fluidum_state_${Date.now()}.json`;
                                a.click();
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all"
                        >
                            <FaDownload /> Download Checkpoint
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const SecurityCenter = () => (
    // ... SecurityCenter component code ...
    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-500/20 rounded-xl">
                <FaShieldAlt className="text-2xl text-red-500 animate-pulse" />
            </div>
            <div>
                <h2 className="text-2xl font-bold">Sentient Security Center</h2>
                <p className="text-zinc-400">AI-Powered Threat Detection Active</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 p-6 rounded-xl border border-zinc-800">
                <div className="text-xs font-mono text-zinc-400 mb-2">SYSTEM STATUS</div>
                <div className="text-xl font-bold text-green-400">ENFORCING</div>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-zinc-800">
                <div className="text-xs font-mono text-zinc-400 mb-2">THREAT LEVEL</div>
                <div className="text-xl font-bold text-amber-400">ELEVATED</div>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-zinc-800">
                <div className="text-xs font-mono text-zinc-400 mb-2">LSTM CONFIDENCE</div>
                <div className="text-xl font-bold text-blue-400">98.4%</div>
            </div>
        </div>
        <div className="mt-8 p-4 bg-black rounded-lg border border-zinc-800 font-mono text-xs text-zinc-400 h-64 overflow-y-auto">
            <div className="text-green-500 mb-2">[SYSTEM] Sentinel Engine v1.0.4 started...</div>
            <div className="text-zinc-400">[INFO] Loading LSTM weights from ./models/threat_detector.pt</div>
            <div className="text-zinc-400">[INFO] Monitoring interface eth0...</div>
            <div className="text-red-400">[ALERT] Anomalous flow detected from 192.168.1.45</div>
            <div className="text-red-500 font-bold">[BLOCK] IP 192.168.1.45 blacklisted (Reason: DDoS Pattern)</div>
            <div className="text-zinc-400">[INFO] Packet capture rate: 45,200 pps</div>
            <div className="animate-pulse">_</div>
        </div>
    </div>
);

export default function FluidumDashboard() {
    const [activeTab, setActiveTab] = useState<'staff' | 'logistics' | 'roster' | 'training' | 'security' | 'workbench'>('staff');
    const [isDumpOpen, setIsDumpOpen] = useState(false);

    const systemState = {
        timestamp: new Date().toISOString(),
        node: "fluidum-core-01",
        user: "Pascal Hintermaier",
        role: "Management & Optimization",
        active_session: true,
        current_view: activeTab,
        integrity_check: "PASSED",
        mock_kpis: {
            personnel_load: "84%",
            logistics_efficiency: "92.4%",
            security_threat_level: "ELEVATED"
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-body">
            <StateDumpModal isOpen={isDumpOpen} onClose={() => setIsDumpOpen(false)} data={systemState} />

            {/* Header */}
            <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                Fluidum ERP Case Study
                            </h1>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-widest">
                                Legacy Reconstruction
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm">Digitaler Zwilling & Prozessoptimierung (Ehem. Betrieb: Fluidum)</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsDumpOpen(true)}
                        className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-mono hover:bg-emerald-500/20 transition-all tracking-tighter"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        SYSTEM DUMP
                    </button>
                    <div className="flex gap-2">
                        <div className="text-right hidden md:block">
                            <div className="font-bold text-sm">Pascal Hintermaier</div>
                            <div className="text-[10px] text-[var(--accent-color)] uppercase tracking-widest">Management & Optimization</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/10"></div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto mb-8 flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaUserShield /> Bar Manager
                </button>
                <button
                    onClick={() => setActiveTab('roster')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'roster' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaCalendarAlt /> Roster
                </button>
                <button
                    onClick={() => setActiveTab('logistics')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'logistics' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaBoxOpen /> Logistics
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaShieldAlt /> Security
                </button>
                <button
                    onClick={() => setActiveTab('training')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'training' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaGraduationCap /> Academy
                </button>
                <button
                    onClick={() => setActiveTab('workbench')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'workbench' ? 'bg-zinc-700 text-white shadow-lg shadow-zinc-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaWrench /> Workbench
                </button>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'staff' && <StaffList />}
                        {activeTab === 'roster' && <ShiftPlanner />}
                        {activeTab === 'logistics' && <LogisticsView />}
                        {activeTab === 'training' && <TrainingCenter />}
                        {activeTab === 'security' && <SecurityCenter />}
                        {activeTab === 'workbench' && (
                            <div className="space-y-8">
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                    <h2 className="text-2xl font-bold mb-2">Project Workbench</h2>
                                    <p className="text-zinc-400 mb-6">Satirical research and technical case studies on public infrastructure.</p>
                                    <AmtGPTSimulator />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
