import { useState, useEffect } from 'react';

interface Log {
   id: number;
   type: 'alert' | 'info' | 'warn';
   ip: string;
   time: string;
   msg: string;
}

const MockFirewall = () => {
   const [logs, setLogs] = useState<Log[]>([
      { id: 1, type: 'alert', ip: '192.168.1.45', time: '2s ago', msg: 'Port scan detected' },
      { id: 2, type: 'info', ip: '10.0.0.12', time: '5s ago', msg: 'Connection accepted' },
      { id: 3, type: 'warn', ip: '172.16.0.8', time: '8s ago', msg: 'Brute force attempt' },
   ]);

   useEffect(() => {
      const interval = setInterval(() => {
         const newLog: Log = {
            id: Date.now(),
            type: Math.random() > 0.5 ? 'info' : (Math.random() > 0.5 ? 'warn' : 'alert'),
            ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            time: 'now',
            msg: ['Port scan', 'Connection', 'DDoS', 'Brute force', 'Syn flood'][Math.floor(Math.random() * 5)] + ' detected'
         };
         setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }, 2000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="bg-black/50 rounded-lg p-3 font-mono text-xs space-y-2">
         {logs.map(log => (
            <div key={log.id} className={`flex items-center gap-2 ${log.type === 'alert' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'}`}>
               <span className="opacity-50">[{log.time}]</span>
               <span className="opacity-75">{log.ip}</span>
               <span className="flex-1 truncate">{log.msg}</span>
            </div>
         ))}
      </div>
   );
};

export default MockFirewall;