import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaThermometerHalf, FaBox, FaHistory, FaSave, FaTrash, FaQrcode } from 'react-icons/fa';

interface ScanLog {
    id: string; // Unique scan ID
    timestamp: number;
    itemId: string;
    temperature: number;
}

interface HACCPScannerProps {
    isOpen: boolean;
    onClose: () => void;
}

const HACCPScanner: React.FC<HACCPScannerProps> = ({ isOpen, onClose }) => {
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [temperature, setTemperature] = useState<string>('');
    const [logs, setLogs] = useState<ScanLog[]>(() => {
        const saved = localStorage.getItem('haccp-logs');
        return saved ? JSON.parse(saved) : [];
    });
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Persist logs
    useEffect(() => {
        localStorage.setItem('haccp-logs', JSON.stringify(logs));
    }, [logs]);

    // Initialize/Cleanup Scanner
    useEffect(() => {
        if (isOpen && !scannedResult) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        showTorchButtonIfSupported: true,
                    },
                    /* verbose= */ false
                );

                scanner.render(
                    (decodedText) => {
                        setScannedResult(decodedText);
                        scanner.clear();
                    },
                    (_error) => {
                        // console.warn(error); // Reduce console noise
                    }
                );
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
                }
            };
        }
    }, [isOpen, scannedResult]);

    const handleSave = () => {
        if (scannedResult && temperature) {
            const newLog: ScanLog = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                itemId: scannedResult,
                temperature: parseFloat(temperature)
            };
            setLogs([newLog, ...logs]);
            setScannedResult(null);
            setTemperature('');
        }
    };

    const handleClearLogs = () => {
        if (window.confirm("Sind Sie sicher, dass Sie alle Protokolle löschen möchten?")) {
            setLogs([]);
        }
    };

    const handleReset = () => {
        setScannedResult(null);
        setTemperature('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-[var(--accent-color)]/10 p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[var(--accent-color)]">
                                <FaQrcode className="text-xl" />
                                <h2 className="font-bold text-lg">HACCP Scanner</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[var(--text-primary)]/10 rounded-full transition-colors text-[var(--text-primary)]"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Scanner Area */}
                            {!scannedResult ? (
                                <div className="space-y-4">
                                    <div id="reader" className="overflow-hidden rounded-xl border-2 border-dashed border-[var(--border-color)]"></div>
                                    <p className="text-center text-sm text-[var(--text-secondary)]">
                                        Richten Sie die Kamera auf einen QR-Code für Lagerware.
                                    </p>
                                    {/* Mock Button for Testing without Camera */}
                                    <div className="text-center">
                                        <button
                                            onClick={() => setScannedResult("ITEM-" + Math.floor(Math.random() * 10000))}
                                            className="text-xs text-[var(--text-secondary)] underline decoration-dotted hover:text-[var(--accent-color)]"
                                        >
                                            [DEV] QR-Scan simulieren
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Result Form */
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="p-4 bg-[var(--accent-color)]/10 rounded-xl border border-[var(--accent-color)]/20">
                                        <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Erkanntes Objekt</div>
                                        <div className="text-xl font-mono font-bold text-[var(--text-primary)] flex items-center gap-2">
                                            <FaBox /> {scannedResult}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                                            <FaThermometerHalf /> Temperatur (°C)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={temperature}
                                            onChange={(e) => setTemperature(e.target.value)}
                                            placeholder="z.B. 4.5"
                                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-3 text-lg font-mono focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={!temperature}
                                            className="flex-1 bg-[var(--accent-color)] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaSave /> Speichern
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-3 border border-[var(--border-color)] rounded-xl hover:bg-[var(--text-primary)]/5 transition-colors text-[var(--text-secondary)]"
                                        >
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Recent Logs Table */}
                            <div className="border-t border-[var(--border-color)] pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold flex items-center gap-2 text-[var(--text-primary)]">
                                        <FaHistory /> Protokoll
                                    </h3>
                                    {logs.length > 0 && (
                                        <button
                                            onClick={handleClearLogs}
                                            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                                        >
                                            <FaTrash /> Löschen
                                        </button>
                                    )}
                                </div>

                                {logs.length === 0 ? (
                                    <div className="text-center text-[var(--text-secondary)] text-sm py-8 bg-[var(--bg-card)]/50 rounded-lg border border-dashed border-[var(--border-color)]">
                                        Keine Scans vorhanden
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                        {logs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="bg-[var(--bg-card)]/50 border border-[var(--border-color)] p-3 rounded-lg flex justify-between items-center text-sm"
                                            >
                                                <div>
                                                    <div className="font-mono font-bold text-[var(--text-primary)]">{log.itemId}</div>
                                                    <div className="text-xs text-[var(--text-secondary)]">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className={`font-mono font-bold ${log.temperature > 7 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    {log.temperature}°C
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HACCPScanner;
