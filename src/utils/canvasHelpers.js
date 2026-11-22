// Helper to generate SVG data URIs for canvas drawing
import { FLAME_COLORS } from '../data/krathongPresets';

const imageCache = new Map();

export function getKrathongImage(style = 'banana-leaf', flameColor = 'gold') {
  const cacheKey = `${style}-${flameColor}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const flameConfig = FLAME_COLORS.find(f => f.id === flameColor) || FLAME_COLORS[0];
  const flameHex = flameConfig.color;

  let baseContent = '';
  if (style === 'banana-leaf') {
    baseContent = `
      <ellipse cx="100" cy="145" rx="65" ry="16" fill="#14532d" />
      <ellipse cx="100" cy="142" rx="62" ry="14" fill="#166534" />
      <path d="M 35 140 C 25 105 70 100 80 135 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.5" />
      <path d="M 165 140 C 175 105 130 100 120 135 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.5" />
      <path d="M 65 145 C 50 110 95 105 100 140 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
      <path d="M 135 145 C 150 110 105 105 100 140 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
      <path d="M 80 148 C 80 120 120 120 120 148 Z" fill="#4ade80" />
      <circle cx="82" cy="140" r="8" fill="#f59e0b" />
      <circle cx="118" cy="140" r="8" fill="#f59e0b" />
      <circle cx="100" cy="143" r="10" fill="#ea580c" />
      <circle cx="100" cy="143" r="6" fill="#fde047" />
    `;
  } else if (style === 'lotus') {
    baseContent = `
      <ellipse cx="100" cy="146" rx="60" ry="14" fill="#831843" />
      <path d="M 40 140 C 25 100 85 95 88 135 Z" fill="#db2777" />
      <path d="M 160 140 C 175 100 115 95 112 135 Z" fill="#db2777" />
      <path d="M 60 143 C 45 90 95 85 98 135 Z" fill="#ec4899" />
      <path d="M 140 143 C 155 90 105 85 102 135 Z" fill="#ec4899" />
      <path d="M 80 145 C 75 105 125 105 120 145 Z" fill="#f472b6" />
      <ellipse cx="100" cy="142" rx="16" ry="6" fill="#fef08a" />
    `;
  } else if (style === 'bread') {
    baseContent = `
      <ellipse cx="45" cy="138" rx="16" ry="9" fill="#b45309" />
      <ellipse cx="155" cy="138" rx="16" ry="9" fill="#b45309" />
      <ellipse cx="100" cy="158" rx="18" ry="14" fill="#d97706" />
      <circle cx="93" cy="156" r="3" fill="#1e293b" />
      <circle cx="107" cy="156" r="3" fill="#1e293b" />
      <ellipse cx="100" cy="136" rx="55" ry="24" fill="#b45309" />
      <ellipse cx="100" cy="134" rx="48" ry="19" fill="#d97706" />
    `;
  } else if (style === 'coconut') {
    baseContent = `
      <ellipse cx="100" cy="148" rx="58" ry="18" fill="#451a03" />
      <ellipse cx="100" cy="142" rx="50" ry="13" fill="#290f02" />
      <ellipse cx="100" cy="140" rx="42" ry="9" fill="#fef08a" opacity="0.9" />
      <circle cx="65" cy="145" r="4" fill="#fff" />
      <circle cx="85" cy="148" r="4" fill="#fff" />
      <circle cx="115" cy="148" r="4" fill="#fff" />
      <circle cx="135" cy="145" r="4" fill="#fff" />
    `;
  } else {
    // Cyber
    baseContent = `
      <ellipse cx="100" cy="145" rx="60" ry="16" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" stroke-width="2" />
      <polygon points="40,140 60,95 80,135" fill="#3b82f6" opacity="0.8" />
      <polygon points="160,140 140,95 120,135" fill="#3b82f6" opacity="0.8" />
      <polygon points="70,143 100,85 130,143" fill="#06b6d4" opacity="0.9" />
      <polygon points="85,145 100,105 115,145" fill="#a855f7" />
    `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <ellipse cx="100" cy="155" rx="75" ry="15" fill="rgba(56, 189, 248, 0.2)" />
      ${baseContent}
      <!-- Incense -->
      <line x1="94" y1="130" x2="90" y2="70" stroke="#b45309" stroke-width="2" />
      <line x1="97" y1="130" x2="96" y2="65" stroke="#b45309" stroke-width="2" />
      <line x1="102" y1="130" x2="104" y2="68" stroke="#b45309" stroke-width="2" />
      <circle cx="90" cy="70" r="1.5" fill="#ef4444" />
      <circle cx="96" cy="65" r="1.5" fill="#ef4444" />
      <circle cx="104" cy="68" r="1.5" fill="#ef4444" />
      <!-- Candle -->
      <rect x="96" y="85" width="8" height="45" rx="2" fill="#fef08a" stroke="#ca8a04" stroke-width="1" />
      <line x1="100" y1="85" x2="100" y2="78" stroke="#451a03" stroke-width="1.5" />
      <!-- Candle Flame Glow -->
      <circle cx="100" cy="68" r="22" fill="${flameHex}" opacity="0.4" />
      <!-- Flame Core -->
      <path d="M 100 52 C 92 65 92 76 100 78 C 108 76 108 65 100 52 Z" fill="${flameHex}" />
      <path d="M 100 60 C 95 68 95 75 100 77 C 105 75 105 68 100 60 Z" fill="#ffffff" />
    </svg>
  `;

  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  imageCache.set(cacheKey, img);
  return img;
}
