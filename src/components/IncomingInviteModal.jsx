import React from 'react';
import { Heart, Sparkles, X, Check } from 'lucide-react';
import CharacterPreview from './CharacterPreview';
import confetti from 'canvas-confetti';

export default function IncomingInviteModal({
  invite,
  myProfile,
  onAccept,
  onDecline
}) {
  if (!invite || !invite.from) return null;

  const handleAccept = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#facc15']
      });
    } catch (e) {}
    onAccept(invite);
  };

  const handleDecline = () => {
    onDecline(invite);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 text-center animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl sm:text-4xl mb-2 animate-bounce">💌</div>

        <h3 className="text-base sm:text-lg font-bold text-amber-200 flex items-center justify-center gap-1.5">
          <span>มีคำชวนลอยกระทงคู่กัน!</span>
          <Sparkles size={16} className="text-amber-400" />
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          คุณ <strong className="text-amber-300">{invite.from.name}</strong> ชวนคุณจับคู่ลอยกระทงร่วมกันในคืนวันเพ็ญ 🪷
        </p>

        {/* Side-by-Side Avatars with Pulsing Heart */}
        <div className="flex items-center justify-center gap-3.5 my-5 p-4 bg-slate-950/80 rounded-2xl border border-rose-500/30 shadow-inner">
          {/* Sender */}
          <div className="flex flex-col items-center">
            <CharacterPreview
              gender={invite.from.character?.gender}
              outfitColor={invite.from.character?.outfitColor}
              skinTone={invite.from.character?.skinTone}
              photoUrl={invite.from.photoUrl}
              size={68}
            />
            <span className="text-[11px] font-bold text-amber-200 mt-1.5 truncate max-w-[85px]">
              {invite.from.name}
            </span>
            <span className="text-[9px] text-slate-400">ผู้ชวน</span>
          </div>

          {/* Connection Heart */}
          <div className="flex flex-col items-center justify-center px-1">
            <span className="text-2xl text-rose-400 animate-pulse">💖</span>
            <span className="text-[10px] text-amber-400 font-semibold mt-1">ลอยคู่</span>
          </div>

          {/* Recipient (Me) */}
          <div className="flex flex-col items-center">
            <CharacterPreview
              gender={myProfile?.character?.gender}
              outfitColor={myProfile?.character?.outfitColor}
              skinTone={myProfile?.character?.skinTone}
              photoUrl={myProfile?.photoUrl}
              size={68}
            />
            <span className="text-[11px] font-bold text-amber-200 mt-1.5 truncate max-w-[85px]">
              {myProfile?.name}
            </span>
            <span className="text-[9px] text-emerald-400 font-medium">คุณ</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mb-5">
          หากกดยอมรับ ระบบจะพาทั้งคู่เข้าสู่หน้าแต่งกระทงและอธิษฐานร่วมกัน ✨
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm text-slate-300 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <X size={15} />
            <span>ปฏิเสธ</span>
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 border border-pink-200/50"
          >
            <Check size={16} strokeWidth={2.5} />
            <span>ยอมรับคำชวน 🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
}
