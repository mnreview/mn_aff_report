import React from 'react';

const Filters = ({ startDate, setStartDate, endDate, setEndDate, onSearch }) => {
    const handlePresetChange = (preset) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let start, end;

        switch (preset) {
            case 'yesterday':
                start = new Date(today);
                start.setDate(start.getDate() - 1);
                end = new Date(today);
                end.setDate(end.getDate() - 1);
                break;
            case 'last7days':
                start = new Date(today);
                start.setDate(start.getDate() - 7);
                end = new Date(today);
                end.setDate(end.getDate() - 1);
                break;
            case 'last30days':
                start = new Date(today);
                start.setDate(start.getDate() - 30);
                end = new Date(today);
                end.setDate(end.getDate() - 1);
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today);
                end.setDate(end.getDate() - 1);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default:
                return;
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-slate-100">
            <div className="flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quick Select</label>
                    <select
                        onChange={(e) => handlePresetChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    >
                        <option value="">Select date range...</option>
                        <option value="yesterday">เมื่อวาน</option>
                        <option value="last7days">7 วันล่าสุด</option>
                        <option value="last30days">30 วันล่าสุด</option>
                        <option value="thisMonth">เดือนนี้</option>
                        <option value="lastMonth">เดือนที่แล้ว</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date (Purchase Time)</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date (Purchase Time)</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    />
                </div>
                <button
                    onClick={onSearch}
                    className="bg-orange-600 text-white px-8 py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30 font-medium flex items-center gap-2 active:scale-95 transform duration-100"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Fetch Data from API
                </button>
            </div>
        </div>
    );
};

export default Filters;
