# Shopee Affiliate Dashboard

Dashboard สำหรับติดตามผลงาน Shopee Affiliate พร้อมระบบรายงานและการวิเคราะห์ข้อมูล

## ✨ Features

- 📊 **Dashboard หลัก** - แสดงสรุปยอดขาย คอมมิชชั่น และกราฟแนวโน้ม
- 🏆 **Top 10 Lists** - สินค้าที่ได้คอมมิชชั่นสูงสุดและขายดีที่สุด
- 📋 **Detailed Report** - รายงานแบบละเอียดทุกฟิลด์
- 🔍 **ระบบกรอง** - กรองตาม Sub ID, วันที่คลิก, Channel Type
- 📅 **Quick Date Selection** - เลือกช่วงเวลาได้ง่าย (เมื่อวาน, 7 วัน, 30 วัน, เดือนนี้, เดือนที่แล้ว)
- 🔄 **Auto Pagination** - ดึงข้อมูลทุกหน้าอัตโนมัติ
- 🎨 **Modern UI** - ใช้ Tailwind CSS และ Kanit Font

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Shopee Affiliate App ID และ Secret

### Installation

1. Clone the repository
```bash
git clone https://github.com/mnreview/shopee-affiliate-dashboard.git
cd shopee-affiliate-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the backend server
```bash
node server.js
```

4. Start the frontend development server (in another terminal)
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

1. **ใส่ API Credentials**
   - กรอก App ID และ Secret ที่ได้จาก Shopee Affiliate
   - ข้อมูลจะถูกบันทึกใน localStorage

2. **เลือกช่วงเวลา**
   - เลือกจาก Quick Select หรือกำหนดวันที่เอง
   - กด "Fetch Data from API" เพื่อดึงข้อมูล

3. **ดูรายงาน**
   - Dashboard: ภาพรวมและ Top 10
   - Detailed Report: รายละเอียดทุกฟิลด์

4. **กรองข้อมูล**
   - กดปุ่ม "แสดงตัวกรอง"
   - กรองตาม Sub ID, วันที่, Channel Type
   - กด "Apply Filters"

## 🛠️ Tech Stack

### Frontend
- **React** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **React Router** - Routing
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **crypto-js** - SHA256 Signature

## 📁 Project Structure

```
shopee-affiliate-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # หน้าหลัก
│   │   ├── DetailedReport.jsx     # รายงานละเอียด
│   │   ├── Filters.jsx            # ช่องเลือกวันที่
│   │   ├── DetailedReportFilters.jsx  # ตัวกรองข้อมูล
│   │   ├── SummaryCards.jsx       # การ์ดสรุป
│   │   ├── Charts.jsx             # กราฟ
│   │   ├── TopLists.jsx           # Top 10 Lists
│   │   └── DataTable.jsx          # ตารางข้อมูล
│   ├── api/
│   │   └── shopee.js              # API Client
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js                       # Backend Proxy Server
├── index.html
├── package.json
└── README.md
```

## 🔐 API Configuration

Backend proxy server ทำหน้าที่:
- สร้าง SHA256 signature สำหรับ Shopee API
- Forward requests ไปยัง Shopee GraphQL API
- จัดการ CORS

## 📝 Notes

- API มีข้อจำกัดว่าดึงข้อมูลได้แค่ 3 เดือนล่าสุด
- ScrollId มีอายุ 30 วินาที
- ระบบจะดึงข้อมูลทุกหน้าอัตโนมัติ (สูงสุด 100 หน้า)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT

## 👤 Author

mnreview

## 🙏 Acknowledgments

- Shopee Affiliate API
- React Community
- Tailwind CSS Team
