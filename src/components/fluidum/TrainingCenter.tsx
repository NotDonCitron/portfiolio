import { motion } from 'framer-motion';
import { FaGraduationCap, FaPlayCircle, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function TrainingCenter() {
    const modules = [
        { id: 1, title: 'HACCP & Safety Basics', role: 'All Staff', duration: '2h', progress: 100, completed: true },
        { id: 2, title: 'Advanced Mixology', role: 'Bar-Chef', duration: '4h', progress: 60, completed: false },
        { id: 3, title: 'Customer Service Excellence', role: 'Employee', duration: '1.5h', progress: 0, completed: false },
        { id: 4, title: 'Inventory Management System', role: 'Admin', duration: '1h', progress: 0, completed: false, locked: true },
    ];

    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <FaGraduationCap className="text-[var(--accent-color)]" />
                Fluidum Academy
            </h2>

            <p className="text-zinc-400 mb-8">
                Upskilling staff and ensuring compliance through automated tracking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((mod, i) => (
                    <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-5 rounded-xl border relative overflow-hidden group ${mod.locked ? 'bg-zinc-950/50 border-zinc-800 opacity-60' : 'bg-zinc-900/50 border-zinc-700 hover:border-[var(--accent-color)]'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <span className="text-xs font-mono text-[var(--accent-color)] mb-1 block">{mod.role} • {mod.duration}</span>
                                <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                            </div>
                            {mod.completed ? (
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                            ) : mod.locked ? (
                                <FaLock className="text-zinc-600" />
                            ) : (
                                <FaPlayCircle className="text-[var(--accent-color)] text-xl group-hover:scale-110 transition-transform cursor-pointer" />
                            )}
                        </div>

                        {!mod.locked && (
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--accent-color)] to-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mod.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        )}

                        {mod.progress > 0 && !mod.completed && <div className="text-right text-xs text-zinc-400 mt-1">{mod.progress}% Complete</div>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
