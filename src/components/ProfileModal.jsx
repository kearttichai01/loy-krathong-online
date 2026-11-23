import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Sparkles, Check, User } from 'lucide-react';
import CharacterPreview from './CharacterPreview';
import { CHARACTER_GENDERS, OUTFIT_COLORS, SKIN_TONES } from '../data/krathongPresets';

export default function ProfileModal({ 
  isOpen, 
  onSave, 
  initialData = null, 
  canClose = false, 
  onClose = null 
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [avatarMode, setAvatarMode] = useState(initialData?.photoUrl ? 'photo' : 'chibi'); // 'chibi' | 'photo'
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || null);
  const [character, setCharacter] = useState(initialData?.character || {
    gender: 'female',
    outfitColor: '#ec4899',
    skinTone: '#fde68a'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle Photo Upload & Downscaling to avoid huge local storage strings
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create scaled canvas (max 300x300)
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(compressedDataUrl);
        setAvatarMode('photo');
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setAvatarMode('chibi');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('กรุณากรอกชื่อหรือฉายาของคุณก่อนเข้าสู่งานวัดครับ');
      return;
    }

    const profileData = {
      name: name.trim(),
      photoUrl: avatarMode === 'photo' ? photoUrl : null,
      character: {
        ...character,
        gender: character.gender || 'female',
        outfitColor: character.outfitColor || '#ec4899',
        skinTone: character.skinTone || '#fde68a'
      }
    };

    onSave(profileData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🪷</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-200">
                สร้างตัวละครเข้าร่วมงานลอยกระทง
              </h2>
              <p className="text-[11px] text-slate-400">
                ระบุชื่อและเลือกรูปประจำตัวของคุณก่อนเข้าสู่งานวัด
              </p>
            </div>
          </div>
          {canClose && onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-800/40 rounded-2xl border border-slate-700/60 shadow-inner">
            <CharacterPreview
              gender={character.gender}
              outfitColor={character.outfitColor}
              skinTone={character.skinTone}
              photoUrl={avatarMode === 'photo' ? photoUrl : null}
              size={110}
              name={name || 'ชื่อของคุณ'}
              isOnline={true}
            />
            <span className="text-[11px] text-amber-300/80 mt-1.5">
              {avatarMode === 'photo' && photoUrl ? 'รูปภาพของคุณ' : 'ตัวละครของคุณในงานวัด'}
            </span>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-1.5">
              ชื่อของคุณ / ฉายา <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น น้องมะลิ, พี่ต้นกล้า, แป้งหอม"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
            />
          </div>

          {/* Avatar Mode Switcher (Photo vs Chibi) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">
              รูปแบบรูปประจำตัว
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAvatarMode('chibi')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  avatarMode === 'chibi'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👘</span>
                <span>ชุดไทยการ์ตูน</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvatarMode('photo');
                  if (!photoUrl && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  avatarMode === 'photo'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera size={15} />
                <span>ใส่รูปภาพตัวเอง</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Photo Upload Controls */}
          {avatarMode === 'photo' && (
            <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload size={15} />
                  <span>{photoUrl ? 'เปลี่ยนรูปภาพใหม่' : 'เลือกรูปภาพจากเครื่อง'}</span>
                </button>

                {photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="py-2.5 px-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/40 text-rose-300 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="ลบรูปภาพ"
                  >
                    <Trash2 size={15} />
                    <span>ลบรูป</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                รองรับไฟล์ภาพ JPG, PNG, WebP (ระบบจะย่อขนาดให้อัตโนมัติ)
              </p>
            </div>
          )}

          {/* Mode 2: Chibi Avatar Customization */}
          {avatarMode === 'chibi' && (
            <div className="space-y-4 pt-1">
              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  เลือกเพศและสไตล์
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CHARACTER_GENDERS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setCharacter({ ...character, gender: g.id })}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        character.gender === g.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <span className="text-base">{g.id === 'female' ? '🌸' : g.id === 'male' ? '🌿' : '✨'}</span>
                      <span className="text-[11px] font-semibold">{g.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Color */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  สีชุดไทยประยุกต์
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {OUTFIT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCharacter({ ...character, outfitColor: c.hex })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                        character.outfitColor === c.hex
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-semibold'
                          : 'border-slate-800 bg-slate-800/30 text-slate-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  สีผิว
                </label>
                <div className="flex gap-2">
                  {SKIN_TONES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCharacter({ ...character, skinTone: s.hex })}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        character.skinTone === s.hex
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-slate-800 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: s.hex }} />
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base border border-yellow-200 active:scale-95"
            >
              <Sparkles size={18} />
              <span>เข้าสู่งานวัดริมน้ำ 🎪</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
