import React from 'react';

export default function CharacterPreview({
  gender = 'female',
  outfitColor = '#ec4899',
  skinTone = '#fde68a',
  photoUrl = null,
  size = 130,
  name = '',
  className = '',
  statusText = '',
  isOnline = false
}) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative">
        <div 
          className="relative flex items-center justify-center rounded-full overflow-hidden shadow-xl"
          style={{ 
            width: size, 
            height: size, 
            background: 'radial-gradient(circle, rgba(30,41,59,0.95) 0%, rgba(15,23,42,1) 100%)',
            border: '2.5px solid rgba(253, 224, 71, 0.7)',
            boxShadow: '0 0 16px rgba(234, 179, 8, 0.35)'
          }}
        >
          {photoUrl ? (
            /* User's Uploaded Photo */
            <img 
              src={photoUrl} 
              alt={name || 'User Avatar'} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            /* SVG Thai Chibi Character */
            <svg 
              viewBox="0 0 160 160" 
              width={size - 8} 
              height={size - 8} 
              className="drop-shadow-md"
            >
              <defs>
                <linearGradient id={`outfitGrad-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={outfitColor} />
                  <stop offset="100%" stopColor={outfitColor} stopOpacity="0.75" />
                </linearGradient>
              </defs>

              {/* BACKGROUND AURA */}
              <circle cx="80" cy="80" r="70" fill="rgba(254, 240, 138, 0.08)" />

              {/* BODY & ATTIRE */}
              {gender === 'female' && (
                <g>
                  {/* Shoulders & Torso */}
                  <path d="M 40 160 C 42 125 60 115 80 115 C 100 115 118 125 120 160 Z" fill="#fce7f3" />
                  
                  {/* Sabai (สไบเฉียง) */}
                  <path 
                    d="M 52 160 L 62 116 C 75 114 95 118 108 126 L 118 160 Z" 
                    fill={`url(#outfitGrad-${gender})`} 
                  />
                  {/* Sabai pleats & golden brooch */}
                  <path d="M 68 120 L 76 160" stroke="#fef08a" strokeWidth="1.5" opacity="0.6" />
                  <path d="M 82 122 L 92 160" stroke="#fef08a" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="80" cy="122" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="80" cy="122" r="2" fill="#ef4444" />
                </g>
              )}

              {gender === 'male' && (
                <g>
                  {/* Shoulders & Rajapatan Jacket (เสื้อราชปะแตน) */}
                  <path d="M 38 160 C 40 120 58 112 80 112 C 102 112 120 120 122 160 Z" fill={`url(#outfitGrad-${gender})`} />
                  {/* Collar */}
                  <path d="M 68 114 C 70 108 90 108 92 114 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                  {/* Golden buttons */}
                  <line x1="80" y1="116" x2="80" y2="160" stroke="#ca8a04" strokeWidth="1.5" />
                  <circle cx="80" cy="124" r="2.5" fill="#facc15" />
                  <circle cx="80" cy="136" r="2.5" fill="#facc15" />
                  <circle cx="80" cy="148" r="2.5" fill="#facc15" />
                </g>
              )}

              {gender === 'neutral' && (
                <g>
                  {/* Modern Thai Fusion Casual */}
                  <path d="M 38 160 C 40 120 60 114 80 114 C 100 114 120 120 122 160 Z" fill={`url(#outfitGrad-${gender})`} />
                  {/* Floral garland (มาลัยคล้องคอ) */}
                  <path d="M 65 116 Q 80 138 95 116" stroke="#fef08a" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M 65 116 Q 80 138 95 116" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
                  <circle cx="80" cy="132" r="4" fill="#fb7185" />
                </g>
              )}

              {/* NECK */}
              <rect x="73" y="98" width="14" height="18" rx="4" fill={skinTone} />

              {/* HEAD & FACE */}
              <ellipse cx="80" cy="74" rx="28" ry="30" fill={skinTone} />

              {/* EARS */}
              <ellipse cx="51" cy="75" rx="5" ry="8" fill={skinTone} />
              <ellipse cx="109" cy="75" rx="5" ry="8" fill={skinTone} />
              {gender === 'female' && (
                <>
                  <circle cx="51" cy="80" r="2.5" fill="#facc15" />
                  <circle cx="109" cy="80" r="2.5" fill="#facc15" />
                </>
              )}

              {/* HAIR */}
              {gender === 'female' && (
                <g>
                  {/* Topknot Chignon with golden hair ornament & jasmine garland */}
                  <ellipse cx="80" cy="38" rx="16" ry="12" fill="#1e1b4b" />
                  <circle cx="80" cy="32" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="70" cy="40" r="3" fill="#fff" />
                  <circle cx="76" cy="42" r="3" fill="#fff" />
                  <circle cx="84" cy="42" r="3" fill="#fff" />
                  <circle cx="90" cy="40" r="3" fill="#fff" />
                  <path d="M 52 70 C 55 48 105 48 108 70 C 98 56 62 56 52 70 Z" fill="#1e1b4b" />
                </g>
              )}

              {gender === 'male' && (
                <g>
                  <path d="M 50 68 C 50 42 110 42 110 68 C 105 52 82 50 80 54 C 75 50 56 54 50 68 Z" fill="#1e293b" />
                  <path d="M 50 68 Q 54 58 65 60 Q 56 64 54 72" fill="#1e293b" />
                </g>
              )}

              {gender === 'neutral' && (
                <g>
                  <path d="M 48 70 C 46 38 114 38 112 70 C 104 50 90 52 80 48 C 70 52 56 50 48 70 Z" fill="#334155" />
                  <circle cx="80" cy="42" r="8" fill="#334155" />
                </g>
              )}

              {/* FACIAL FEATURES */}
              <path d="M 64 64 Q 72 61 77 65" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M 83 65 Q 88 61 96 64" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              <ellipse cx="70" cy="73" rx="4" ry="5.5" fill="#0f172a" />
              <ellipse cx="90" cy="73" rx="4" ry="5.5" fill="#0f172a" />
              <circle cx="71" cy="71" r="1.5" fill="#fff" />
              <circle cx="91" cy="71" r="1.5" fill="#fff" />

              <ellipse cx="63" cy="80" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
              <ellipse cx="97" cy="80" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />

              <path d="M 75 83 Q 80 88 85 83" stroke="#b91c1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Online Status Green Indicator */}
        {isOnline && (
          <span 
            className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-[0_0_8px_#34d399]" 
            title="ออนไลน์ในงานวัด"
          />
        )}
      </div>

      {name && (
        <span className="mt-1.5 text-xs font-semibold text-amber-200 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-amber-500/30 max-w-[120px] truncate shadow-sm">
          {name}
        </span>
      )}

      {statusText && (
        <span className="text-[10px] text-amber-400/80 mt-0.5 max-w-[130px] truncate">
          {statusText}
        </span>
      )}
    </div>
  );
}
