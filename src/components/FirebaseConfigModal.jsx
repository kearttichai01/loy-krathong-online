import React, { useState } from 'react';
import { X, Database, Check, AlertCircle } from 'lucide-react';
import { getStoredFirebaseConfig, saveFirebaseConfig, initFirebase } from '../services/firebase';

export default function FirebaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const currentConfig = getStoredFirebaseConfig() || {};
  const [jsonInput, setJsonInput] = useState(
    currentConfig.apiKey ? JSON.stringify(currentConfig, null, 2) : ''
  );
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setStatusMsg(null);
    if (!jsonInput.trim()) {
      saveFirebaseConfig(null);
      onConfigSaved(false);
      setStatusMsg({ type: 'info', text: 'รีเซ็ตกลับเป็นโหมด Demo จำลองเรียบร้อยแล้ว' });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.apiKey || !parsed.databaseURL) {
        setStatusMsg({
          type: 'error',
          text: 'ข้อมูล Config ต้องมี apiKey และ databaseURL ของ Firebase Realtime Database'
        });
        return;
      }

      saveFirebaseConfig(parsed);
      const isOk = initFirebase(parsed);
      if (isOk) {
        onConfigSaved(true);
        setStatusMsg({ type: 'success', text: 'เชื่อมต่อ Firebase สำเร็จ! โหมดออนไลน์เปิดใช้งานแล้ว' });
        setTimeout(() => onClose(), 1200);
      } else {
        setStatusMsg({ type: 'error', text: 'ไม่สามารถเริ่มต้น Firebase ด้วย Config นี้ได้' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบวงเล็บและเครื่องหมายคำพูด' });
    }
  };

  const handleResetToDemo = () => {
    saveFirebaseConfig(null);
    setJsonInput('');
    onConfigSaved(false);
    setStatusMsg({ type: 'info', text: 'สลับกลับเป็นโหมดจำลองออฟไลน์ (Demo Mode) สำเร็จ' });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-left max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Database className="text-amber-400" size={20} />
            <h3 className="text-base font-bold text-slate-100">
              ตั้งค่า Cloud Backend (Firebase)
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            ระบบรองรับ <strong>Firebase Realtime Database</strong> เพื่อให้ทุกคนทั่วโลกที่เปิดเว็บนี้เห็นกระทงลอยร่วมกันแบบ Real-time (หากไม่ตั้งค่า ระบบจะทำงานในโหมด Offline / Demo อัตโนมัติ)
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              วาง Firebase Web App Config (JSON):
            </label>
            <textarea
              rows={6}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "databaseURL": "https://your-app-default-rtdb.firebaseio.com",\n  "projectId": "your-app"\n}`}
              className="w-full px-3 py-2 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : statusMsg.type === 'error'
                ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
            }`}>
              {statusMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            ล้างค่า / ใช้โหมด Demo
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-md transition-all"
            >
              บันทึกและเชื่อมต่อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
