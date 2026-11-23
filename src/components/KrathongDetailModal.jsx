import React, { useState } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import CharacterPreview from './CharacterPreview';
import KrathongSVG from './KrathongSVG';
import confetti from 'canvas-confetti';

export default function KrathongDetailModal({ krathong, onClose, onReact }) {
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBlessed, setHasBlessed] = useState(false);

  if (!krathong) return null;

  const handleLike = () => {
    onReact(krathong.id, 'like');
    setHasLiked(true);
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af']
      });
    } catch (e) {}
  };

  const handleBless = () => {
    onReact(krathong.id, 'blessing');
    setHasBlessed(true);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#facc15', '#fde047', '#fef08a']
      });
    } catch (e) {}
  };

  // Format relative time
  const getTimeString = () => {
    if (!krathong.timestamp) return 'คืนนี้';
    const diffMins = Math.floor((Date.now() - krathong.timestamp) / (1000 * 60));
    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `เมื่อ ${diffMins} นาทีที่แล้ว`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `เมื่อ ${diffHours} ชั่วโมงที่แล้ว`;
    return 'เมื่อวานนี้';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto max-h-[92dvh] p-4 sm:p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Top Header: Character(s) & Krathong in harmony */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 pt-1">
          {krathong.isCouple && krathong.partner ? (
            /* Couple Avatars */
            <div className="flex items-center gap-1.5 p-2 bg-slate-950/60 rounded-2xl border border-rose-500/30">
              <CharacterPreview
                gender={krathong.character?.gender}
                outfitColor={krathong.character?.outfitColor}
                skinTone={krathong.character?.skinTone}
                photoUrl={krathong.photoUrl}
                size={54}
              />
              <span className="text-base text-rose-400 animate-pulse">💖</span>
              <CharacterPreview
                gender={krathong.partner.character?.gender}
                outfitColor={krathong.partner.character?.outfitColor}
                skinTone={krathong.partner.character?.skinTone}
                photoUrl={krathong.partner.photoUrl}
                size={54}
              />
            </div>
          ) : krathong.character || krathong.photoUrl ? (
            <CharacterPreview
              gender={krathong.character?.gender}
              outfitColor={krathong.character?.outfitColor}
              skinTone={krathong.character?.skinTone}
              photoUrl={krathong.photoUrl}
              size={70}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-xl">
              🧑
            </div>
          )}
          
          <div className="text-amber-400 text-lg font-bold animate-pulse">~</div>

          <div className="p-0.5">
            <KrathongSVG
              style={krathong.style || 'banana-leaf'}
              flameColor={krathong.flameColor || 'gold'}
              size={80}
              animated={true}
            />
          </div>
        </div>

        {/* Author Name & Time */}
        <h3 className="text-base sm:text-lg font-bold text-amber-200">
          {krathong.isCouple ? `กระทงคู่ของ ${krathong.name} 💑` : `กระทงของ ${krathong.name || 'เพื่อนร่วมสายน้ำ'}`}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
          ลอยสู่แม่น้ำ {getTimeString()}
        </p>

        {/* Wish Quote Box */}
        <div className="my-3 sm:my-4 p-3 sm:p-4 bg-gradient-to-b from-slate-950/80 to-slate-900/90 rounded-xl sm:rounded-2xl border border-amber-400/20 shadow-inner relative text-left">
          <span className="absolute -top-2.5 left-3 sm:left-4 px-2 py-0.2 bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-bold rounded-full">
            {krathong.isCouple ? 'คำอธิษฐานคู่ 💑' : 'คำอธิษฐาน 🪷'}
          </span>
          <p className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed italic font-mali mt-1">
            "{krathong.wish}"
          </p>
        </div>

        {/* Reaction Buttons (Heart & Blessing) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
          <button
            type="button"
            onClick={handleLike}
            className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              hasLiked
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md'
                : 'bg-slate-800/80 hover:bg-rose-500/10 border-slate-700 hover:border-rose-400/50 text-slate-300'
            }`}
          >
            <Heart size={15} className={hasLiked ? 'fill-rose-400 text-rose-400 animate-bounce' : 'text-rose-400'} />
            <span>ส่งใจ ({krathong.likes || 0})</span>
          </button>

          <button
            type="button"
            onClick={handleBless}
            className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              hasBlessed
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                : 'bg-slate-800/80 hover:bg-amber-500/10 border-slate-700 hover:border-amber-400/50 text-slate-300'
            }`}
          >
            <Sparkles size={15} className={hasBlessed ? 'text-amber-400 animate-spin' : 'text-amber-400'} />
            <span>สาธุ ({krathong.blessings || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
