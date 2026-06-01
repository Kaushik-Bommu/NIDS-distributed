import React, { useState } from 'react';

export default function Settings() {
  const [autoBlock, setAutoBlock] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveComplete, setSaveComplete] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveComplete(false);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveComplete(true);
      
      setTimeout(() => {
        setSaveComplete(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Configuration Console</h2>
        <p className="font-body-md text-on-surface-variant mt-2 max-w-xl">Adjust system heuristics, manage external cloud integrations, and define response protocols for real-time threat mitigation.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-surface-container rounded-xl p-8 glow-border">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary-fixed-dim">cloud_sync</span>
            <h3 className="font-headline-lg text-lg uppercase tracking-widest text-primary/80">Cloud Integration</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter block">IBM Cloud API Key</label>
              <div className="relative group input-glow bg-surface-container-low rounded-lg border border-outline-variant">
                <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">key</span>
                </span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 px-10 py-3 font-data-mono text-data-mono text-primary" 
                  placeholder="Enter API Key" 
                  type="password" 
                  defaultValue="••••••••••••••••"
                />
                <button className="absolute inset-y-0 right-3 flex items-center text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter block">API Endpoint URL</label>
              <div className="relative group input-glow bg-surface-container-low rounded-lg border border-outline-variant">
                <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">link</span>
                </span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 px-10 py-3 font-data-mono text-data-mono text-primary" 
                  placeholder="Enter endpoint URL" 
                  type="url" 
                  defaultValue="https://api.cloud.ibm.com/v1/nids-connector"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container rounded-xl p-8 glow-border">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary-fixed-dim">shield</span>
            <h3 className="font-headline-lg text-lg uppercase tracking-widest text-primary/80">Operational Policies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toggle: Auto-Block Threats */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="space-y-1">
                <div className="font-body-md font-bold text-on-surface">Auto-Block Threats</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Automatically null-route high-confidence anomalies.</div>
              </div>
              <button 
                onClick={() => setAutoBlock(!autoBlock)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ring-offset-background focus:ring-2 focus:ring-primary ${autoBlock ? 'bg-primary-container' : 'bg-outline-variant'}`}
              >
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transform transition-transform duration-300 ${autoBlock ? 'translate-x-6 bg-on-surface !bg-primary-container' : 'bg-on-surface'}`}></div>
              </button>
            </div>

            {/* Toggle: Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <div className="space-y-1">
                <div className="font-body-md font-bold text-on-surface">Email Notifications</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Instant alert routing for Critical incidents.</div>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ring-offset-background focus:ring-2 focus:ring-primary ${emailNotifs ? 'bg-primary-container' : 'bg-outline-variant'}`}
              >
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transform transition-transform duration-300 ${emailNotifs ? 'translate-x-6 bg-on-primary' : 'bg-on-surface'}`}></div>
              </button>
            </div>

            {/* Toggle: Verbose Logging */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant md:col-span-2">
              <div className="space-y-1">
                <div className="font-body-md font-bold text-on-surface">Verbose Logging</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Collect detailed payload snapshots for every ingested packet. Increases storage overhead by 400%.</div>
              </div>
              <button 
                onClick={() => setVerboseLogging(!verboseLogging)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ring-offset-background focus:ring-2 focus:ring-primary ${verboseLogging ? 'bg-primary-container' : 'bg-outline-variant'}`}
              >
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transform transition-transform duration-300 ${verboseLogging ? 'translate-x-6 bg-on-primary' : 'bg-on-surface'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving || saveComplete}
            className={`primary-button-glow py-4 px-12 rounded-lg font-headline-lg text-lg font-black uppercase tracking-widest flex items-center gap-3 group transition-all active:scale-95 ${saveComplete ? 'bg-primary text-on-primary-fixed' : (isSaving ? 'bg-primary-container text-on-primary opacity-80' : 'bg-primary-container text-on-primary')}`}
          >
            {isSaving ? (
              <><span className="material-symbols-outlined animate-spin">sync</span> SYNCING...</>
            ) : saveComplete ? (
              <><span className="material-symbols-outlined">check_circle</span> SYSTEM UPDATED</>
            ) : (
              <><span className="material-symbols-outlined group-hover:rotate-12 transition-transform">save</span> Save Configuration</>
            )}
          </button>
        </div>
      </div>

      <footer className="mt-20 border-t border-outline-variant pt-8 flex items-center justify-between opacity-50">
        <div className="font-label-sm text-label-sm text-data-mono">SENTINEL-X-KERNEL: v4.2.0-STABLE</div>
        <div className="flex gap-6">
          <a className="font-label-sm text-label-sm hover:text-primary transition-colors" href="#">RECOVERY_DOCS</a>
          <a className="font-label-sm text-label-sm hover:text-primary transition-colors" href="#">SECURITY_MANIFEST</a>
        </div>
      </footer>
    </div>
  );
}
