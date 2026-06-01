

export default function ThreatRadar({ dataPoints = [] }) {
  
  // Turn confidence coordinates into an SVG path string
  const generateSvgPath = () => {
    if (dataPoints.length === 0) return "M 0 300";
    
    const widthAllocation = 1000;
    const heightAllocation = 400;
    const segmentWidth = widthAllocation / Math.max(19, dataPoints.length - 1);
    
    return dataPoints.map((point, index) => {
      const x = index * segmentWidth;
      // Map 0-100% confidence onto the 400px height scale
      const y = heightAllocation - (point.confidence / 100 * heightAllocation);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const dynamicPath = generateSvgPath();

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Live Threat Confidence Radar</h3>
          <p className="text-on-surface-variant font-data-mono text-sm">Real-time signal analysis of incoming traffic payloads</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-data-mono uppercase">
            <span className="w-3 h-3 bg-primary rounded-full"></span> Telemetry Stream
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full relative">
        {/* Background grids */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
          <div className="border-b border-on-surface-variant w-full h-0"></div>
          <div className="border-b border-on-surface-variant w-full h-0"></div>
          <div className="border-b border-on-surface-variant w-full h-0"></div>
        </div>
        
        {/* Dynamic Vector Layer */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" preserveAspectRatio="none" viewBox="0 0 1000 400">
          <path 
            d={dynamicPath} 
            fill="none" 
            stroke="#39ff14" 
            strokeWidth="3" 
            className="transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  );
}