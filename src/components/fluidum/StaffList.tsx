import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaUserAstronaut, FaUser, FaPlus, FaSpinner } from 'react-icons/fa';

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
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaUserTie className="text-[var(--accent-color)]" />
                    Staff Management
                    <span className="text-sm px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">{staff.length} Active</span>
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                    <FaPlus /> Add Member
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
                        className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800 hover:border-[var(--accent-color)]/50 transition-colors group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${member.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' :
                                        member.role === 'Bar-Chef' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {member.role === 'Admin' ? <FaUserAstronaut /> : member.role === 'Bar-Chef' ? <FaUserTie /> : <FaUser />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{member.name}</h3>
                                    <div className="text-xs text-[var(--text-secondary)]">{member.role}</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {member.skills && member.skills.split(',').map((skill, si) => (
                                <span key={si} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-zinc-400">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
