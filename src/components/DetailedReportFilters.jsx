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
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sub ID (UTM Content)</label>
                    <input
                        type="text"
                        value={tempFilters.subId}
                        onChange={(e) => handleChange('subId', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                        placeholder="Enter Sub ID (partial match)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Click Date From</label>
                    <input
                        type="date"
                        value={tempFilters.clickDateFrom}
                        onChange={(e) => handleChange('clickDateFrom', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Click Date To</label>
                    <input
                        type="date"
                        value={tempFilters.clickDateTo}
                        onChange={(e) => handleChange('clickDateTo', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Channel Type</label>
                    <select
                        value={tempFilters.channelType}
                        onChange={(e) => handleChange('channelType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm text-slate-600"
                    >
                        <option value="">All Channels</option>
                        {channelTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleApply}
                    className="bg-orange-600 text-white px-8 py-2.5 rounded-xl hover:bg-orange-700 transition-all font-medium shadow-lg hover:shadow-orange-500/30"
                >
                    Apply Filters
                </button>
                <button
                    onClick={handleReset}
                    className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-all font-medium"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default DetailedReportFilters;
