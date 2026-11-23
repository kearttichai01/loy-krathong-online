import React, { useState } from 'react';
import { Volume2, VolumeX, Database, Info, Sparkles, Waves, Tent, User, Trash2 } from 'lucide-react';
import { audioService } from '../services/audioService';
import CharacterPreview from './CharacterPreview';

export default function HeaderControls({
  krathongCount = 0,
  isLiveFirebase = false,
  onOpenFirebaseConfig,
  onOpenAbout,
  currentView = 'temple-fair',
  onToggleView,
  onEditProfile,
  onClearKrathongs,
  myProfile
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleAudio = () => {
    const active = audioService.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 md:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 pointer-events-none">
      {/* Left: Branding & Festival Title */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-lg sm:text-2xl">
            🪷
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-base md:text-lg font-bold text-amber-200 tracking-wide flex items-center gap-1.5 truncate">
            <span>ลอยกระทงออนไลน์</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden md:inline-block">
              ๒๕๖๙
            </span>
          </h1>
          <p className="text-[9px] sm:text-xs text-slate-400 truncate hidden xs:block">
            {currentView === 'temple-fair' ? '🎪 ลานงานวัดริมน้ำ' : '🌊 แม่น้ำลอยกระทง'}
          </p>
        </div>
      </div>

      {/* Right: Controls & Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 pointer-events-auto shrink-0">
        {/* Switch View Button (งานวัด <-> แม่น้ำ) */}
        {onToggleView && myProfile && (
          <button
            onClick={onToggleView}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {currentView === 'temple-fair' ? (
              <>
                <Waves size={14} className="text-amber-300" />
                <span className="hidden sm:inline">ไปดูแม่น้ำ</span>
              </>
            ) : (
              <>
                <Tent size={14} className="text-amber-300" />
                <span className="hidden sm:inline">กลับงานวัด</span>
              </>
            )}
          </button>
        )}

        {/* User Profile Avatar / Edit Button */}
        {myProfile && onEditProfile && (
          <button
            onClick={onEditProfile}
            title={`แก้ไขตัวละคร (${myProfile.name})`}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/30 text-xs text-amber-200 backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <CharacterPreview
              gender={myProfile.character?.gender}
              outfitColor={myProfile.character?.outfitColor}
              skinTone={myProfile.character?.skinTone}
              photoUrl={myProfile.photoUrl}
              size={24}
            />
            <span className="hidden md:inline font-medium truncate max-w-[80px]">
              {myProfile.name}
            </span>
          </button>
        )}

        {/* Floating Count Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-[11px] sm:text-xs text-slate-300 shadow-sm">
          <Sparkles size={13} className="text-amber-400" />
          <span>ลอยอยู่: <strong className="text-amber-300">{krathongCount}</strong></span>
          {onClearKrathongs && krathongCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการนำกระทงทั้งหมดออกจากแม่น้ำเพื่อเริ่มใหม่หรือไม่?')) {
                  onClearKrathongs();
                }
              }}
              title="ล้างกระทงทั้งหมดในแม่น้ำเพื่อเริ่มใหม่"
              className="text-[10px] text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors ml-0.5"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          title={isPlayingAudio ? 'ปิดเสียงดนตรีบรรยากาศ' : 'เปิดเสียงสายน้ำและดนตรีไทย'}
          className={`p-2 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-full border backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
            isPlayingAudio
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 size={16} className="text-amber-400 animate-pulse" />
              <span className="hidden lg:inline text-xs">เปิดเสียงอยู่</span>
            </>
          ) : (
            <>
              <VolumeX size={16} />
              <span className="hidden lg:inline text-xs">เปิดเสียง</span>
            </>
          )}
        </button>

        {/* Cloud / Demo Status Pill */}
        <button
          onClick={onOpenFirebaseConfig}
          title="คลิกเพื่อตั้งค่า Firebase Cloud Database"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer active:scale-95"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveFirebase ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
            }`}
          />
          <span className="hidden md:inline text-xs">
            {isLiveFirebase ? 'Cloud Live' : 'Demo Mode'}
          </span>
          <Database size={13} className="text-slate-400" />
        </button>

        {/* Info Modal Trigger */}
        <button
          onClick={onOpenAbout}
          title="เกี่ยวกับประเพณีลอยกระทง"
          className="p-2 rounded-xl sm:rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 backdrop-blur-md transition-colors active:scale-95"
        >
          <Info size={16} />
        </button>
      </div>
    </header>
  );
}
