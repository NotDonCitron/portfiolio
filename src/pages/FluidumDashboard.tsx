import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaBoxOpen, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import StaffList from '../components/fluidum/StaffList';
import LogisticsView from '../components/fluidum/LogisticsView';
import TrainingCenter from '../components/fluidum/TrainingCenter';
import ShiftPlanner from '../components/fluidum/ShiftPlanner';

export default function FluidumDashboard() {
    const [activeTab, setActiveTab] = useState<'staff' | 'logistics' | 'roster' | 'training'>('staff');

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-body">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Fluidum Management System
                        </h1>
                        <p className="text-zinc-500 text-sm">Enterprise Resource Planning & Automation</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="text-right hidden md:block">
                        <div className="font-bold">Pascal Hintermaier</div>
                        <div className="text-xs text-[var(--accent-color)]">System Admin</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto mb-8 flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('staff')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaUsers /> Staff
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
                    onClick={() => setActiveTab('training')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'training' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                >
                    <FaGraduationCap /> Academy
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
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
