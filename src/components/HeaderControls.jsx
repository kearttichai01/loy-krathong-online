import React, { useState } from 'react';
import { Volume2, VolumeX, Database, Info, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function HeaderControls({
  krathongCount = 0,
  isLiveFirebase = false,
  onOpenFirebaseConfig,
  onOpenAbout
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleAudio = () => {
    const active = audioService.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 pointer-events-none">
      {/* Left: Branding & Festival Title */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl md:text-2xl">
            🪷
          </div>
        </div>
        <div>
          <h1 className="text-sm md:text-lg font-bold text-amber-200 tracking-wide flex items-center gap-2">
            ลอยกระทงออนไลน์ 
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
              ๒๕๖๙
            </span>
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400">
            ขอขมาพระแม่คงคา • ส่งคำอธิษฐานสู่สายธาร
          </p>
        </div>
      </div>

      {/* Right: Controls & Counters */}
      <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
        {/* Floating Count Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs text-slate-300 shadow-sm">
          <Sparkles size={14} className="text-amber-400" />
          <span>ลอยอยู่: <strong className="text-amber-300">{krathongCount}</strong> กระทง</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          title={isPlayingAudio ? 'ปิดเสียงดนตรีบรรยากาศ' : 'เปิดเสียงสายน้ำและดนตรีไทย'}
          className={`p-2 md:px-3 md:py-1.5 rounded-xl md:rounded-full border backdrop-blur-md text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
            isPlayingAudio
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 size={16} className="text-amber-400 animate-pulse" />
              <span className="hidden md:inline">เปิดเสียงอยู่</span>
            </>
          ) : (
            <>
              <VolumeX size={16} />
              <span className="hidden md:inline">เปิดเสียง</span>
            </>
          )}
        </button>

        {/* Cloud / Demo Status Pill */}
        <button
          onClick={onOpenFirebaseConfig}
          title="คลิกเพื่อตั้งค่า Firebase Cloud Database"
          className="px-2.5 py-1.5 rounded-xl md:rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveFirebase ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
            }`}
          />
          <span className="hidden md:inline">
            {isLiveFirebase ? 'Cloud Live' : 'Demo Mode'}
          </span>
          <Database size={13} className="text-slate-400" />
        </button>

        {/* Info Modal Trigger */}
        <button
          onClick={onOpenAbout}
          title="เกี่ยวกับประเพณีลอยกระทง"
          className="p-2 rounded-xl md:rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 backdrop-blur-md transition-colors"
        >
          <Info size={16} />
        </button>
      </div>
    </header>
  );
}
