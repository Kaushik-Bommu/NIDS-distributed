import { useEffect, useRef } from 'react';

export default function LiveConsole({ incomingLogs }) {
  const terminalRef = useRef(null);

  // Auto-scroll logic stays right here
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [incomingLogs]);

  return (
    <div className="bg-surface-container border border-outline-variant p-0 flex flex-col h-[400px]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high">
        <h4 className="text-sm font-data-mono font-bold text-on-surface-variant">Live Console</h4>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-6 font-data-mono text-xs overflow-y-auto space-y-2 bg-[#060f16]"
      >
        {incomingLogs?.map((log) => (
          <div key={log.id} className={log.type === 'error' ? 'text-error font-bold' : (log.type === 'sys' ? 'text-secondary' : 'text-primary-fixed-dim')}>
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
}