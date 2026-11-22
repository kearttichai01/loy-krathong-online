import React from 'react';
import { FLAME_COLORS } from '../data/krathongPresets';

export default function KrathongSVG({ 
  style = 'banana-leaf', 
  flameColor = 'gold', 
  size = 120, 
  className = '',
  showCandle = true,
  animated = true 
}) {
  const flameConfig = FLAME_COLORS.find(f => f.id === flameColor) || FLAME_COLORS[0];
  const flameHex = flameConfig.color;
  const flameGlow = flameConfig.glow;

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 200 200" 
        width={size} 
        height={size}
        className="overflow-visible drop-shadow-lg"
      >
        <defs>
          {/* Flame Glow Filter */}
          <filter id={`glow-${flameColor}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients */}
          <linearGradient id="bananaLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#9d174d" />
          </linearGradient>

          <linearGradient id="breadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#290f02" />
          </linearGradient>

          <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* 1. WATER RIPPLE UNDER KRATHONG */}
        <ellipse 
          cx="100" 
          cy="155" 
          rx="75" 
          ry="15" 
          fill="rgba(56, 189, 248, 0.15)" 
          className={animated ? 'animate-pulse' : ''}
        />
        <ellipse 
          cx="100" 
          cy="153" 
          rx="55" 
          ry="10" 
          fill="rgba(255, 255, 255, 0.2)" 
        />

        {/* 2. BASE AND PETALS ACCORDING TO STYLE */}
        {style === 'banana-leaf' && (
          <g>
            {/* Trunk base */}
            <ellipse cx="100" cy="145" rx="65" ry="16" fill="#14532d" />
            <ellipse cx="100" cy="142" rx="62" ry="14" fill="#166534" />

            {/* Back petals */}
            <path d="M 60 135 C 40 100 70 85 85 125 Z" fill="#15803d" />
            <path d="M 140 135 C 160 100 130 85 115 125 Z" fill="#15803d" />
            <path d="M 100 130 C 85 80 115 80 100 130 Z" fill="#22c55e" />

            {/* Main folded banana leaves */}
            <path d="M 35 140 C 25 105 70 100 80 135 Z" fill="url(#bananaLeafGrad)" stroke="#166534" strokeWidth="1" />
            <path d="M 165 140 C 175 105 130 100 120 135 Z" fill="url(#bananaLeafGrad)" stroke="#166534" strokeWidth="1" />
            <path d="M 65 145 C 50 110 95 105 100 140 Z" fill="url(#bananaLeafGrad)" stroke="#166534" strokeWidth="1" />
            <path d="M 135 145 C 150 110 105 105 100 140 Z" fill="url(#bananaLeafGrad)" stroke="#166534" strokeWidth="1" />
            
            {/* Front Petals center */}
            <path d="M 80 148 C 80 120 120 120 120 148 Z" fill="#4ade80" />
            <path d="M 90 146 C 92 125 108 125 110 146 Z" fill="#86efac" />

            {/* Marigold Flowers (ดอกดาวเรืองสีส้มทอง) */}
            <circle cx="82" cy="140" r="9" fill="#f59e0b" />
            <circle cx="82" cy="140" r="6" fill="#fde047" />
            <circle cx="118" cy="140" r="9" fill="#f59e0b" />
            <circle cx="118" cy="140" r="6" fill="#fde047" />
            <circle cx="100" cy="143" r="11" fill="#ea580c" />
            <circle cx="100" cy="143" r="8" fill="#f59e0b" />
            <circle cx="100" cy="143" r="5" fill="#fde047" />
            {/* Orchids */}
            <circle cx="68" cy="142" r="5" fill="#c026d3" />
            <circle cx="132" cy="142" r="5" fill="#c026d3" />
          </g>
        )}

        {style === 'lotus' && (
          <g>
            {/* Lotus Base */}
            <ellipse cx="100" cy="146" rx="60" ry="14" fill="#831843" />
            
            {/* Outer Petals */}
            <path d="M 40 140 C 25 100 85 95 88 135 Z" fill="url(#lotusGrad)" opacity="0.9" />
            <path d="M 160 140 C 175 100 115 95 112 135 Z" fill="url(#lotusGrad)" opacity="0.9" />
            <path d="M 60 143 C 45 90 95 85 98 135 Z" fill="#ec4899" />
            <path d="M 140 143 C 155 90 105 85 102 135 Z" fill="#ec4899" />
            
            {/* Center Petals */}
            <path d="M 80 145 C 75 105 125 105 120 145 Z" fill="#f472b6" />
            <path d="M 90 147 C 88 115 112 115 110 147 Z" fill="#fbcfe8" />
            
            {/* Golden Stamen Core */}
            <ellipse cx="100" cy="142" rx="16" ry="6" fill="#fef08a" />
            <circle cx="95" cy="141" r="2" fill="#ca8a04" />
            <circle cx="100" cy="142" r="2.5" fill="#ca8a04" />
            <circle cx="105" cy="141" r="2" fill="#ca8a04" />
          </g>
        )}

        {style === 'bread' && (
          <g>
            {/* Turtle Bread Krathong */}
            {/* Flippers */}
            <ellipse cx="45" cy="138" rx="16" ry="9" fill="#b45309" transform="rotate(-15 45 138)" />
            <ellipse cx="155" cy="138" rx="16" ry="9" fill="#b45309" transform="rotate(15 155 138)" />
            <ellipse cx="60" cy="155" rx="12" ry="7" fill="#92400e" transform="rotate(-30 60 155)" />
            <ellipse cx="140" cy="155" rx="12" ry="7" fill="#92400e" transform="rotate(30 140 155)" />

            {/* Turtle Head */}
            <ellipse cx="100" cy="158" rx="18" ry="14" fill="#d97706" />
            {/* Eyes */}
            <circle cx="93" cy="156" r="3" fill="#1e293b" />
            <circle cx="94" cy="155" r="1" fill="#fff" />
            <circle cx="107" cy="156" r="3" fill="#1e293b" />
            <circle cx="108" cy="155" r="1" fill="#fff" />
            {/* Turtle Smile */}
            <path d="M 97 162 Q 100 165 103 162" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Main Shell (Baked Bread) */}
            <ellipse cx="100" cy="136" rx="55" ry="24" fill="url(#breadGrad)" />
            <path d="M 60 132 Q 100 120 140 132" stroke="#78350f" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="6 4" />
            <path d="M 70 142 Q 100 132 130 142" stroke="#78350f" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="6 4" />
            <circle cx="100" cy="134" r="14" fill="#fbbf24" opacity="0.4" />
          </g>
        )}

        {style === 'coconut' && (
          <g>
            {/* Polished Coconut Shell */}
            <ellipse cx="100" cy="148" rx="58" ry="18" fill="url(#coconutGrad)" />
            <ellipse cx="100" cy="142" rx="52" ry="14" fill="#451a03" />
            <ellipse cx="100" cy="140" rx="46" ry="11" fill="#fef08a" opacity="0.8" />
            
            {/* Floating Wax Layer */}
            <ellipse cx="100" cy="139" rx="42" ry="9" fill="#fef9c3" />

            {/* Tiny Jasmine Flowers around rim */}
            <circle cx="58" cy="142" r="4" fill="#fff" />
            <circle cx="72" cy="146" r="4.5" fill="#fff" />
            <circle cx="90" cy="148" r="4.5" fill="#fff" />
            <circle cx="110" cy="148" r="4.5" fill="#fff" />
            <circle cx="128" cy="146" r="4.5" fill="#fff" />
            <circle cx="142" cy="142" r="4" fill="#fff" />
          </g>
        )}

        {style === 'cyber' && (
          <g>
            {/* Cyber Neon Hologram Base */}
            <ellipse cx="100" cy="145" rx="65" ry="18" fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.9" />
            <ellipse cx="100" cy="145" rx="52" ry="14" fill="rgba(6, 182, 212, 0.2)" stroke="#a855f7" strokeWidth="2" />
            
            {/* Geometric Digital Petals */}
            <polygon points="40,140 60,95 80,135" fill="url(#cyberGrad)" opacity="0.75" />
            <polygon points="160,140 140,95 120,135" fill="url(#cyberGrad)" opacity="0.75" />
            <polygon points="70,143 100,85 130,143" fill="url(#cyberGrad)" opacity="0.85" />
            <polygon points="85,145 100,105 115,145" fill="#38bdf8" opacity="0.9" />

            {/* Circuit Nodes */}
            <circle cx="60" cy="95" r="3" fill="#a855f7" />
            <circle cx="140" cy="95" r="3" fill="#a855f7" />
            <circle cx="100" cy="85" r="4" fill="#06b6d4" />
          </g>
        )}

        {/* 3. INCENSE STICKS (ธูป 3 ดอก) */}
        {showCandle && (
          <g>
            {/* 3 Sticks */}
            <line x1="94" y1="130" x2="90" y2="70" stroke="#b45309" strokeWidth="2" />
            <line x1="97" y1="130" x2="96" y2="65" stroke="#b45309" strokeWidth="2" />
            <line x1="102" y1="130" x2="104" y2="68" stroke="#b45309" strokeWidth="2" />

            {/* Incense red tips */}
            <circle cx="90" cy="70" r="1.5" fill="#ef4444" />
            <circle cx="96" cy="65" r="1.5" fill="#ef4444" />
            <circle cx="104" cy="68" r="1.5" fill="#ef4444" />

            {/* Smoke Wisps */}
            <path d="M 90 68 Q 85 55 92 45 T 88 30" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
            <path d="M 96 63 Q 100 50 94 40 T 98 25" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeDasharray="3 2" />
          </g>
        )}

        {/* 4. CANDLE (เทียนเล่มทอง/แกะสลัก) & FLICKERING FLAME */}
        {showCandle && (
          <g>
            {/* Candle Body */}
            <rect x="96" y="85" width="8" height="45" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <line x1="98" y1="90" x2="98" y2="125" stroke="#fef9c3" strokeWidth="1.5" />
            {/* Wick */}
            <line x1="100" y1="85" x2="100" y2="78" stroke="#451a03" strokeWidth="1.5" />

            {/* Ambient Flame Glow Halo */}
            <circle 
              cx="100" 
              cy="70" 
              r="24" 
              fill={flameGlow} 
              opacity="0.35"
              className={animated ? 'animate-pulse' : ''}
            />

            {/* Animated Flame */}
            <g className={animated ? 'animate-flame' : ''} style={{ transformOrigin: '100px 78px' }}>
              {/* Outer Flame */}
              <path 
                d="M 100 52 C 92 65 92 76 100 78 C 108 76 108 65 100 52 Z" 
                fill={flameHex} 
                filter={`url(#glow-${flameColor})`}
              />
              {/* Inner Flame Core */}
              <path 
                d="M 100 60 C 95 68 95 75 100 77 C 105 75 105 68 100 60 Z" 
                fill="#ffffff" 
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
