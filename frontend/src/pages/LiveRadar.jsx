import { useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
import ThreatRadar from '../components/dashboard/ThreatRadar';
import ManualIngestion from '../components/dashboard/ManualIngestion';
import LiveConsole from '../components/dashboard/LiveConsole';
import { useSupabaseListener } from '../hooks/useSupabaseListener';


export default function LiveRadar() {
  // 🔴 THE NEW MASTER HOOK: Plugs directly into Supabase WebSockets!
  // This replaces all your old local state and fetch() polling
  const { logs: rawLogs, metrics: rawMetrics } = useSupabaseListener();
  
  // We still keep this switch to control the ManualIngestion component
  const [isScanning, setIsScanning] = useState(false);

  // The function the button will call to flip the switch
  const toggleScan = () => {
    setIsScanning(!isScanning);
  };

  // ==========================================
  // DATA ADAPTERS 
  // We format the raw DB rows into the shapes your UI components expect
  // ==========================================

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  // 1. Format Metrics
  const metrics = {
    total_scanned: rawMetrics?.totalScanned || 0,
    active_threats: rawMetrics?.activeThreats || 0,
    bandwidth: formatBytes(rawMetrics?.totalBytes || 0) 
  };

  // 2. Format Logs for the LiveConsole
  let formattedLogs = rawLogs.map(log => {
    const time = new Date(log.timestamp).toLocaleTimeString();
    const byteString = `[↑${log.src_bytes}B ↓${log.dst_bytes}B]`;
    return {
      id: log.id,
      text: `[NET] ${time} Packet - IP: ${log.source_ip} - ${log.protocol.toUpperCase()} ${byteString} - ${log.is_intrusion ? 'BLOCKED' : 'ALLOWED'}`,  
      type: log.is_intrusion ? 'error' : 'normal'
    };
  });

  // Default system init log if DB is completely empty
  if (formattedLogs.length === 0) {
    formattedLogs = [{ id: 'sys1', text: '[SYS] Kernel Initialization Complete. Waiting for manual ingestion...', type: 'sys' }];
  }

  // 3. Format Radar Points (Mocking a confidence score based on the boolean)
  const radarPoints = rawLogs.slice(0, 20).map(log => ({
    // If intrusion, confidence is 90-99%. If normal, confidence is 10-25%
    confidence: log.is_intrusion ? 90 + Math.random() * 9 : 10 + Math.random() * 15,
    status: log.is_intrusion ? 'BLOCKED' : 'ALLOWED'
  })).reverse(); // Reversing so newest points enter the radar correctly

  return (
    <div className="space-y-4 p-6 bg-gray-950 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          icon="router"
          title="Bandwidth Analyzed"
          value={metrics.bandwidth}
          trendIcon="swap_vert"
          trendText="Live Payload Telemetry"
          variant="secondary"
        />
      </div>

      <ThreatRadar dataPoints={radarPoints} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
        {/* 🔴 WE PASS THE REMOTE CONTROL TO THE BUTTON HERE */}
        <ManualIngestion isScanning={isScanning} onToggleScan={toggleScan} />
        <LiveConsole incomingLogs={formattedLogs} />
      </div>
    </div>
  );
}