import { useState, useRef } from 'react';

// Accept the props from LiveRadar
export default function ManualIngestion({ isScanning, onToggleScan }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef(null);
  
  // We use a ref to track if we should stop the loop when "Halt" is clicked
  const isScanningRef = useRef(isScanning);

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
      loadFileLocally(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFileLocally(e.target.files[0]);
    }
  };

  // V2 ARCHITECTURE: We no longer upload the file to the backend.
  // We load it into the browser's memory so the Browser can act as the edge simulator!
  const loadFileLocally = (file) => {
    if (!file.name.endsWith('.csv')) {
      setStatusMsg("❌ Error: Please upload a valid .csv file.");
      return;
    }
    setSelectedFile(file);
    setStatusMsg("✅ File securely loaded into Browser Engine! Ready to scan.");
    setTimeout(() => setStatusMsg(""), 4000);
  };

  // This function acts like your traffic_simulator.py, but runs right in React!
  const startStreamSimulation = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setStatusMsg("⚡ Streaming packets to Ingestion Gateway...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      
      // Loop through the CSV rows (starting at 1 to skip the header)
      for (let i = 1; i < rows.length; i++) {
        // If the user clicks "Halt System Scan", break the loop!
        if (!isScanningRef.current) {
          setStatusMsg("🛑 Scan Halted by User.");
          setIsUploading(false);
          break;
        }

        const cols = rows[i].split(',');
        if (cols.length < 5) continue; // Skip empty rows

        try {
          // Map the CSV data exactly like we did in Python
          const payload = {
            source_ip: "192.168.1." + Math.floor(Math.random() * 255),
            destination_ip: "10.0.0.5",
            packet_size: parseFloat(cols[4]) ? parseInt(cols[4]) : 500,
            protocol: cols[1] || "tcp",
            src_bytes: parseFloat(cols[2]) ? parseInt(cols[2]) : 0,
            dst_bytes: parseFloat(cols[3]) ? parseInt(cols[3]) : 0,
            raw_data: cols // <--- ADD THIS: Send the entire row!
          };

          // Blast the packet to the FastAPI Ingestion Server
          await fetch('https://kaushikbommu-sentinel-ingestion-api.hf.space/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          // Wait 500ms before sending the next one to simulate a real-time stream
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error("Failed to send packet", error);
        }
      }
      
      if (isScanningRef.current) {
         setStatusMsg("✅ Scan Complete. All packets ingested.");
         onToggleScan(); // Turn off radar
      }
      setIsUploading(false);
    };
    
    reader.readAsText(selectedFile);
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
          {isUploading ? 'Streaming to Server...' : 'Upload Test_data.csv'}
        </h5>
        <p className="text-on-surface-variant text-sm text-center mb-6">
          {statusMsg ? (
            <span className={statusMsg.includes('✅') ? 'text-primary' : 'text-error'}>{statusMsg}</span>
          ) : (
            'Drag and drop or click to load raw packet logs.'
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
      
      <button 
        className={`mt-6 w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] transition-transform ${
          !selectedFile 
            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50'
            : isScanning 
              ? 'bg-error text-background neon-glow-error active:scale-95'
              : 'bg-primary-container text-on-primary neon-glow-primary active:scale-95'
        }`}
        disabled={!selectedFile}
        onClick={() => {
          if (selectedFile) {
            const newScanState = !isScanning;
            isScanningRef.current = newScanState; // Update ref immediately for the loop
            onToggleScan(); // Trigger parent UI changes
            
            if (newScanState) {
              startStreamSimulation(); // Start blasting data!
            }
          }
        }}
      >
        {isScanning ? 'Halt System Scan' : 'Commence Scan'}
      </button>
    </div>
  );
}