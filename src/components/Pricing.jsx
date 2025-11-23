import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Navigation from './Navigation';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const packages = [
    {
      name: 'Free',
      nameEn: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'เหมาะสำหรับผู้เริ่มต้นที่ต้องการทดลองใช้งาน',
      features: [
        { text: 'รายงานข้อมูลพื้นฐาน', included: true },
        { text: 'ดูข้อมูลย้อนหลัง 7 วัน', included: true },
        { text: 'ส่งออกข้อมูล CSV', included: true },
        { text: 'รีเฟรชข้อมูลทุก 24 ชั่วโมง', included: true },
        { text: 'รองรับ 1 บัญชี Shopee', included: true },
        { text: 'รายงานแบบละเอียด', included: false },
        { text: 'กราฟวิเคราะห์ขั้นสูง', included: false },
        { text: 'การแจ้งเตือนอัตโนมัติ', included: false },
        { text: 'API Access', included: false },
        { text: 'การสนับสนุนลำดับความสำคัญ', included: false }
      ],
      popular: false,
      buttonText: 'เริ่มใช้งานฟรี',
      buttonVariant: 'outline'
    },
    {
      name: 'Pro',
      nameEn: 'Pro',
      price: { monthly: 499, yearly: 4990 },
      description: 'เหมาะสำหรับนักการตลาดมืออาชีพ',
      features: [
        { text: 'รายงานข้อมูลพื้นฐาน', included: true },
        { text: 'ดูข้อมูลย้อนหลัง 90 วัน', included: true },
        { text: 'ส่งออกข้อมูล CSV', included: true },
        { text: 'รีเฟรชข้อมูลทุก 1 ชั่วโมง', included: true },
        { text: 'รองรับ 3 บัญชี Shopee', included: true },
        { text: 'รายงานแบบละเอียด', included: true },
        { text: 'กราฟวิเคราะห์ขั้นสูง', included: true },
        { text: 'การแจ้งเตือนอัตโนมัติ', included: true },
        { text: 'API Access', included: false },
        { text: 'การสนับสนุนลำดับความสำคัญ', included: false }
      ],
      popular: true,
      buttonText: 'เริ่มใช้งาน Pro',
      buttonVariant: 'primary'
    },
    {
      name: 'Enterprise',
      nameEn: 'Enterprise',
      price: { monthly: 1999, yearly: 19990 },
      description: 'เหมาะสำหรับทีมและองค์กรขนาดใหญ่',
      features: [
        { text: 'รายงานข้อมูลพื้นฐาน', included: true },
        { text: 'ดูข้อมูลย้อนหลังไม่จำกัด', included: true },
        { text: 'ส่งออกข้อมูล CSV, Excel, PDF', included: true },
        { text: 'รีเฟรชข้อมูลแบบเรียลไทม์', included: true },
        { text: 'รองรับบัญชี Shopee ไม่จำกัด', included: true },
        { text: 'รายงานแบบละเอียด', included: true },
        { text: 'กราฟวิเคราะห์ขั้นสูง', included: true },
        { text: 'การแจ้งเตือนอัตโนมัติ', included: true },
        { text: 'API Access', included: true },
        { text: 'การสนับสนุนลำดับความสำคัญ 24/7', included: true }
      ],
      popular: false,
      buttonText: 'ติดต่อฝ่ายขาย',
      buttonVariant: 'outline'
    }
  ];

  const getPrice = (pkg) => {
    if (pkg.price.monthly === 0) return 'ฟรี';
    const price = billingCycle === 'monthly' ? pkg.price.monthly : pkg.price.yearly;
    return `฿${price.toLocaleString()}`;
  };

  const getBillingPeriod = () => {
    return billingCycle === 'monthly' ? 'ต่อเดือน' : 'ต่อปี';
  };

  const getSavings = (pkg) => {
    if (pkg.price.monthly === 0) return null;
    const monthlyTotal = pkg.price.monthly * 12;
    const yearlySavings = monthlyTotal - pkg.price.yearly;
    const savingsPercent = Math.round((yearlySavings / monthlyTotal) * 100);
    return { amount: yearlySavings, percent: savingsPercent };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            เลือกแพ็คเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            เริ่มต้นฟรีและอัพเกรดได้ทุกเมื่อที่ธุรกิจของคุณเติบโต
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              รายเดือน
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              รายปี
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                ประหยัด 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden ${
                pkg.popular
                  ? 'bg-gradient-to-b from-blue-900/20 to-slate-900/50 border-2 border-blue-500/50 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/50 border border-slate-800'
              } backdrop-blur-sm`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                  แนะนำ
                </div>
              )}

              <div className="p-8">
                {/* Package Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{pkg.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{getPrice(pkg)}</span>
                    {pkg.price.monthly !== 0 && (
                      <span className="text-slate-400 ml-2">{getBillingPeriod()}</span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && pkg.price.monthly !== 0 && (
                    <div className="text-sm text-green-400 mt-2">
                      ประหยัด ฿{getSavings(pkg).amount.toLocaleString()} ({getSavings(pkg).percent}%)
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    pkg.buttonVariant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {pkg.buttonText}
                </button>

                {/* Features List */}
                <ul className="mt-8 space-y-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            คำถามที่พบบ่อย
          </h3>
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                สามารถเปลี่ยนแพ็คเกจได้หรือไม่?
              </h4>
              <p className="text-slate-400">
                ได้เลยค่ะ คุณสามารถอัพเกรดหรือดาวน์เกรดแพ็คเกจได้ทุกเมื่อ โดยจะคำนวณค่าบริการตามสัดส่วน
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                มีการคืนเงินหรือไม่?
              </h4>
              <p className="text-slate-400">
                เรามีนโยบายคืนเงินภายใน 30 วัน หากคุณไม่พอใจกับบริการของเรา
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                รูปแบบการชำระเงินมีอะไรบ้าง?
              </h4>
              <p className="text-slate-400">
                รับชำระผ่านบัตรเครดิต/เดบิต, โอนผ่านธนาคาร, และ QR Code พร้อมเพย์
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                มีการทดลองใช้ฟรีหรือไม่?
              </h4>
              <p className="text-slate-400">
                แพ็คเกจ Free สามารถใช้งานได้ตลอดไปโดยไม่มีค่าใช้จ่าย สำหรับแพ็คเกจ Pro และ Enterprise เรามีระยะทดลองใช้ฟรี 14 วัน
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            ต้องการข้อมูลเพิ่มเติม?
          </h3>
          <p className="text-slate-400 mb-6">
            ทีมงานของเรายินดีให้คำปรึกษาและช่วยคุณเลือกแพ็คเกจที่เหมาะสมที่สุด
          </p>
          <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
            ติดต่อเรา
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
