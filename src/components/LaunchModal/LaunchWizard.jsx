import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import StepCharacter from './StepCharacter';
import StepKrathong from './StepKrathong';
import StepWish from './StepWish';

export default function LaunchWizard({ isOpen, onClose, onLaunch }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    character: {
      gender: 'female',
      outfitColor: '#ec4899',
      skinTone: '#fde68a'
    },
    style: 'banana-leaf',
    flameColor: 'gold',
    wish: '',
    releaseLantern: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.name.trim()) {
        setErrorMsg('กรุณากรอกชื่อของคุณก่อนดำเนินการต่อครับ');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.wish.trim()) {
      setErrorMsg('กรุณาพิมพ์หรือเลือกคำอธิษฐานก่อนลอยกระทงครับ');
      return;
    }

    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.85 },
        colors: ['#facc15', '#fb7185', '#38bdf8', '#4ade80', '#c084fc']
      });
    } catch (e) {}

    onLaunch(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="text-lg sm:text-xl">🪷</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-200">
                สร้างและลอยกระทงออนไลน์
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                ขั้นตอนที่ {step} จาก 3: {step === 1 ? 'เลือกตัวละคร' : step === 2 ? 'เลือกกระทง' : 'อธิษฐานขอพร'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex h-1 bg-slate-800">
          <div 
            className="bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
          {errorMsg && (
            <div className="mb-3 p-2.5 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <StepCharacter data={formData} onChange={setFormData} />
          )}
          {step === 2 && (
            <StepKrathong data={formData} onChange={setFormData} />
          )}
          {step === 3 && (
            <StepWish data={formData} onChange={setFormData} />
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-950/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft size={16} /> ย้อนกลับ
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
            >
              ถัดไป <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 rounded-xl shadow-xl transition-all active:scale-95 cursor-pointer border border-yellow-200"
            >
              <Sparkles size={15} /> ลอยกระทงลงสู่สายน้ำ 🪷
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
