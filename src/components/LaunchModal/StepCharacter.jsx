import React from 'react';
import CharacterPreview from '../CharacterPreview';
import { CHARACTER_GENDERS, OUTFIT_COLORS, SKIN_TONES } from '../../data/krathongPresets';

export default function StepCharacter({ data, onChange }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Preview */}
      <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-700/50">
        <CharacterPreview
          gender={data.character.gender}
          outfitColor={data.character.outfitColor}
          skinTone={data.character.skinTone}
          size={100}
          name={data.name || 'ชื่อของคุณ'}
        />
        <p className="text-[11px] sm:text-xs text-amber-300/80 mt-1.5">
          ตัวละครของคุณในคืนวันเพ็ญ
        </p>
      </div>

      {/* 1. Name Input */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1">
          ชื่อของคุณหรือคำเรียก <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={data.name}
          maxLength={24}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="เช่น น้องมะลิ, ต้นกล้า, ฟ้าใส"
          className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-xs sm:text-sm"
        />
      </div>

      {/* 2. Gender Selection */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5">
          เลือกเพศ / สไตล์ตัวละคร
        </label>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {CHARACTER_GENDERS.map((g) => {
            const isSelected = data.character.gender === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    character: { ...data.character, gender: g.id }
                  })
                }
                className={`p-2 sm:p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 sm:gap-1 active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-amber-200 shadow-md'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <span className="text-base sm:text-lg">
                  {g.id === 'female' ? '🌸' : g.id === 'male' ? '🌿' : '✨'}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold">{g.label.split(' ')[0]}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-full">
                  {g.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Outfit Color */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5">
          สีชุดไทยประยุกต์
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {OUTFIT_COLORS.map((c) => {
            const isSelected = data.character.outfitColor === c.hex;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    character: { ...data.character, outfitColor: c.hex }
                  })
                }
                title={c.name}
                className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-medium'
                    : 'border-slate-800 bg-slate-800/30 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Skin Tone */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5">
          สีผิว
        </label>
        <div className="flex gap-2">
          {SKIN_TONES.map((s) => {
            const isSelected = data.character.skinTone === s.hex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    character: { ...data.character, skinTone: s.hex }
                  })
                }
                className={`flex-1 py-1.5 sm:py-2 px-2 rounded-xl border text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                    : 'border-slate-800 bg-slate-800/30 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: s.hex }}
                />
                <span className="truncate">{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
