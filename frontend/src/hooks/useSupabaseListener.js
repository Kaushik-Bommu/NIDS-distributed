import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';



// Run this in your local React frontend folder first:
// npm install @supabase/supabase-js




// IMPORTANT: Use your PUBLIC/ANON key here, NOT the service_role key!
const SUPABASE_URL = 'https://jivdvfwqcpwzdgyjpkeu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6xp4ruhQNMG6HBUFfODm5Q_O8W6tDO8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function useSupabaseListener() {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({ totalScanned: 0, activeThreats: 0, totalBytes: 0 });

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data } = await supabase
        .from('network_intrusions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) {
        setLogs(data);
        // Calculate initial bandwidth from the first 50 logs
        const initialBytes = data.reduce((acc, log) => acc + (log.src_bytes || 0) + (log.dst_bytes || 0), 0);
        setMetrics(prev => ({ ...prev, totalBytes: initialBytes }));
      }
    };
    fetchInitialData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'network_intrusions' },
        (payload) => {
          const newLog = payload.new;
          
          setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
          
          // 2. UPDATE the metrics dynamically with the new byte columns!
          setMetrics((prev) => ({
            totalScanned: prev.totalScanned + 1,
            activeThreats: newLog.is_intrusion ? prev.activeThreats + 1 : prev.activeThreats,
            totalBytes: prev.totalBytes + (newLog.src_bytes || 0) + (newLog.dst_bytes || 0)
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { logs, metrics };
}