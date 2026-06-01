import { useState, useRef } from 'react';

// Accept the props from LiveRadar
export default function ManualIngestion({ isScanning, onToggleScan }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    if (!file.name.endsWith('.csv')) {
      setStatusMsg("❌ Error: Please upload a valid .csv file.");
      return;
    }

    setIsUploading(true);
    setStatusMsg("⏳ Uploading to Secure Backend...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (response.ok) {
        setStatusMsg("✅ " + data.message);
      } else {
        setStatusMsg("❌ Upload failed: " + data.error);
      }
    } catch (error) {
      setStatusMsg("❌ Server connection error.");
    }
    
    setIsUploading(false);
    setTimeout(() => setStatusMsg(""), 4000);
  };

  return (
    <div className="bg-surface-container border border-outline-variant p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary">upload_file</span>
        <h4 className="font-headline-lg-mobile text-headline-lg-mobile font-bold uppercase tracking-tight">Manual Ingestion</h4>
      </div>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 group transition-all cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-outline-variant hover:border-primary-container hover:bg-primary/5'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
          <span className={`material-symbols-outlined transition-colors ${isDragOver ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>{isUploading ? 'sync' : 'upload'}</span>
        </div>
        <h5 className="font-body-md font-bold mb-1">
          {isUploading ? 'Encrypting & Uploading...' : 'Upload Test_data.csv'}
        </h5>
        <p className="text-on-surface-variant text-sm text-center mb-6">
          {statusMsg ? (
            <span className={statusMsg.includes('✅') ? 'text-primary' : 'text-error'}>{statusMsg}</span>
          ) : (
            'Drag and drop or click to upload raw packet logs.'
          )}
        </p>
        
        {!selectedFile && (
          <>
            <div className="flex items-center gap-4 w-full">
              <div className="h-px flex-1 bg-outline-variant"></div>
              <span className="text-xs font-data-mono text-outline uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-outline-variant"></div>
            </div>
            <button className="mt-6 border border-primary text-primary px-6 py-2 rounded font-bold uppercase text-xs hover:bg-primary/10 transition-colors pointer-events-none">
              Browse Files
            </button>
          </>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileSelect}
          accept=".csv,.pcap,.json"
        />
      </div>
      
      {/* UPDATE: The Button now triggers onToggleScan and changes color/text! */}
      <button 
        className={`mt-6 w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] transition-transform ${
          !selectedFile 
            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50'
            : isScanning 
              ? 'bg-error text-background neon-glow-error active:scale-95' // Red when scanning to stop
              : 'bg-primary-container text-on-primary neon-glow-primary active:scale-95' // Green when ready to start
        }`}
        disabled={!selectedFile}
        onClick={() => {
          if (selectedFile) {
            onToggleScan(); // Send the command back up to LiveRadar!
          }
        }}
      >
        {isScanning ? 'Halt System Scan' : 'Commence Scan'}
      </button>
    </div>
  );
}