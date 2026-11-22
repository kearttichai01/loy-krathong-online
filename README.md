# 🪷 ลอยกระทงออนไลน์ (Loy Krathong Online)

เว็บแอปพลิเคชันจำลองประเพณีลอยกระทงออนไลน์แบบเรียลไทม์ (Real-time Interactive Web App) ร่วมขอขมาพระแม่คงคา ส่งคำอธิษฐาน และชมกระทงของเพื่อนๆ ลอยไปตามสายน้ำยามค่ำคืนวันเพ็ญเดือนสิบสอง 🌕

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)

---

## ✨ คุณสมบัติเด่น (Features)

1. **เลือกและปรับแต่งตัวละครผู้ลอย (Character Customization)**
   - เลือกเพศได้ 3 รูปแบบ: หญิง (นางนพมาศ สไบเฉียง), ชาย (เสื้อราชปะแตน), ทางเลือกไม่ระบุเพศ/ร่วมสมัย
   - เลือกสีชุดไทยประยุกต์ได้ 6 สีมงคล (ทอง, ชมพู, ฟ้า, เขียว, ม่วง, ขาว)
   - ปรับแต่งสีผิวและระบุชื่อผู้ลอย
2. **เลือกรูปแบบกระทงหลากหลาย (5 Krathong Styles)**
   - **กระทงใบตองคลาสสิก**: กลีบผกาสีเขียวมรกต ประดับดาวเรืองและกล้วยไม้
   - **กระทงดอกบัวหลวง**: กลีบบัวสีชมพูระเรื่อ สัญลักษณ์แห่งความบริสุทธิ์
   - **กระทงขนมปังรักษ์โลก**: ทรงน้องเต่าขนมปัง ย่อยสลายง่าย เป็นมิตรกับปลา
   - **กระทงกะลามะพร้าวสาย**: กระทงสายสะท้อนแสงไฟสว่างไสว
   - **กระทงนีออนโมเดิร์น**: กระทงดิจิทัลเรืองแสง ไม่สร้างขยะในสายน้ำ
   - ปรับแต่งสีเปลวไฟและแสงเทียนได้ 4 สี (ทอง, ชมพู, ฟ้า, ม่วง)
3. **ระบบอธิษฐานและขอพร (Wish System)**
   - ช่องพิมพ์คำขอพรความยาวสูงสุด 200 ตัวอักษร
   - ปุ่มเลือกคำขอพรมงคลด่วน 6 หมวด (ขอขมาพระแม่คงคา, สุขภาพ, การงาน, ความรัก, โชคลาภ, ปล่อยสิ่งไม่ดี)
   - สวิตช์เลือกปล่อยโคมลอยประทีป (Sky Lantern) สู่ท้องฟ้าคืนวันเพ็ญ
4. **จำลองสายน้ำและบรรยากาศ (2D River Canvas Engine)**
   - ผืนน้ำระยิบระยับจำลองคลื่นน้ำแบบ Sine Waves
   - พระจันทร์เต็มดวง แสงเทียนวูบวาบ และโคมลอยล่องลอยสู่ท้องฟ้า
   - นำเมาส์ไปชี้กระทงเพื่อดูชื่อและคำขอพรตัวอย่าง
5. **ระบบดูกระทงผู้อื่น & ร่วมส่งกำลังใจ (Community & Reactions)**
   - คลิกที่กระทงของผู้อื่นเพื่ออ่านคำขอพร
   - กดปุ่ม **ส่งใจ ❤️** หรือ **สาธุ 🙏** เพื่อเพิ่มกำลังใจให้เจ้าของกระทง
6. **ระบบเสียงดนตรีบรรยากาศ (Ambient Audio Controller)**
   - สังเคราะห์เสียงสายน้ำไหลและเสียงกระดิ่งระนาดแก้ว/ขิม (Thai Pentatonic Chimes) ผ่าน Web Audio API
7. **สถาปัตยกรรมเชื่อมต่อ Cloud (Dual-Mode)**
   - **Offline / Demo Mode**: พร้อมเล่นได้ทันทีแบบ Zero-Config
   - **Firebase Realtime Database**: วาง Firebase config ในหน้า UI เพื่อแชร์ให้คนทั่วโลกเล่นสดพร้อมกันได้ทันที

---

## 🚀 วิธีเปิดใช้งานบนเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```

เปิดบราวเซอร์ไปที่ `http://localhost:5173`

---

## 🌐 วิธีนำขึ้น GitHub & Deploy ออนไลน์อัตโนมัติ (GitHub Pages)

โปรเจกต์นี้มีไฟล์ GitHub Actions Workflow (`.github/workflows/deploy.yml`) อยู่ในตัวแล้ว:

```bash
# 1. สร้าง Repository ใหม่บน GitHub เช่น loy-krathong-online
# 2. เชื่อมต่อ Remote และ Push
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

หลังจาก Push แล้ว:
1. ไปที่ GitHub Repository -> แท็บ **Settings** -> **Pages**
2. ในส่วน **Build and deployment** -> เลือก Source เป็น **GitHub Actions**
3. ระบบจะบิลด์และ Deploy เว็บให้ออนไลน์อัตโนมัติที่ `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/` ทันที!

---

## 📄 License
MIT License
