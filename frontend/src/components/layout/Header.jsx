import React from 'react';

export default function Header({ currentPage }) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant shadow-[0_0_15px_rgba(57,255,20,0.1)] flex justify-between items-center px-margin-desktop h-16">
      <div className="flex items-center gap-4">
        {currentPage === 'LiveRadar' ? (
          <>
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-on-surface-variant font-data-mono text-sm tracking-widest uppercase">Operational Environment: Gamma-Sector-9</span>
          </>
        ) : (
          <h1 className="font-headline-lg text-headline-lg font-black text-primary uppercase tracking-tighter">Sentinel NIDS</h1>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group focus-within:ring-2 focus-within:ring-primary rounded-lg overflow-hidden transition-all bg-surface-container-low border border-outline-variant">
          <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input 
            className="w-64 bg-transparent border-none text-on-surface pl-10 pr-4 py-1.5 font-label-sm text-label-sm focus:outline-none focus:ring-0 placeholder:text-outline transition-all" 
            placeholder={currentPage === 'Settings' ? "Global Search..." : "Search system nodes..."} 
            type="text" 
          />
        </div>
        
        <div className="flex items-center gap-3 text-on-surface-variant">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
