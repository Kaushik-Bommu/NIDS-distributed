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
  const [metrics, setMetrics] = useState({ totalScanned: 0, activeThreats: 0 });

  useEffect(() => {
    // 1. Fetch the last 50 logs when the page loads
    const fetchInitialData = async () => {
      const { data } = await supabase
        .from('network_intrusions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) setLogs(data);
    };
    fetchInitialData();

    // 2. Subscribe to REAL-TIME inserts!
    // This replaces your old setInterval('/api/scan-next')
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'network_intrusions' },
        (payload) => {
          const newLog = payload.new;
          console.log("🚨 New packet arrived instantly!", newLog);
          
          // Add the new log to the top of the UI list
          setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
          
          // Update your dashboard metrics instantly
          setMetrics((prev) => ({
            totalScanned: prev.totalScanned + 1,
            activeThreats: newLog.is_intrusion ? prev.activeThreats + 1 : prev.activeThreats
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