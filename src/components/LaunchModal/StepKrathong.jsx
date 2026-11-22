import React from 'react';
import KrathongSVG from '../KrathongSVG';
import { KRATHONG_STYLES, FLAME_COLORS } from '../../data/krathongPresets';

export default function StepKrathong({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Live Krathong Preview */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
        <KrathongSVG
          style={data.style}
          flameColor={data.flameColor}
          size={140}
          animated={true}
        />
        <p className="text-xs text-amber-300 font-medium mt-1">
          {KRATHONG_STYLES.find((s) => s.id === data.style)?.name}
        </p>
      </div>

      {/* 1. Choose Krathong Style */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          เลือกรูปแบบกระทง
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {KRATHONG_STYLES.map((k) => {
            const isSelected = data.style === k.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => onChange({ ...data, style: k.id })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-amber-100 shadow-md ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-slate-800/30 hover:bg-slate-800/70 text-slate-300'
                }`}
              >
                <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-slate-900/80 rounded-lg p-1 border border-slate-700/60">
                  <KrathongSVG style={k.id} flameColor={data.flameColor} size={42} animated={false} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {k.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-medium">
                      {k.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {k.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Choose Flame Color */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          สีเปลวไฟและแสงเทียน
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FLAME_COLORS.map((f) => {
            const isSelected = data.flameColor === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ ...data, flameColor: f.id })}
                className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-amber-200 font-medium'
                    : 'border-slate-800 bg-slate-800/30 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: f.color,
                    boxShadow: `0 0 8px ${f.color}`
                  }}
                />
                <span className="truncate">{f.name.replace('เปลวไฟ', '')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
