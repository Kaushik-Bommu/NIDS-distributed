import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import ThreatRadar from '../components/dashboard/ThreatRadar';
import ManualIngestion from '../components/dashboard/ManualIngestion';
import LiveConsole from '../components/dashboard/LiveConsole';

export default function LiveRadar() {
  // Master States
  const [metrics, setMetrics] = useState({ total_scanned: 0, active_threats: 0, model_accuracy: 98.4 });
  const [logs, setLogs] = useState([{ id: 'sys1', text: '[SYS] Kernel Initialization Complete. Waiting for manual ingestion...', type: 'sys' }]);
  const [radarPoints, setRadarPoints] = useState([]);
  
  // 🔴 THIS IS THE MASTER SWITCH! It starts as FALSE so the scanner waits for you.
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let scanInterval;

    // 🔴 ONLY start polling the backend if isScanning is TRUE
    if (isScanning) {
      scanInterval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/scan-next');
          const data = await response.json();

          if (data.error) return;

          setMetrics(data.metrics);

          const isBlocked = data.status === 'BLOCKED';
          const newLog = {
            id: data.packet_id + '-' + Date.now(),
            text: `[NET] ${data.timestamp} Packet #${data.packet_id} - ${data.protocol} - Confidence: ${data.confidence.toFixed(1)}% - ${data.status}`,
            type: isBlocked ? 'error' : 'normal'
          };
          
          setLogs(prevLogs => [...prevLogs, newLog].slice(-50));

          setRadarPoints(prevPoints => {
            const nextPoints = [...prevPoints, { confidence: data.confidence, status: data.status }];
            return nextPoints.slice(-20);
          });

        } catch (error) {
          console.error("Connection matrix disconnected from server backend:", error);
          setIsScanning(false); // Auto-stop if server crashes
        }
      }, 2000);
    }

    // Cleanup interval on stop
    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [isScanning]); // React re-runs this whenever you click the button!

  // The function the button will call to flip the switch
  const toggleScan = () => {
    setIsScanning(!isScanning);
  };

  return (
    <div className="space-y-gutter">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard 
          icon="inventory_2"
          title="Total Packets Scanned"
          value={metrics.total_scanned.toLocaleString()}
          trendIcon="trending_up"
          trendText={isScanning ? "Pipeline Active" : "Pipeline Paused"}
          variant="primary"
        />
        <StatCard 
          icon="warning"
          title="Active Threats"
          value={metrics.active_threats.toString()}
          trendIcon="error"
          trendText={metrics.active_threats > 0 ? "CRITICAL ANOMALY DETECTED" : "SYSTEM SECURE"}
          variant={metrics.active_threats > 0 ? "error" : "primary"}
        />
        <StatCard 
          icon="verified_user"
          title="Model Accuracy"
          value={`${metrics.model_accuracy}%`}
          trendIcon="check_circle"
          trendText="Sentinel-V3 Engine Active"
          variant="secondary"
        />
      </div>

      <ThreatRadar dataPoints={radarPoints} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter pb-8">
        {/* 🔴 WE PASS THE REMOTE CONTROL TO THE BUTTON HERE */}
        <ManualIngestion isScanning={isScanning} onToggleScan={toggleScan} />
        <LiveConsole incomingLogs={logs} />
      </div>
    </div>
  );
}