import React from 'react';
import DateRangePicker from './DateRangePicker';

const Filters = ({ startDate, setStartDate, endDate, setEndDate, onSearch, showFilters, setShowFilters, hasData }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Function to detect which preset matches the current date range
    const getMatchingPreset = () => {
        if (!startDate || !endDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const presets = [
            {
                key: 'yesterday',
                label: 'เมื่อวาน',
                start: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                key: 'last7days',
                label: '7 วันล่าสุด',
                start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                key: 'last30days',
                label: '30 วันล่าสุด',
                start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                key: 'thisMonth',
                label: 'เดือนนี้',
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                key: 'lastMonth',
                label: 'เดือนที่แล้ว',
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0)
            }
        ];

        for (const preset of presets) {
            const presetStartStr = preset.start.toISOString().split('T')[0];
            const presetEndStr = preset.end.toISOString().split('T')[0];

            if (startDate === presetStartStr && endDate === presetEndStr) {
                return preset;
            }
        }

        return null;
    };

    const matchingPreset = getMatchingPreset();
    const selectedPresetKey = matchingPreset ? matchingPreset.key : '';

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

        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        setStartDate(startStr);
        setEndDate(endStr);
        onSearch(startStr, endStr);
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
        <div className={`glass-card relative z-30 rounded-2xl mb-4 md:mb-8 transition-all duration-300 ${isExpanded ? 'p-6' : 'p-4'}`}>
            <div className={`flex justify-between items-center ${isExpanded ? 'mb-4' : 'mb-0'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Date Range</h2>
                        {!isExpanded && (
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm text-orange-300 font-medium">
                                    {matchingPreset ? matchingPreset.label : 'วันที่กำหนดเอง'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {formatDate(startDate)} - {formatDate(endDate)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasData && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${showFilters ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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

            <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-end transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">Quick Select</label>
                    <div className="relative">
                        <select
                            value={selectedPresetKey}
                            onChange={(e) => handlePresetChange(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none cursor-pointer"
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

                <div className="md:col-span-8">
                    <label className="block text-xs font-medium text-slate-300 mb-2 uppercase tracking-wider">Custom Range</label>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                            if (start && end) {
                                onSearch(start, end);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Filters;
