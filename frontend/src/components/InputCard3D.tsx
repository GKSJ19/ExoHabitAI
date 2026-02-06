'use client';

import { ReactNode, useState, useRef, MouseEvent } from 'react';

interface InputCard3DProps {
  title: string;
  children: ReactNode;
}

export default function InputCard3D({ title, children }: InputCard3DProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -10;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="perspective-1000">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          transform: `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translateZ(${isFocused ? '20px' : '0px'})
          `,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
        className={`
          relative
          ${isFocused 
            ? 'card-focused' 
            : 'card-base'
          }
          border rounded-lg p-6 
          transition-all duration-300
          hover:shadow-2xl
        `}
      >
        {/* Vintage corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/40" />

        {/* Depth layer */}
        <div 
          className="absolute inset-0 bg-slate-950/40 rounded-lg -z-10"
          style={{
            transform: 'translateZ(-10px)',
            filter: 'blur(8px)',
          }}
        />

        {/* Content */}
        <div style={{ transform: 'translateZ(10px)' }}>
          <h3 className="text-xs uppercase tracking-widest text-amber-500/80 mb-4 font-mono flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            {title}
          </h3>
          <div className="space-y-4">
            {children}
          </div>
        </div>

        {/* Animated border glow */}
        <div className={`
          absolute inset-0 rounded-lg pointer-events-none
          transition-opacity duration-300
          ${isFocused ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="absolute inset-0 rounded-lg border border-amber-500/30 animate-pulse-slow" />
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .card-base {
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.6) 0%,
            rgba(30, 41, 59, 0.4) 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
        }
        
        .card-focused {
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 100%
          );
          border: 1px solid rgba(251, 191, 36, 0.3);
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.4),
            0 10px 10px -5px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(251, 191, 36, 0.2),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}