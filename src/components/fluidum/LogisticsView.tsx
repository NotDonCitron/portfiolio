import { useState, useEffect } from 'react';
import { FaChartLine, FaExclamationTriangle, FaTruckLoading } from 'react-icons/fa';

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: string;
}

export default function LogisticsView() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/fluidum/logistics');
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch inventory', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <FaTruckLoading className="text-[var(--accent-color)]" />
                    Smart Logistics & Optimization
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <h3 className="text-lg font-bold text-amber-500 mb-2 flex items-center gap-2"><FaExclamationTriangle /> Low Stock Alerts</h3>
                        <ul className="space-y-2">
                            {items.filter((i: InventoryItem) => i.status === 'Low Stock').map((item: InventoryItem) => (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <span>{item.name}</span>
                                    <span className="font-mono text-red-400">{item.quantity} {item.unit}</span>
                                </li>
                            ))}
                            {items.filter((i: InventoryItem) => i.status === 'Low Stock').length === 0 && (
                                <li className="text-zinc-400 italic">No critical stock alerts.</li>
                            )}
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2"><FaChartLine /> Process Optimization</h3>
                        <div className="text-sm text-zinc-400 space-y-2">
                            <p>• Automated re-order suggestions based on consumption velocity.</p>
                            <p>• Shift-based consumption analysis active.</p>
                            <p className="text-emerald-400 font-bold">• Recommendation: Bulk order Lime Juice on Friday.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Item</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loading ? (
                                <tr><td colSpan={4} className="p-4 text-center">Loading logistics data...</td></tr>
                            ) : (
                                items.map((item: InventoryItem) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-zinc-400 text-sm">{item.category}</td>
                                        <td className="p-4 font-mono">{item.quantity} {item.unit}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Low Stock' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                                }`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
