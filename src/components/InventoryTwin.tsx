import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryItem {
    id: string; sku: string; name: string; category: string; quantity: number; par_level: number; unit: string; cost: number; location: string; velocity: number;
}

const CATEGORIES = [
    { code: 'SPR', name: 'Spirits' }, { code: 'WIN', name: 'Wine' }, { code: 'BER', name: 'Beer' }, { code: 'MIX', name: 'Mixers' }, { code: 'GAR', name: 'Garnish' },
];

const TECH_STACK = ['React', 'TypeScript', 'Flask', 'SQLite'];

const DEMO_DATA: InventoryItem[] = [
    { id: '1', sku: 'SPR-0001', name: 'Absolut Vodka 0.7L', category: 'SPR', quantity: 8, par_level: 5, unit: 'BTL', cost: 15.99, location: 'A1-01', velocity: 2.3 },
    { id: '2', sku: 'SPR-0002', name: 'Havana Club 7yr 0.7L', category: 'SPR', quantity: 3, par_level: 4, unit: 'BTL', cost: 22.99, location: 'A1-02', velocity: 1.8 },
    { id: '3', sku: 'SPR-0003', name: 'Tanqueray Gin 0.7L', category: 'SPR', quantity: 6, par_level: 3, unit: 'BTL', cost: 19.99, location: 'A1-03', velocity: 1.5 },
    { id: '4', sku: 'SPR-0004', name: 'Aperol 1L', category: 'SPR', quantity: 12, par_level: 5, unit: 'BTL', cost: 14.99, location: 'A1-04', velocity: 3.2 },
    { id: '5', sku: 'WIN-0001', name: 'Prosecco 0.75L', category: 'WIN', quantity: 24, par_level: 10, unit: 'BTL', cost: 6.99, location: 'B2-01', velocity: 4.5 },
    { id: '6', sku: 'WIN-0002', name: 'Riesling 0.75L', category: 'WIN', quantity: 8, par_level: 6, unit: 'BTL', cost: 8.99, location: 'B2-02', velocity: 1.2 },
    { id: '7', sku: 'BER-0001', name: 'Warsteiner 0.5L', category: 'BER', quantity: 48, par_level: 24, unit: 'BTL', cost: 0.89, location: 'C1-01', velocity: 8.0 },
    { id: '8', sku: 'BER-0002', name: 'Corona 0.33L', category: 'BER', quantity: 18, par_level: 12, unit: 'BTL', cost: 1.29, location: 'C1-02', velocity: 3.5 },
    { id: '9', sku: 'MIX-0001', name: 'Coca-Cola 1L', category: 'MIX', quantity: 15, par_level: 10, unit: 'BTL', cost: 1.49, location: 'D1-01', velocity: 5.0 },
    { id: '10', sku: 'MIX-0002', name: 'Red Bull 0.25L', category: 'MIX', quantity: 36, par_level: 20, unit: 'CAN', cost: 1.19, location: 'D1-02', velocity: 6.2 },
    { id: '11', sku: 'MIX-0003', name: 'Tonic Water 0.2L', category: 'MIX', quantity: 2, par_level: 12, unit: 'BTL', cost: 1.59, location: 'D1-03', velocity: 4.0 },
    { id: '12', sku: 'GAR-0001', name: 'Lime 500g', category: 'GAR', quantity: 4, par_level: 3, unit: 'PKG', cost: 2.99, location: 'E1-01', velocity: 1.0 },
    { id: '13', sku: 'GAR-0002', name: 'Mint Bunch', category: 'GAR', quantity: 2, par_level: 4, unit: 'BND', cost: 1.99, location: 'E1-02', velocity: 2.0 },
];

const BarInventorySystem = () => {
    const [items, setItems] = useState<InventoryItem[]>(DEMO_DATA);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<'sku' | 'name' | 'quantity' | 'cost'>('sku');
    const [sortAsc, setSortAsc] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const [showArch, setShowArch] = useState(false);
    const [dbQueries, setDbQueries] = useState(0);
    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = useCallback((msg: string, type = 'SYS') => {
        const ts = new Date().toLocaleTimeString('de-DE', { hour12: false });
        setLogs(prev => [...prev.slice(-15), `[${ts}] [${type}] ${msg}`]);
        if (type === 'SQL') setDbQueries(q => q + 1);
    }, []);

    useEffect(() => { addLog('Backend connected :5000', 'API'); addLog(`SELECT * FROM inventory → ${items.length}`, 'SQL'); }, []);
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

    const filtered = items
        .filter(i => (!activeCategory || i.category === activeCategory) && (!searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase())))
        .sort((a, b) => { const av = a[sortField], bv = b[sortField]; return typeof av === 'string' ? (sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av)) : sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number); });

    const handleSort = (f: typeof sortField) => { if (sortField === f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true); } };
    const adjustQty = (item: InventoryItem, d: number) => { const nq = Math.max(0, item.quantity + d); setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: nq } : i)); addLog(`UPDATE SET qty=${nq} WHERE sku='${item.sku}'`, 'SQL'); if (selectedItem?.id === item.id) setSelectedItem({ ...item, quantity: nq }); };
    const getStatus = (i: InventoryItem) => { const r = i.quantity / i.par_level; return r <= 0.5 ? { l: 'critical', t: 'CRIT' } : r <= 1 ? { l: 'low', t: 'LOW' } : { l: 'ok', t: 'OK' }; };
    const getDays = (i: InventoryItem) => i.velocity > 0 ? Math.max(0, Math.round((i.quantity - i.par_level * 0.5) / i.velocity)) : null;

    const totalVal = items.reduce((s, i) => s + i.quantity * i.cost, 0);
    const lowCount = items.filter(i => getStatus(i).l !== 'ok').length;

    return (
        <div className="w-full h-full flex flex-col gap-2 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">INV_API</span><span className="text-zinc-600 text-[9px]">v2.1</span></div>
                    <div className="hidden md:flex gap-1">{TECH_STACK.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[8px] bg-zinc-800 text-zinc-400 border border-zinc-700">{t}</span>)}</div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex gap-3 text-[9px] text-zinc-500"><span>API: <span className="text-emerald-400">12ms</span></span><span>SQL: <span className="text-blue-400">{dbQueries}</span></span></div>
                    <button onClick={() => setShowArch(!showArch)} className={`px-2 py-1 text-[9px] rounded border ${showArch ? 'bg-zinc-700 border-zinc-600 text-zinc-200' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>{showArch ? '← DATA' : 'ARCH →'}</button>
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="query..." className="w-24 sm:w-32 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[11px] text-zinc-300 placeholder-zinc-600 focus:outline-none" />
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex flex-wrap gap-1">
                    <button onClick={() => { setActiveCategory(null); addLog('WHERE *', 'SQL'); }} className={`px-2 py-1 text-[10px] uppercase rounded ${!activeCategory ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800'}`}>ALL</button>
                    {CATEGORIES.map(c => <button key={c.code} onClick={() => { setActiveCategory(c.code); addLog(`WHERE cat='${c.code}'`, 'SQL'); }} className={`px-2 py-1 text-[10px] uppercase rounded flex items-center gap-1 ${activeCategory === c.code ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800'}`}>{c.code} <span className="text-zinc-600">{items.filter(i => i.category === c.code).length}</span>{items.some(i => i.category === c.code && getStatus(i).l !== 'ok') && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}</button>)}
                </div>
                <div className="flex gap-3 text-[10px]"><span className="text-zinc-500">Σ <span className="text-zinc-300">{items.length}</span></span><span className="text-zinc-500">€ <span className="text-emerald-400">{totalVal.toFixed(0)}</span></span><span className="text-zinc-500">⚠ <span className={lowCount > 0 ? 'text-amber-400' : 'text-zinc-600'}>{lowCount}</span></span></div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0">
                <div className="flex-1 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded overflow-hidden min-h-0">
                    {showArch ? (
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            <div className="border border-zinc-700 rounded p-3"><h3 className="text-[11px] text-zinc-400 uppercase mb-3 border-b border-zinc-800 pb-2">Architecture</h3><div className="grid grid-cols-3 gap-2 text-[10px]"><div className="bg-zinc-800 rounded p-2 text-center"><div className="text-blue-400 font-bold">Frontend</div><div className="text-zinc-500">React + TS</div></div><div className="bg-zinc-800 rounded p-2 text-center"><div className="text-emerald-400 font-bold">API</div><div className="text-zinc-500">Flask REST</div></div><div className="bg-zinc-800 rounded p-2 text-center"><div className="text-purple-400 font-bold">DB</div><div className="text-zinc-500">SQLite</div></div></div></div>
                            <div className="border border-zinc-700 rounded p-3"><h3 className="text-[11px] text-zinc-400 uppercase mb-3 border-b border-zinc-800 pb-2">Endpoints</h3><div className="space-y-1 text-[10px] font-mono">{[['GET', '/api/inventory', 'List'], ['POST', '/api/inventory', 'Create'], ['PATCH', '/api/inventory/:sku', 'Update'], ['DELETE', '/api/inventory/:sku', 'Delete']].map(([m, p, d]) => <div key={p + m} className="flex gap-2"><span className={`px-1.5 py-0.5 rounded text-[9px] ${m === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : m === 'POST' ? 'bg-blue-500/20 text-blue-400' : m === 'PATCH' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{m}</span><span className="text-zinc-400">{p}</span><span className="text-zinc-600 ml-auto">{d}</span></div>)}</div></div>
                            <div className="border border-zinc-700 rounded p-3"><h3 className="text-[11px] text-zinc-400 uppercase mb-3 border-b border-zinc-800 pb-2">Schema</h3><pre className="text-[9px] text-zinc-500 bg-black/40 p-2 rounded">{`CREATE TABLE inventory (\n  sku VARCHAR(16) PRIMARY KEY,\n  name VARCHAR(128),\n  category CHAR(3),\n  quantity INT, par_level INT,\n  cost DECIMAL(10,2)\n);`}</pre></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-[80px_1fr_60px_60px_50px] sm:grid-cols-[90px_1fr_70px_70px_70px_60px] gap-2 px-3 py-2 bg-zinc-800/80 border-b border-zinc-700 text-[10px] text-zinc-400 uppercase">
                                {(['sku', 'name', 'quantity', 'cost'] as const).map(f => <button key={f} onClick={() => handleSort(f)} className="text-left hover:text-zinc-200 flex items-center gap-1">{f === 'quantity' ? 'Qty' : f.charAt(0).toUpperCase() + f.slice(1)} {sortField === f && <span className="text-[var(--accent-color)]">{sortAsc ? '↑' : '↓'}</span>}</button>)}
                                <span className="hidden sm:block">Loc</span><span className="text-center">Status</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {filtered.length === 0 ? <div className="flex items-center justify-center h-32 text-zinc-600">No items</div> : filtered.map(item => {
                                    const st = getStatus(item); const sel = selectedItem?.id === item.id; return (
                                        <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { setSelectedItem(item); addLog(`SELECT WHERE sku='${item.sku}'`, 'SQL'); }} className={`grid grid-cols-[80px_1fr_60px_60px_50px] sm:grid-cols-[90px_1fr_70px_70px_70px_60px] gap-2 px-3 py-2 border-b border-zinc-800/50 cursor-pointer ${sel ? 'bg-zinc-800 border-l-2 border-l-[var(--accent-color)]' : 'hover:bg-zinc-800/50'}`}>
                                            <span className="text-zinc-400">{item.sku}</span><span className="text-zinc-200 truncate">{item.name}</span>
                                            <span className={`font-bold ${st.l === 'critical' ? 'text-red-400' : st.l === 'low' ? 'text-amber-400' : 'text-zinc-300'}`}>{item.quantity}</span>
                                            <span className="text-zinc-400">€{item.cost.toFixed(2)}</span><span className="hidden sm:block text-zinc-500">{item.location}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-center ${st.l === 'critical' ? 'bg-red-500/20 text-red-400' : st.l === 'low' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{st.t}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div className="lg:w-72 flex flex-col gap-2 min-h-0">
                    <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded p-3 overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {selectedItem ? (
                                <motion.div key={selectedItem.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                    <div className="border-b border-zinc-800 pb-3"><div className="text-[10px] text-[var(--accent-color)] mb-1">{selectedItem.sku}</div><h3 className="text-sm font-bold text-white">{selectedItem.name}</h3></div>
                                    <div><div className="text-[10px] text-zinc-500 uppercase mb-2">Adjust</div><div className="grid grid-cols-5 gap-1">{[-5, -1, 0, 1, 6].map(d => <button key={d} onClick={() => d !== 0 && adjustQty(selectedItem, d)} className={`py-2 rounded text-[11px] font-bold ${d === 0 ? 'bg-zinc-800 text-zinc-300' : d < 0 ? 'bg-zinc-800 hover:bg-red-500/30 text-zinc-400' : 'bg-zinc-800 hover:bg-emerald-500/30 text-zinc-400'}`}>{d === 0 ? selectedItem.quantity : d > 0 ? `+${d}` : d}</button>)}</div></div>
                                    <div className="space-y-1 text-[11px]">{[['Category', CATEGORIES.find(c => c.code === selectedItem.category)?.name], ['Location', selectedItem.location], ['Par Level', `${selectedItem.par_level} ${selectedItem.unit}`], ['Cost', `€${selectedItem.cost.toFixed(2)}`], ['Value', `€${(selectedItem.quantity * selectedItem.cost).toFixed(2)}`]].map(([k, v]) => <div key={k as string} className="flex justify-between py-1 border-b border-zinc-800/50"><span className="text-zinc-500">{k}</span><span className={k === 'Value' ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>{v}</span></div>)}</div>
                                    <div className="bg-zinc-800/50 rounded p-2"><div className="text-[10px] text-zinc-500 uppercase mb-2">Forecast</div><div className="flex justify-between text-[11px]"><span className="text-zinc-400">Velocity</span><span className="text-blue-400">{selectedItem.velocity}/day</span></div><div className="h-1 bg-zinc-700 rounded-full my-1"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(selectedItem.velocity * 10, 100)}%` }} /></div><div className="flex justify-between text-[11px]"><span className="text-zinc-400">Reorder</span><span className={`font-bold ${(getDays(selectedItem) ?? 99) <= 3 ? 'text-red-400' : 'text-zinc-300'}`}>{getDays(selectedItem) ?? 'N/A'} days</span></div></div>
                                </motion.div>
                            ) : <div className="h-full flex items-center justify-center text-zinc-600 text-center text-[11px]">Select item to view details</div>}
                        </AnimatePresence>
                    </div>
                    <div className="h-24 bg-black/80 border border-zinc-800 rounded p-2 font-mono text-[10px] text-emerald-500/80 overflow-hidden flex flex-col">
                        <div className="flex gap-2 border-b border-zinc-900 pb-1 mb-1 text-zinc-600 text-[9px]"><span>$</span> sys.log</div>
                        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>{logs.map((l, i) => <div key={i} className="mb-0.5 leading-tight">{l}</div>)}<div ref={logEndRef} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarInventorySystem;
