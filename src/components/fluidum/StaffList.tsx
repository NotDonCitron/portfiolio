import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaUserAstronaut, FaUser, FaPlus, FaSpinner, FaUsers, FaChartPie, FaBolt, FaIdCard, FaUserShield } from 'react-icons/fa';

interface Staff {
    id: number;
    name: string;
    role: string;
    status: string;
    contact: string;
    skills: string;
}

export default function StaffList() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', role: 'Employee', skills: '' });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/fluidum/staff');
            const data = await res.json();
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/fluidum/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff)
            });
            if (res.ok) {
                fetchStaff();
                setShowAddForm(false);
                setNewStaff({ name: '', role: 'Employee', skills: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><FaSpinner className="animate-spin text-4xl text-[var(--accent-color)]" /></div>;

    return (
        <div className="space-y-6">
            {/* Manager Cockpit KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Team', value: staff.length, icon: <FaUsers />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'On Shift', value: Math.floor(staff.length * 0.4), icon: <FaBolt />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                    { label: 'Performance', value: '94%', icon: <FaChartPie />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Open Roles', value: '2', icon: <FaIdCard />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-zinc-900/50 backdrop-blur-xl p-4 rounded-2xl border border-zinc-800"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                {kpi.icon}
                            </div>
                            <span className="text-xs text-zinc-400 font-medium">{kpi.label}</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold">{kpi.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaUserShield className="text-blue-400" />
                        Manager Command Center
                    </h2>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <FaPlus /> New Hire
                    </button>
                </div>

                {showAddForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-700 grid grid-cols-1 md:grid-cols-4 gap-4"
                        onSubmit={handleAddStaff}
                    >
                        <input
                            placeholder="Name"
                            className="bg-black/20 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-[var(--accent-color)]"
                            value={newStaff.name}
                            onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                            required
                        />
                        <select
                            className="bg-black/20 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-[var(--accent-color)]"
                            value={newStaff.role}
                            onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                        >
                            <option value="Employee">Employee</option>
                            <option value="Bar-Chef">Bar-Chef</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <input
                            placeholder="Skills (comma sep)"
                            className="bg-black/20 border border-zinc-700 rounded px-3 py-2 text-white outline-none focus:border-[var(--accent-color)]"
                            value={newStaff.skills}
                            onChange={e => setNewStaff({ ...newStaff, skills: e.target.value })}
                        />
                        <button className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 rounded px-4 py-2 hover:bg-emerald-600/30 transition-colors">
                            Save New Hire
                        </button>
                    </motion.form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staff.map((member, i) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 bg-zinc-900/20 backdrop-blur-md rounded-2xl border border-zinc-800/50 hover:border-blue-500/50 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${member.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' :
                                    member.role === 'Bar-Chef' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {member.role === 'Admin' ? <FaUserAstronaut /> : member.role === 'Bar-Chef' ? <FaUserTie /> : <FaUser />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{member.name}</h3>
                                    <div className="text-xs text-zinc-400 font-medium tracking-wide">{member.role}</div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {member.skills && member.skills.split(',').map((skill, si) => (
                                    <span key={si} className="text-[10px] px-2 py-0.5 bg-zinc-800/50 rounded-full border border-zinc-700/50 text-zinc-400 uppercase font-semibold tracking-tighter">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">ASSIGN SHIFT</button>
                                <button className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">EDIT PROFILE</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
