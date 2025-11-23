import React, { useMemo } from 'react';

const DetailedReportFilters = ({ filters, setFilters, onReset, data = [] }) => {
    const [tempFilters, setTempFilters] = React.useState(filters);

    const handleChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        setFilters(tempFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            subId: '',
            clickDateFrom: '',
            clickDateTo: '',
            channelType: ''
        };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        onReset();
    };

    // Extract unique channel types from data
    const channelTypes = useMemo(() => {
        const types = new Set();
        data.forEach(conversion => {
            conversion.orders?.forEach(order => {
                order.items?.forEach(item => {
                    if (item.channelType) {
                        types.add(item.channelType);
                    }
                });
            });
        });
        return Array.from(types).sort();
    }, [data]);

    return (
        <div className="glass-card p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Advanced Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Sub ID (UTM Content)</label>
                    <input
                        type="text"
                        value={tempFilters.subId}
                        onChange={(e) => handleChange('subId', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder:text-slate-600"
                        placeholder="Enter Sub ID (partial match)"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Click Date From</label>
                    <input
                        type="date"
                        value={tempFilters.clickDateFrom}
                        onChange={(e) => handleChange('clickDateFrom', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all [color-scheme:dark]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Click Date To</label>
                    <input
                        type="date"
                        value={tempFilters.clickDateTo}
                        onChange={(e) => handleChange('clickDateTo', e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all [color-scheme:dark]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Channel Type</label>
                    <div className="relative">
                        <select
                            value={tempFilters.channelType}
                            onChange={(e) => handleChange('channelType', e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-slate-900">All Channels</option>
                            {channelTypes.map(type => (
                                <option key={type} value={type} className="bg-slate-900">{type}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-white/5">
                <button
                    onClick={handleApply}
                    className="bg-orange-600 text-white px-8 py-2.5 rounded-xl hover:bg-orange-500 transition-all font-medium shadow-lg shadow-orange-500/30 border border-white/10"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleReset}
                    className="bg-slate-800 text-slate-300 px-6 py-2.5 rounded-xl hover:bg-slate-700 hover:text-white transition-all font-medium border border-white/5"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default DetailedReportFilters;
