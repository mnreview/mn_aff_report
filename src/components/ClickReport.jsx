import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchClickReport } from '../api/shopee';
import { supabase } from '../supabaseClient';
import Navigation from './Navigation';
import RateLimitIndicator from './RateLimitIndicator';
import { incrementRequestCount, getRateLimitStatus } from '../utils/rateLimit';
import { ArrowLeft, Download, RefreshCw, Calendar, MousePointerClick } from 'lucide-react';

const ClickReport = ({ appId, secret, userId }) => {
  const [clickData, setClickData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subId, setSubId] = useState('');
  const [rateLimitStatus, setRateLimitStatus] = useState(getRateLimitStatus());
  const navigate = useNavigate();

  useEffect(() => {
    // Set default dates (Yesterday)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format date in local timezone (Bangkok UTC+7)
    const formatDateLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const yesterdayStr = formatDateLocal(yesterday);
    setStartDate(yesterdayStr);
    setEndDate(yesterdayStr);
  }, []);

  const handleFetchData = async () => {
    if (!appId || !secret) {
      setError('กรุณาตั้งค่า App ID และ Secret ก่อน');
      return;
    }

    if (!startDate || !endDate) {
      setError('กรุณาเลือกวันที่');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clickTimeStart = Math.floor(new Date(startDate).getTime() / 1000);
      const clickTimeEnd = Math.floor(new Date(endDate + ' 23:59:59').getTime() / 1000);

      const params = {
        clickTimeStart,
        clickTimeEnd,
        subId: subId || undefined,
        limit: 500
      };

      incrementRequestCount();
      setRateLimitStatus(getRateLimitStatus());

      const response = await fetchClickReport(appId, secret, params);

      if (response.data && response.data.clickReport) {
        setClickData(response.data.clickReport.nodes || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching click report:', err);

      if (err.response?.status === 429) {
        setError('⚠️ เกินขีดจำกัดการเรียก API (Rate Limit) กรุณารอสักครู่แล้วลองใหม่');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (clickData.length === 0) {
      alert('ไม่มีข้อมูลให้ Export');
      return;
    }

    const headers = [
      'Click Time',
      'Sub ID',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'UTM Content',
      'UTM Term',
      'Device',
      'Referrer',
      'Click Count',
      'Short Link',
      'Origin URL'
    ];

    const csvRows = [headers.join(',')];

    clickData.forEach(row => {
      const values = [
        new Date(row.clickTime * 1000).toLocaleString('th-TH'),
        row.subId || '',
        row.utmSource || '',
        row.utmMedium || '',
        row.utmCampaign || '',
        row.utmContent || '',
        row.utmTerm || '',
        row.device || '',
        row.referrer || '',
        row.clickCount || 0,
        row.shortLink || '',
        row.originUrl || ''
      ];
      csvRows.push(values.map(v => `"${v}"`).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `shopee_click_report_${startDate}_${endDate}.csv`);
    link.click();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Calculate summary stats
  const totalClicks = clickData.reduce((sum, row) => sum + (row.clickCount || 0), 0);
  const uniqueSubIds = new Set(clickData.map(row => row.subId).filter(Boolean)).size;
  const deviceBreakdown = clickData.reduce((acc, row) => {
    const device = row.device || 'Unknown';
    acc[device] = (acc[device] || 0) + (row.clickCount || 0);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation onSignOut={handleSignOut} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Shopee Click Report</h1>
          </div>
        </div>

        <RateLimitIndicator status={rateLimitStatus} />

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">ตัวกรอง</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                <Calendar className="w-4 h-4 inline mr-2" />
                วันที่เริ่มต้น
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                <Calendar className="w-4 h-4 inline mr-2" />
                วันที่สิ้นสุด
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Sub ID (ไม่บังคับ)
              </label>
              <input
                type="text"
                value={subId}
                onChange={(e) => setSubId(e.target.value)}
                placeholder="กรอก Sub ID"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFetchData}
              disabled={loading || !appId || !secret}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'กำลังโหลด...' : 'ดึงข้อมูล'}
            </button>

            {clickData.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {clickData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm mb-1">Total Clicks</p>
                  <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
                </div>
                <MousePointerClick className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm mb-1">Unique Sub IDs</p>
                  <p className="text-3xl font-bold">{uniqueSubIds.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm mb-1">Total Records</p>
                  <p className="text-3xl font-bold">{clickData.length.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Device Breakdown */}
        {clickData.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Device Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(deviceBreakdown).map(([device, count]) => (
                <div key={device} className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">{device}</p>
                  <p className="text-2xl font-bold">{count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        {clickData.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Click Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Sub ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Device</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Clicks</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">UTM Source</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">UTM Campaign</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {clickData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        {new Date(row.clickTime * 1000).toLocaleString('th-TH')}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-blue-400">
                        {row.subId || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">{row.device || '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{row.clickCount || 0}</td>
                      <td className="px-4 py-3 text-sm">{row.utmSource || '-'}</td>
                      <td className="px-4 py-3 text-sm">{row.utmCampaign || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-400 truncate max-w-xs">
                        {row.referrer || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && clickData.length === 0 && !error && (
          <div className="text-center py-12 text-slate-400">
            <MousePointerClick className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>กรุณาเลือกวันที่และกดปุ่ม "ดึงข้อมูล" เพื่อดู Click Report</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickReport;
