import React, { useState } from "react";

interface WheelProps { items: string[]; onResult: (result: string) => void; }

const colors = ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#577590"];
const toRad = (deg:number)=>deg*Math.PI/180;

function sectorPath(cx:number, cy:number, r:number, startDeg:number, endDeg:number){
  const start=toRad(startDeg), end=toRad(endDeg);
  const x1=cx+r*Math.cos(start), y1=cy+r*Math.sin(start);
  const x2=cx+r*Math.cos(end),   y2=cy+r*Math.sin(end);
  const largeArc = (endDeg-startDeg)<=180?0:1;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function Wheel({ items, onResult }: WheelProps){
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const size=800, cx=size/2, cy=size/2, r=350;
  const n=items.length||1; const step=360/n;

  const spin = ()=>{
    if(spinning || items.length===0) return;
    const chosen = Math.floor(Math.random()*items.length);
    const spins = 6; // always full 6 spins
    const final = rotation + spins*360 - chosen*step;
    setSpinning(true);
    requestAnimationFrame(()=> setRotation(final));
    setTimeout(()=>{ setSpinning(false); onResult(items[chosen]); }, 5200);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <svg width={size} height={size}>
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
            transformBox: "fill-box",
            transition: spinning ? "transform 5s cubic-bezier(0.33,1,0.68,1)" : "none",
          }}
        >
          {items.map((label, i)=>{
            const mid = -90 + i*step;
            const start = mid - step/2, end = mid + step/2;
            const rText = r*0.6;
            return (
              <g key={i}>
                <path d={sectorPath(cx,cy,r,start,end)} fill={colors[i%colors.length]} stroke="#111"/>
                {/* radial labels: obrócone o kąt środka sektora */}
                <defs>
  <path
    id={`path-${i}`}
    d={`M ${cx + (r * 0.8) * Math.cos(toRad(mid))} ${cy + (r * 0.8) * Math.sin(toRad(mid))}
       L ${cx + (r * 1.05) * Math.cos(toRad(mid))} ${cy + (r * 1.05) * Math.sin(toRad(mid))}`}
  />
</defs>
<text fontSize="14" fontWeight="bold" fill="#000" textAnchor="middle">
  <textPath href={`#path-${i}`} startOffset="50%">
    {label}
  </textPath>
</text>
              </g>
            );
          })}
        </g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#111" strokeWidth="3"/>
        <polygon points={`${cx},${cy - r - 6} ${cx - 12},${cy - r - 30} ${cx + 12},${cy - r - 30}`} fill="#111"/>
      </svg>

      <button onClick={spin} disabled={spinning||items.length===0}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400">
        {spinning ? "Kręci się..." : "Losuj"}
      </button>
    </div>
  );
}
