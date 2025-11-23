import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { Target, Users, Zap, Heart, CheckCircle, TrendingUp } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'มุ่งเน้นผลลัพธ์',
      description: 'เราพัฒนาเครื่องมือที่ช่วยให้คุณเพิ่มประสิทธิภาพและรายได้จาก Affiliate ได้จริง'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'ใส่ใจผู้ใช้',
      description: 'ออกแบบและพัฒนาทุกฟีเจอร์โดยคำนึงถึงประสบการณ์ผู้ใช้เป็นหลัก'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'พัฒนาอย่างต่อเนื่อง',
      description: 'อัปเดตฟีเจอร์ใหม่และปรับปรุงประสิทธิภาพอย่างสม่ำเสมอ'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'รักในสิ่งที่ทำ',
      description: 'เราทุ่มเทพัฒนาผลิตภัณฑ์ที่ดีที่สุดเพื่อชุมชน Affiliate'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'ผู้ใช้งาน' },
    { number: '100M+', label: 'รายการวิเคราะห์' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'การสนับสนุน' }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'ก่อตั้งบริษัท',
      description: 'เริ่มต้นพัฒนาระบบรายงาน Shopee Affiliate ที่ตอบโจทย์นักการตลาด'
    },
    {
      year: '2024',
      title: 'เปิดตัวแพ็คเกจ Pro',
      description: 'ขยายฟีเจอร์สำหรับมืออาชีพ พร้อมระบบแจ้งเตือนอัตโนมัติ'
    },
    {
      year: '2024',
      title: 'Enterprise Package',
      description: 'เปิดตัวแพ็คเกจสำหรับองค์กรขนาดใหญ่ พร้อม API Access'
    },
    {
      year: '2024',
      title: 'ผู้ใช้ 5,000+',
      description: 'มีผู้ใช้งานเกิน 5,000 คน พร้อมพันธมิตรมากกว่า 100 บริษัท'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              เกี่ยวกับ<span className="text-gradient-gold"> Shopee Affiliate Report</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              เราคือทีมที่หลงใหลในการสร้างเครื่องมือที่ช่วยให้นักการตลาด Affiliate
              ทำงานได้อย่างมีประสิทธิภาพและประสบความสำเร็จมากขึ้น
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="glass-panel p-10 rounded-2xl border border-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">พันธกิจของเรา</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                สร้างแพลตฟอร์มที่ช่วยให้นักการตลาด Affiliate ทุกคนสามารถติดตามและวิเคราะห์ผลงานได้อย่างง่ายดาย
                เพื่อเพิ่มประสิทธิภาพและสร้างรายได้ที่ดีขึ้น
              </p>
            </div>
            <div className="glass-panel p-10 rounded-2xl border border-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">วิสัยทัศน์</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                เป็นแพลตฟอร์มอันดับ 1 สำหรับการจัดการและวิเคราะห์ Affiliate Marketing
                ในภูมิภาคเอเชียตะวันออกเฉียงใต้ ที่ทุกคนสามารถเข้าถึงและใช้งานได้
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="glass-panel p-8 rounded-xl text-center border border-white/5 hover:border-orange-500/30 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ค่านิยมของเรา
            </h2>
            <p className="text-xl text-slate-400">
              หลักการที่เรายึดถือในการพัฒนาผลิตภัณฑ์และให้บริการ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-panel p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 text-white group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              เส้นทางของเรา
            </h2>
            <p className="text-xl text-slate-400">
              ก้าวสำคัญในการพัฒนาและเติบโต
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                {/* Timeline Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-3 md:left-5 top-8 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-amber-600"></div>
                )}
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-2 top-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full border-4 border-slate-950 shadow-lg shadow-orange-500/30"></div>

                <div className="glass-panel p-6 md:p-8 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">{milestone.title}</h3>
                    <span className="text-orange-400 font-semibold text-sm md:text-base">{milestone.year}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ทำไมต้องเลือกเรา
            </h2>
            <p className="text-xl text-slate-400">
              สิ่งที่ทำให้เราแตกต่างจากคู่แข่ง
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'รายงานแบบเรียลไทม์และแม่นยำ',
              'ติดตั้งและใช้งานง่ายภายในไม่กี่นาที',
              'ราคาที่เหมาะสมกับทุกระดับธุรกิจ',
              'ระบบแคชข้อมูลเพื่อประหยัดค่า API',
              'รองรับหลายบัญชี Shopee Affiliate',
              'อัปเดตและพัฒนาฟีเจอร์ใหม่อย่างต่อเนื่อง',
              'ทีมสนับสนุนที่พร้อมช่วยเหลือตลอด 24/7',
              'ความปลอดภัยของข้อมูลระดับสูง'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 glass-panel p-4 rounded-lg border border-white/5">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl p-12 text-center border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              เข้าร่วมกับนักการตลาดหลายพันคนที่ใช้ระบบของเราเพื่อเพิ่มประสิทธิภาพ Affiliate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-lg font-semibold transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                เริ่มใช้งานฟรีทันที
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-lg font-semibold transition-all border border-white/10"
              >
                ดูแพ็คเกจ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-400">
            <p>&copy; 2024 Shopee Affiliate Report. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
