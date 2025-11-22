# คำสั่งสำหรับ Push ไป GitHub

## ขั้นตอนที่ 1: สร้าง Repository บน GitHub
1. ไปที่ https://github.com/mnreview
2. คลิก "New repository" หรือไปที่ https://github.com/new
3. ตั้งชื่อ repository เช่น: `shopee-affiliate-dashboard`
4. เลือก Public หรือ Private ตามต้องการ
5. **อย่าเลือก** "Initialize this repository with a README" (เพราะเรามีแล้ว)
6. คลิก "Create repository"

## ขั้นตอนที่ 2: Push Code ขึ้น GitHub

หลังจากสร้าง repository แล้ว ให้รันคำสั่งเหล่านี้:

```bash
# เพิ่ม remote repository (แทน YOUR_REPO_NAME ด้วยชื่อ repo ที่สร้าง)
git remote add origin https://github.com/mnreview/YOUR_REPO_NAME.git

# เปลี่ยน branch เป็น main (ถ้ายังเป็น master)
git branch -M main

# Push code ขึ้น GitHub
git push -u origin main
```

## ตัวอย่างคำสั่งที่สมบูรณ์:

```bash
git remote add origin https://github.com/mnreview/shopee-affiliate-dashboard.git
git branch -M main
git push -u origin main
```

## หมายเหตุ:
- ถ้า GitHub ขอ login ให้ใช้ Personal Access Token แทน password
- สร้าง Token ได้ที่: https://github.com/settings/tokens
- เลือก scope: `repo` (Full control of private repositories)

## สิ่งที่ถูก Commit:
✅ ไฟล์ทั้งหมดในโปรเจค
✅ .gitignore (ป้องกันไม่ให้ push node_modules)
✅ README.md (คำแนะนำการใช้งาน)
✅ Source code ทั้งหมด
✅ Configuration files

## ไฟล์ที่ไม่ถูก Push (ตาม .gitignore):
❌ node_modules/
❌ dist/
❌ .env files
❌ logs
