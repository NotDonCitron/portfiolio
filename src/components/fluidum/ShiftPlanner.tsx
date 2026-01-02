import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

export default function ShiftPlanner() {
    // Mock shifts for now, would connect to backend real-time
    const shifts = [
        { id: 1, staff: 'Pascal Hintermaier', time: '18:00 - 02:00', role: 'Bar-Chef', area: 'Main Bar' },
        { id: 2, staff: 'Employee 1', time: '17:00 - 01:00', role: 'Service', area: 'Terrace' },
        { id: 3, staff: 'Employee 2', time: '19:00 - 03:00', role: 'Runner', area: 'Main Bar' },
    ];

    return (
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                <FaCalendarAlt className="text-[var(--accent-color)]" />
                Shift Roster
            </h2>

            <div className="space-y-3">
                {shifts.map((shift, i) => (
                    <motion.div
                        key={shift.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-lg border border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                                {shift.staff.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-white">{shift.staff}</div>
                                <div className="text-xs text-zinc-400">{shift.role} • {shift.area}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono text-[var(--accent-color)] bg-[var(--accent-color)]/10 px-3 py-1 rounded">
                            <FaClock /> {shift.time}
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="mt-6 w-full py-3 border border-dashed border-zinc-700 text-zinc-400 rounded-lg hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] transition-colors">
                + Assign New Shift
            </button>
        </div>
    );
}
