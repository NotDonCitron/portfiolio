import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaExclamationTriangle, FaTruckLoading, FaMicrochip, FaDatabase } from 'react-icons/fa';

interface InventoryItem {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    status: string;
    consumption_rate?: number;
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
        <div className="space-y-6 font-mono">
            <div className="bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                        <FaMicrochip className="text-[var(--accent-color)]" />
                        LOGISTICS_PIPELINE // THROUGHPUT_ANALYSIS
                    </h2>
                    <div className="flex gap-2">
                        <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] rounded">GATEWAY_ACTIVE</div>
                        <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[10px] rounded">DB_SYNC_OK</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaExclamationTriangle size={60} />
                        </div>
                        <h3 className="text-sm font-bold text-amber-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <FaExclamationTriangle /> Stock_Buffer_Alerts
                        </h3>
                        <div className="space-y-3">
                            {items.filter(i => i.status === 'Low Stock').map(item => (
                                <div key={item.id} className="flex justify-between items-end border-b border-zinc-800 pb-1">
                                    <span className="text-xs text-zinc-400">{item.name}</span>
                                    <span className="text-sm font-bold text-red-500">{item.quantity} {item.unit}</span>
                                </div>
                            ))}
                            {items.filter(i => i.status === 'Low Stock').length === 0 && (
                                <div className="text-[10px] text-zinc-600 italic">SYSTEM_STATUS: NO_INVENTORY_ANOMALIES_DETECTED</div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaChartLine size={60} />
                        </div>
                        <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                            <FaChartLine /> Prediction_Engine
                        </h3>
                        <div className="text-[11px] text-zinc-400 space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">▶</span>
                                <span>LEAD-TIME_MODELS: Consumption velocity integrated via RFID nodes.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-blue-500">▶</span>
                                <span>FIFO_OPTIMIZATION: Priority restock recommended for Zone Cold-Store-1.</span>
                            </div>
                            <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded text-emerald-400 font-bold text-[10px]">
                                RECOMMENDATION: BULK_ORDER [LIME_JUICE] BY FRIDAY_1600HRS.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="p-2 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-tighter">
                        <div className="flex gap-4">
                            <span>NAME</span>
                            <span className="hidden md:inline">SYSTEM_UID</span>
                        </div>
                        <div className="flex gap-12">
                            <span>LATENCY</span>
                            <span>STOCK_LEVEL</span>
                        </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-zinc-600 animate-pulse text-xs">SCANNING_INVENTORY_NODES...</div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className="p-3 border-b border-zinc-900 hover:bg-zinc-800/30 transition-colors flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-200 group-hover:text-[var(--accent-color)] transition-colors">{item.name}</span>
                                        <span className="text-[9px] text-zinc-600">{item.category} // SUID_{item.id * 1024}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] text-emerald-500/50 hidden sm:inline">2.4ms</span>
                                        <div className="text-right">
                                            <div className="text-sm font-bold truncate text-zinc-300">{item.quantity} {item.unit}</div>
                                            <div className={`text-[9px] font-bold ${item.status === 'Low Stock' ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {item.status === 'Low Stock' ? 'BUFFER_INSUFFICIENT' : 'BUFFER_NOMINAL'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[9px] text-zinc-600">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><FaDatabase /> SQLITE_LOCAL</span>
                        <span className="flex items-center gap-1"><FaDatabase /> RFID_BRIDGE_v2.0</span>
                    </div>
                    <div className="italic">COMPILED_BY: ANTIGRAVITY_CORE</div>
                </div>
            </div>
        </div>
    );
}
