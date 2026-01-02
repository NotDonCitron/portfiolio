import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaCube } from 'react-icons/fa';
import inventoryData from '../data/mockInventory.json';

// Type definition based on the JSON data
interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    location: string;
    status: string;
    lastUpdated: string;
}

const statusConfig: Record<string, { color: string, icon: React.ReactNode, label: string }> = {
    'in_stock': { color: 'text-emerald-400', icon: <FaCheckCircle />, label: 'In Stock' },
    'optimal': { color: 'text-blue-400', icon: <FaCheckCircle />, label: 'Optimal' },
    'low_stock': { color: 'text-amber-400', icon: <FaExclamationTriangle />, label: 'Low Stock' },
    'out_of_stock': { color: 'text-red-400', icon: <FaTimesCircle />, label: 'Out of Stock' },
};

const InventoryTwin = () => {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    return (
        <div className="w-full h-full relative flex flex-col md:flex-row gap-6 p-4">
            {/* Sidebar / Detail View (Mobile: Top, Desktop: Right) */}
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <motion.div
                        key={selectedItem.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="md:w-1/3 bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-xl p-6 shadow-2xl flex flex-col gap-4 z-20"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                                <div className="text-xs font-mono text-zinc-400">{selectedItem.id}</div>
                            </div>
                            <div className={`text-2xl ${statusConfig[selectedItem.status]?.color || 'text-zinc-400'}`}>
                                {statusConfig[selectedItem.status]?.icon || <FaBox />}
                            </div>
                        </div>

                        <div className="space-y-3 mt-2">
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-400 text-sm">Category</span>
                                <span className="text-zinc-200 text-sm font-medium">{selectedItem.category}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-400 text-sm">Location</span>
                                <span className="text-zinc-200 text-sm font-mono bg-zinc-800 px-2 rounded">{selectedItem.location}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-400 text-sm">Quantity</span>
                                <span className={`text-sm font-bold ${selectedItem.quantity === 0 ? 'text-red-500' : 'text-white'}`}>
                                    {selectedItem.quantity} units
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-zinc-400 text-sm">Status</span>
                                <span className={`text-sm font-medium ${statusConfig[selectedItem.status]?.color}`}>
                                    {statusConfig[selectedItem.status]?.label}
                                </span>
                            </div>
                            <div className="text-xs text-zinc-600 pt-2 text-right">
                                Last Updated: {new Date(selectedItem.lastUpdated).toLocaleString()}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="md:w-1/3 flex items-center justify-center text-zinc-600 text-sm italic"
                    >
                        Hover over an item to see details
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inventory Grid */}
            <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 content-start">
                {(inventoryData as InventoryItem[]).map((item, index) => (
                    <motion.div
                        key={item.id}
                        layoutId={item.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onHoverStart={() => setSelectedItem(item)}
                        onClick={() => setSelectedItem(item)} // For mobile tap
                        className={`
                            aspect-square rounded-lg border flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden group transition-colors
                            ${selectedItem?.id === item.id
                                ? 'bg-zinc-800/80 border-[var(--accent-color)] shadow-[0_0_15px_rgba(var(--accent-color-rgb),0.3)]'
                                : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60'
                            }
                        `}
                    >
                        <div className={`text-2xl ${statusConfig[item.status]?.color} transition-transform duration-300 group-hover:scale-110`}>
                            <FaCube />
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate w-full text-center px-1">
                            {item.location}
                        </div>

                        {/* Status Indicator Dot */}
                        <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${statusConfig[item.status]?.color.replace('text-', 'bg-')} shadow-sm`} />

                        {/* Selection Highlight Background */}
                        {selectedItem?.id === item.id && (
                            <motion.div
                                layoutId="highlight"
                                className="absolute inset-0 bg-[var(--accent-color)]/5 -z-10"
                            />
                        )}
                    </motion.div>
                ))}

                {/* Empty Slots Fillers for visuals */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-lg border border-zinc-800/30 bg-transparent flex items-center justify-center opacity-20">
                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryTwin;
