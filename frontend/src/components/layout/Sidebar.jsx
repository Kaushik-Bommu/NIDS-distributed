import React from 'react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <nav className="w-[260px] h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface-container flex flex-col py-base z-50">
      <div className="px-6 py-8 flex flex-col gap-2">
        <h1 className="font-headline-lg text-headline-lg font-black text-primary uppercase tracking-tighter">SENTINEL</h1>
        <div className="flex items-center gap-3 mt-4 mb-4">
          <div className="w-10 h-10 rounded-full border border-primary/30 p-0.5 overflow-hidden">
            <img 
              alt="Engineer Profile" 
              className="w-full h-full object-cover rounded-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd1eBsYup_EF-It_cTIyez9dti0_0FySh0DeQhSQgibkuuHv6ITOAXLGLycPfIAXkd-hoChWs9cTjQGb6tTy1VWpR1xZDmSY2DAZc9OfpC8k4o11g9H1nqAHPB1tSx203fbyHpSTU0idorRSnxS6fqcJKXtRtvRjONiNzRG27P50Fi_ONmBohmaA_bj4Wnl_TrXQ5_d5w98p5OCPqyKZ6mTkJdvTi1ZaL_KFPpxaTX6evqWilrV85GGS0_y89hCgn_TgetW5y7aWso"
            />
          </div>
          <div>
            <div className="font-data-mono text-primary font-bold text-sm">NIDS Operator</div>
            <div className="font-body-md text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              System Status: Online
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-3 flex flex-col gap-1">
        <button 
          onClick={() => setCurrentPage('LiveRadar')}
          className={`flex items-center gap-4 px-4 py-3 font-medium transition-colors duration-200 group w-full text-left ${currentPage === 'LiveRadar' ? 'text-primary font-bold border-l-4 border-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={currentPage === 'LiveRadar' ? { fontVariationSettings: "'FILL' 1" } : {}}>radar</span>
          <span className="font-body-md text-body-md">Live Radar</span>
        </button>
        <button className="flex items-center gap-4 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-variant hover:text-primary transition-colors duration-200 group w-full text-left">
          <span className="material-symbols-outlined">terminal</span>
          <span className="font-body-md text-body-md">Threat Log</span>
        </button>
        <button className="flex items-center gap-4 px-4 py-3 text-on-surface-variant font-medium hover:bg-surface-variant hover:text-primary transition-colors duration-200 group w-full text-left">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-body-md text-body-md">Packet Analyzer</span>
        </button>
        <button 
          onClick={() => setCurrentPage('Settings')}
          className={`flex items-center gap-4 px-4 py-3 font-medium transition-colors duration-200 group w-full text-left ${currentPage === 'Settings' ? 'text-primary font-bold border-l-4 border-primary bg-primary/10' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}
        >
          <span className="material-symbols-outlined" style={currentPage === 'Settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </button>
      </div>

      <div className="p-4 mt-auto">
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:border-secondary transition-all cursor-pointer group hover:bg-primary/5">
          <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary mb-1">cloud_upload</span>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant group-hover:text-secondary">Upload Log File</p>
        </div>
      </div>
    </nav>
  );
}
