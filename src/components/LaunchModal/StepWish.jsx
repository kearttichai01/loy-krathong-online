import React from 'react';
import { DEFAULT_WISHES } from '../../data/defaultWishes';
import CharacterPreview from '../CharacterPreview';
import KrathongSVG from '../KrathongSVG';

export default function StepWish({ data, onChange }) {
  const handleSelectPreset = (wishText) => {
    onChange({ ...data, wish: wishText });
  };

  return (
    <div className="space-y-5">
      {/* 1. Wish Input Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-slate-200">
            พิมพ์คำอธิษฐาน / คำขอพร <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {data.wish?.length || 0}/200 ตัวอักษร
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={200}
          value={data.wish}
          onChange={(e) => onChange({ ...data, wish: e.target.value })}
          placeholder="พิมพ์คำอธิษฐาน ขอขมาพระแม่คงคา หรือขอพรสิ่งดีๆ ในค่ำคืนนี้..."
          className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm leading-relaxed"
        />
      </div>

      {/* 2. Preset Quick Wish Tags */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-2">
          หรือเลือกคำขอพรมงคลด่วน:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_WISHES.map((w, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(w.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-400/50 text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{w.icon}</span>
              <span>{w.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sky Lantern Checkbox */}
      <div className="p-3 bg-slate-800/30 border border-slate-700/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🏮</span>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              ปล่อยโคมลอยสู่ท้องฟ้าพร้อมกัน
            </div>
            <div className="text-[10px] text-slate-400">
              ส่งโคมประทีปส่องสว่างขึ้นสู่ฟากฟ้าในคืนวันเพ็ญ
            </div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={data.releaseLantern ?? true}
          onChange={(e) => onChange({ ...data, releaseLantern: e.target.checked })}
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
        />
      </div>

      {/* 4. Final Review Card */}
      <div className="p-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 rounded-2xl border border-amber-500/30 flex items-center gap-4">
        <div className="shrink-0 flex items-center">
          <CharacterPreview
            gender={data.character.gender}
            outfitColor={data.character.outfitColor}
            skinTone={data.character.skinTone}
            size={70}
          />
          <div className="-ml-3">
            <KrathongSVG
              style={data.style}
              flameColor={data.flameColor}
              size={70}
              animated={false}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-300 truncate">
              {data.name || 'ผู้ร่วมลอยกระทง'}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
              พร้อมลอยสู่แม่น้ำ
            </span>
          </div>
          <p className="text-xs text-slate-300 italic line-clamp-2 mt-1">
            "{data.wish || 'ยังไม่ได้ระบุคำขอพร'}"
          </p>
        </div>
      </div>
    </div>
  );
}
