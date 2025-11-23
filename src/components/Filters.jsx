import React from 'react';

const Filters = ({ startDate, setStartDate, endDate, setEndDate, onSearch, showFilters, setShowFilters, hasData }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Date Range</h2>
                        {!isExpanded && (
                            <p className="text-sm text-indigo-300 font-medium">
                                {formatDate(startDate)} - {formatDate(endDate)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasData && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${showFilters ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                    >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-end transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">Quick Select</label>
                    <div className="relative">
                        <select
                            onChange={(e) => handlePresetChange(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">Select date range...</option>
                            <option value="yesterday" className="bg-slate-900">เมื่อวาน</option>
                            <option value="last7days" className="bg-slate-900">7 วันล่าสุด</option>
                            <option value="last30days" className="bg-slate-900">30 วันล่าสุด</option>
                            <option value="thisMonth" className="bg-slate-900">เดือนนี้</option>
                            <option value="lastMonth" className="bg-slate-900">เดือนที่แล้ว</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-6">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="md:col-span-3">
                    <button
                        onClick={onSearch}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30 font-medium flex items-center justify-center gap-2 active:scale-95 transform duration-100 border border-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Fetch Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;
