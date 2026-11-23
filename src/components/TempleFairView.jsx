import React, { useState } from 'react';
import { Users, Heart, Sparkles, User, Waves, UserCheck, Edit3, ArrowRight } from 'lucide-react';
import TempleFairCanvas from './TempleFairCanvas';
import CharacterPreview from './CharacterPreview';

export default function TempleFairView({
  myProfile,
  onlineVisitors = [],
  onFloatSolo,
  onFloatCouple,
  onGoToRiver,
  onEditProfile
}) {
  const [selectedPartner, setSelectedPartner] = useState(null);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Animated Temple Fair Background Canvas */}
      <TempleFairCanvas />

      {/* 2. Center Interactive Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] pb-4 sm:pt-20 sm:pb-6 flex flex-col items-center max-w-5xl mx-auto w-full">
        {/* Your Character Showcase Card */}
        <div className="w-full max-w-xl p-3.5 sm:p-4 bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-950/90 rounded-2xl border border-amber-400/40 shadow-2xl backdrop-blur-md mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CharacterPreview
              gender={myProfile.character?.gender}
              outfitColor={myProfile.character?.outfitColor}
              skinTone={myProfile.character?.skinTone}
              photoUrl={myProfile.photoUrl}
              size={64}
              isOnline={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-amber-200">
                  {myProfile.name}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ตัวคุณ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                กำลังรออยู่ที่ท่าน้ำงานวัด 🏮
              </p>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-200 border border-slate-700 text-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Edit3 size={13} />
            <span className="hidden sm:inline">แก้ไขตัวละคร</span>
          </button>
        </div>

        {/* Section Title */}
        <div className="w-full text-center sm:text-left mb-3">
          <h3 className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-center sm:justify-start gap-2">
            <Users size={16} />
            <span>เพื่อนๆ ที่มารออยู่ที่ท่าน้ำ ({onlineVisitors.length} คน)</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (คลิกที่ใครก็ได้เพื่อชวนลอยกระทงคู่กัน)
            </span>
          </h3>
        </div>

        {/* Online Attendees Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
          {onlineVisitors.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedPartner(v)}
              className="group p-3 sm:p-3.5 bg-slate-900/80 hover:bg-slate-800/90 rounded-2xl border border-slate-700/60 hover:border-amber-400/60 shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1 active:scale-95"
            >
              <div className="relative mb-2">
                <CharacterPreview
                  gender={v.character?.gender}
                  outfitColor={v.character?.outfitColor}
                  skinTone={v.character?.skinTone}
                  photoUrl={v.photoUrl}
                  size={70}
                  isOnline={true}
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-slate-950 shadow-md group-hover:scale-125 transition-transform">
                  <Heart size={10} className="fill-slate-950" />
                </span>
              </div>

              <div className="text-xs font-bold text-slate-100 group-hover:text-amber-200 truncate w-full">
                {v.name}
              </div>

              <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 mt-1 truncate max-w-full">
                {v.status}
              </span>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-amber-300">
                <span>ชวนลอยคู่</span>
                <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Action Bar */}
      <div className="relative z-10 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent border-t border-slate-800/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onFloatSolo}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base border border-yellow-200 active:scale-95"
        >
          <span>ลอยกระทงคนเดียว 🚶‍♂️🪷</span>
        </button>

        <button
          onClick={onGoToRiver}
          className="w-full sm:w-auto px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm active:scale-95"
        >
          <span>ไปชมกระทงในแม่น้ำ 🌊</span>
        </button>
      </div>

      {/* 5. Couple Invitation Dialog */}
      {selectedPartner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPartner(null)}
        >
          <div 
            className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-2 animate-bounce">💑</div>

            <h3 className="text-base sm:text-lg font-bold text-amber-200">
              ลอยกระทงคู่กันในคืนวันเพ็ญ
            </h3>

            <p className="text-xs text-slate-300 mt-1">
              คุณต้องการจับคู่ลอยกระทงร่วมกับ <strong>{selectedPartner.name}</strong> หรือไม่?
            </p>

            {/* Couple Avatars Preview Side-by-Side */}
            <div className="flex items-center justify-center gap-3 my-5 p-3.5 bg-slate-950/70 rounded-2xl border border-amber-500/20">
              <div className="flex flex-col items-center">
                <CharacterPreview
                  gender={myProfile.character?.gender}
                  outfitColor={myProfile.character?.outfitColor}
                  skinTone={myProfile.character?.skinTone}
                  photoUrl={myProfile.photoUrl}
                  size={68}
                />
                <span className="text-[10px] text-amber-300 font-medium mt-1 truncate max-w-[80px]">
                  {myProfile.name}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-xl text-rose-400 animate-pulse">💖</span>
                <span className="text-[10px] text-amber-400 font-semibold">ลอยคู่</span>
              </div>

              <div className="flex flex-col items-center">
                <CharacterPreview
                  gender={selectedPartner.character?.gender}
                  outfitColor={selectedPartner.character?.outfitColor}
                  skinTone={selectedPartner.character?.skinTone}
                  photoUrl={selectedPartner.photoUrl}
                  size={68}
                />
                <span className="text-[10px] text-amber-300 font-medium mt-1 truncate max-w-[80px]">
                  {selectedPartner.name}
                </span>
              </div>
            </div>

            {/* Draft Partner Wish */}
            {selectedPartner.wishDraft && (
              <p className="text-[11px] text-slate-400 italic mb-4">
                "{selectedPartner.wishDraft}"
              </p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  const partner = selectedPartner;
                  setSelectedPartner(null);
                  onFloatCouple(partner);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
              >
                ลอยกระทงคู่กันเลย! 🪷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
