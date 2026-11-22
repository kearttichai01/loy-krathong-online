import React from 'react';
import { X, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪷</span>
            <h3 className="text-base font-bold text-amber-200">
              เกี่ยวกับประเพณีลอยกระทงออนไลน์
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <h4 className="text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles size={14} /> สืบสานประเพณีไทย คืนเพ็ญเดือน ๑๒
            </h4>
            <p>
              ประเพณีลอยกระทงตรงกับวันขึ้น ๑๕ ค่ำ เดือน ๑๒ มีจุดมุ่งหมายเพื่อบูชาและขอขมาพระแม่คงคาที่ประทานสายน้ำหล่อเลี้ยงชีวิต และร่วมลอยทุกข์โศกโรคภัยออกไป
            </p>
          </div>

          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <h4 className="text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
              <ShieldCheck size={14} /> รักษ์โลก 100% ไม่สร้างขยะในแม่น้ำ
            </h4>
            <p>
              การลอยกระทงออนไลน์ช่วยให้เราร่วมส่งต่อคำอธิษฐานและความปรารถนาดีได้จากทุกมุมโลก โดยไม่สร้างมลพิษหรือขยะตกค้างในแม่น้ำลำคลองจริง
            </p>
          </div>

          <div className="space-y-1.5">
            <h5 className="font-semibold text-slate-200">วิธีใช้งานและมีส่วนร่วม:</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>คลิกปุ่ม <strong>"สร้างและลอยกระทง"</strong> เพื่อเลือกตัวละคร ปรับแต่งกระทง และพิมพ์คำขอพร</li>
              <li>เมื่อกดลอย กระทงของคุณจะปรากฏที่ท่าน้ำและลอยออกสู่แม่น้ำ</li>
              <li>คลิกที่กระทงของเพื่อนๆ เพื่ออ่านคำอวยพรและกดปุ่ม <Heart className="inline text-rose-400" size={12} /> ส่งใจ หรือ <Sparkles className="inline text-amber-400" size={12} /> สาธุ</li>
              <li>เปิดเสียงดนตรีบรรยากาศเพื่อเพิ่มความผ่อนคลาย</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            เข้าใจแล้ว ร่วมลอยกระทงกันเลย!
          </button>
        </div>
      </div>
    </div>
  );
}
