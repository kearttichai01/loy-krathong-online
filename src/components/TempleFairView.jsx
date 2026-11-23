import React, { useState } from 'react';
import { Users, Heart, Sparkles, Waves, Edit3, ArrowRight, Share2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import TempleFairCanvas from './TempleFairCanvas';
import CharacterPreview from './CharacterPreview';

export default function TempleFairView({
  myProfile,
  onlineVisitors = [],
  onFloatSolo,
  onFloatCouple,
  onGoToRiver,
  onEditProfile,
  onSendInvite,
  onCancelInvite,
  outgoingInviteStatus = null, // { status: 'idle'|'waiting'|'accepted'|'rejected', partner, inviteId }
  onClearOutgoingInvite
}) {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active target partner (either locally selected or currently being invited)
  const activePartner = outgoingInviteStatus?.partner || selectedPartner;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleStartInvite = (partner) => {
    if (onSendInvite) {
      onSendInvite(partner);
    }
  };

  const handleCloseModal = () => {
    if (outgoingInviteStatus?.status === 'waiting') {
      if (onCancelInvite) onCancelInvite();
    }
    setSelectedPartner(null);
    if (onClearOutgoingInvite) onClearOutgoingInvite();
  };

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

        {/* Section Title & Share Button */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs sm:text-sm font-semibold text-amber-300 flex items-center gap-2">
            <Users size={16} />
            <span>เพื่อนๆ ที่มารออยู่ที่ท่าน้ำ ({onlineVisitors.length} คน)</span>
          </h3>

          <button
            onClick={handleCopyLink}
            className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Share2 size={12} />
            <span>{copiedLink ? 'คัดลอกลิงก์แล้ว! 🎉' : 'ชวนเพื่อนมาร่วมงาน 📋'}</span>
          </button>
        </div>

        {/* Pier State: Empty or Attendees Grid */}
        {onlineVisitors.length === 0 ? (
          <div className="w-full max-w-lg py-10 px-5 bg-gradient-to-b from-slate-900/80 to-slate-950/80 rounded-3xl border border-amber-500/20 backdrop-blur-md text-center flex flex-col items-center shadow-xl my-4 animate-in fade-in duration-300">
            <div className="text-4xl mb-3 animate-pulse">🏮</div>
            <h4 className="text-sm sm:text-base font-bold text-amber-200 mb-1.5">
              ขณะนี้ยังไม่มีผู้ร่วมงานคนอื่นอยู่ที่ท่าน้ำ
            </h4>
            <p className="text-xs text-slate-400 mb-5 max-w-sm leading-relaxed">
              ส่งลิงก์ชวนเพื่อนหรือคนพิเศษมาเปิดเว็บลอยกระทงด้วยกัน หรือสามารถเลือกลอยกระทงคนเดียวเพื่อขอขมาพระแม่คงคาได้ทันทีครับ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-xl text-xs font-semibold text-amber-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'คัดลอกลิงก์แล้ว! 🎉' : 'คัดลอกลิงก์ชวนเพื่อนมาร่วมงาน 📋'}</span>
              </button>

              <button
                onClick={onFloatSolo}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>ลอยคนเดียวเลย 🚶‍♂️🪷</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full animate-in fade-in duration-300">
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
                  {v.status || 'ออนไลน์อยู่ที่ท่าน้ำ 🟢'}
                </span>

                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-amber-300">
                  <span>ชวนลอยคู่</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* 4. Couple Invitation Dialog with Waiting-for-Acceptance Flow */}
      {activePartner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STATE 1: WAITING FOR ACCEPTANCE */}
            {outgoingInviteStatus?.status === 'waiting' && (
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Loader2 size={42} className="text-amber-400 animate-spin" />
                    <span className="absolute inset-0 flex items-center justify-center text-sm">
                      💖
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-200">
                    ส่งคำชวนแล้ว! กำลังรออีกฝ่ายกดยอมรับ...
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5">
                    คำชวนลอยกระทงคู่ถูกส่งไปยังหน้าจอของ <strong className="text-amber-300">{activePartner.name}</strong> เรียบร้อยแล้ว
                  </p>
                </div>

                {/* Avatars */}
                <div className="flex items-center justify-center gap-3.5 my-4 p-3.5 bg-slate-950/70 rounded-2xl border border-amber-500/20">
                  <div className="flex flex-col items-center">
                    <CharacterPreview
                      gender={myProfile.character?.gender}
                      outfitColor={myProfile.character?.outfitColor}
                      skinTone={myProfile.character?.skinTone}
                      photoUrl={myProfile.photoUrl}
                      size={60}
                    />
                    <span className="text-[10px] text-amber-300 font-medium mt-1 truncate max-w-[80px]">
                      {myProfile.name}
                    </span>
                  </div>

                  <span className="text-xl text-rose-400 animate-pulse">⏳</span>

                  <div className="flex flex-col items-center">
                    <CharacterPreview
                      gender={activePartner.character?.gender}
                      outfitColor={activePartner.character?.outfitColor}
                      skinTone={activePartner.character?.skinTone}
                      photoUrl={activePartner.photoUrl}
                      size={60}
                    />
                    <span className="text-[10px] text-amber-300 font-medium mt-1 truncate max-w-[80px]">
                      {activePartner.name}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  เมื่อคุณ {activePartner.name} กดยอมรับ ระบบจะพาทั้งคู่ไปแต่งกระทงคู่กันทันที ✨
                </p>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  ยกเลิกคำชวน
                </button>
              </div>
            )}

            {/* STATE 2: ACCEPTED! */}
            {outgoingInviteStatus?.status === 'accepted' && (
              <div className="space-y-4 py-3 animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={46} className="text-emerald-400 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-300">
                    คุณ {activePartner.name} กดยอมรับคำชวนแล้ว! 🎉
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    กำลังพาทั้งสองท่านเข้าสู่หน้าแต่งกระทงคู่กัน...
                  </p>
                </div>
              </div>
            )}

            {/* STATE 3: REJECTED */}
            {outgoingInviteStatus?.status === 'rejected' && (
              <div className="space-y-4 py-2">
                <XCircle size={44} className="text-rose-400 mx-auto" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-200">
                    คุณ {activePartner.name} ยังไม่สะดวกในขณะนี้ 🌸
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ท่านสามารถชวนเพื่อนคนอื่น หรือเลือกลอยคนเดียวได้อย่างสบายใจครับ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors cursor-pointer"
                >
                  กลับสู่ท่าน้ำ
                </button>
              </div>
            )}

            {/* STATE 4: INITIAL CONFIRMATION (IDLE) */}
            {(!outgoingInviteStatus || outgoingInviteStatus.status === 'idle') && (
              <>
                <div className="text-3xl mb-2 animate-bounce">💑</div>

                <h3 className="text-base sm:text-lg font-bold text-amber-200">
                  ลอยกระทงคู่กันในคืนวันเพ็ญ
                </h3>

                <p className="text-xs text-slate-300 mt-1">
                  คุณต้องการส่งคำชวนลอยกระทงคู่ร่วมกับ <strong>{activePartner.name}</strong> หรือไม่?
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
                      gender={activePartner.character?.gender}
                      outfitColor={activePartner.character?.outfitColor}
                      skinTone={activePartner.character?.skinTone}
                      photoUrl={activePartner.photoUrl}
                      size={68}
                    />
                    <span className="text-[10px] text-amber-300 font-medium mt-1 truncate max-w-[80px]">
                      {activePartner.name}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mb-4">
                  * เมื่อกดส่งคำชวน ระบบจะรอให้อีกฝ่ายกดยอมรับก่อนเข้าสู่หน้าลอยกระทง
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartInvite(activePartner)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    ส่งคำชวนลอยคู่ 💌
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
