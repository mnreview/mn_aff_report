import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { BarChart3, TrendingUp, Clock, Shield, Zap, FileSpreadsheet, Bell, LineChart, CheckCircle, Star } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Dashboard แบบเรียลไทม์',
      description: 'ติดตามยอดขายและคอมมิชชั่นของคุณแบบเรียลไทม์ พร้อมกราฟแสดงแนวโน้มที่ชัดเจน'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'รายงานแบบละเอียด',
      description: 'วิเคราะห์ข้อมูลทุกมิติ ตั้งแต่สินค้า ช่องทาง ไปจนถึง Sub ID เพื่อเพิ่มประสิทธิภาพ'
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'กราฟวิเคราะห์ขั้นสูง',
      description: 'ดูแนวโน้มยอดขาย คอมมิชชั่น และ Conversion Rate ด้วยกราฟที่เข้าใจง่าย'
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: 'ส่งออกรายงาน',
      description: 'ส่งออกข้อมูลเป็น CSV สำหรับการวิเคราะห์เพิ่มเติมหรือนำเสนอ'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'ดูข้อมูลย้อนหลัง',
      description: 'เข้าถึงข้อมูลย้อนหลังได้ถึง 90 วัน พร้อมระบบแคชเพื่อความเร็ว'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'ปลอดภัยและเชื่อถือได้',
      description: 'ใช้เทคโนโลยี Encryption และเก็บข้อมูลบน Cloud ที่ปลอดภัย'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'รีเฟรชอัตโนมัติ',
      description: 'ข้อมูลอัปเดตอัตโนมัติตามแพ็คเกจ ตั้งแต่ทุก 24 ชั่วโมงถึงแบบเรียลไทม์'
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'การแจ้งเตือน',
      description: 'รับแจ้งเตือนเมื่อมียอดขาย หรือคอมมิชชั่นเข้ามาในแพ็คเกจ Pro ขึ้นไป'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'สมัครสมาชิก',
      description: 'สมัครด้วยอีเมลและเลือกแพ็คเกจที่เหมาะกับคุณ เริ่มต้นฟรีได้เลย'
    },
    {
      number: '2',
      title: 'เชื่อมต่อ Shopee',
      description: 'กรอก App ID และ Secret จาก Shopee Affiliate Platform'
    },
    {
      number: '3',
      title: 'เริ่มติดตามผล',
      description: 'ดูรายงานและวิเคราะห์ข้อมูลเพื่อเพิ่มยอดขายของคุณ'
    }
  ];

  const testimonials = [
    {
      name: 'คุณสมชาย',
      role: 'Affiliate Marketer',
      content: 'ใช้งานง่าย ข้อมูลครบถ้วน ช่วยให้ผมวิเคราะห์ผลงานและปรับกลยุทธ์ได้ดีขึ้น',
      rating: 5
    },
    {
      name: 'คุณนภา',
      role: 'Content Creator',
      content: 'Dashboard สวยงาม ดูข้อมูลได้ครบทุกมิติ ประหยัดเวลาในการดูรายงานมาก',
      rating: 5
    },
    {
      name: 'คุณธนา',
      role: 'E-commerce Team Lead',
      content: 'ทีมเราใช้แพ็คเกจ Enterprise รองรับหลายบัญชี มีระบบรายงานที่ละเอียดมาก',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
              <Star className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Platform อันดับ 1 สำหรับ Shopee Affiliate</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              ยกระดับ<span className="text-gradient-gold"> Shopee Affiliate</span><br />
              ด้วยระบบรายงานที่ทรงพลัง
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              ติดตามและวิเคราะห์ผลงาน Affiliate ของคุณได้แบบเรียลไทม์
              พร้อม Dashboard ที่ครบครันและรายงานแบบละเอียด
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-lg font-semibold transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                เริ่มใช้งานฟรี
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-lg font-semibold transition-all border border-white/10"
              >
                ดูแพ็คเกจทั้งหมด
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-6">
              ไม่ต้องใช้บัตรเครดิต • เริ่มใช้งานได้ทันที • ทดลองฟรีทุกฟีเจอร์
            </p>
          </div>

          {/* Screenshot/Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 blur-3xl opacity-20"></div>
              <div className="glass-panel p-2 rounded-2xl relative">
                <div className="bg-slate-950 rounded-xl overflow-hidden border border-white/5">
                  <div className="h-8 bg-slate-900/50 flex items-center px-4 gap-2 border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-8 text-center">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="glass-panel p-4 rounded-xl">
                        <div className="text-2xl font-bold text-white">฿125,450</div>
                        <div className="text-sm text-slate-400 mt-1">ยอดขายรวม</div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl">
                        <div className="text-2xl font-bold text-orange-400">฿12,545</div>
                        <div className="text-sm text-slate-400 mt-1">คอมมิชชั่น</div>
                      </div>
                      <div className="glass-panel p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-400">10.0%</div>
                        <div className="text-sm text-slate-400 mt-1">Conversion</div>
                      </div>
                    </div>
                    <div className="h-48 bg-slate-900/50 rounded-lg flex items-center justify-center border border-white/5">
                      <LineChart className="w-16 h-16 text-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ฟีเจอร์ที่ทรงพลัง
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              ทุกอย่างที่คุณต้องการเพื่อติดตามและเพิ่มประสิทธิภาพ Affiliate ของคุณ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel p-6 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              เริ่มต้นใช้งานง่ายๆ แค่ 3 ขั้นตอน
            </h2>
            <p className="text-xl text-slate-400">
              ตั้งค่าและเริ่มติดตามผลได้ภายในไม่กี่นาที
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg shadow-orange-500/30">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-500">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ผู้ใช้งานบอกว่าอย่างไร
            </h2>
            <p className="text-xl text-slate-400">
              เข้าร่วมกับนักการตลาดหลายพันคนที่เชื่อใจและใช้งานระบบของเรา
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-panel p-8 rounded-xl border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl p-12 text-center border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              พร้อมเริ่มต้นหรือยัง?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              ลงทะเบียนวันนี้และเริ่มติดตามผลงาน Shopee Affiliate ของคุณแบบมืออาชีพ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-lg font-semibold transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                เริ่มใช้งานฟรีทันที
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-lg font-semibold transition-all border border-white/10"
              >
                เรียนรู้เพิ่มเติม
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">Shopee Affiliate</span>
              </div>
              <p className="text-slate-400 text-sm">
                ระบบรายงานและวิเคราะห์ข้อมูล Shopee Affiliate ที่ทรงพลัง
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">สินค้า</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/pricing" className="hover:text-white transition-colors">ราคา</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">ฟีเจอร์</a></li>
                <li><Link to="/about" className="hover:text-white transition-colors">เกี่ยวกับเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">การสนับสนุน</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">เอกสารประกอบ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">คำถามที่พบบ่อย</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ติดต่อเรา</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">ติดตาม</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LINE</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Shopee Affiliate Report. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
