import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Charts = ({ data }) => {
    // Process data for chart
    const chartData = data.reduce((acc, item) => {
        const date = new Date(item.purchaseTime * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const existing = acc.find(d => d.date === date);
        const commission = parseFloat(item.totalCommission || 0);

        if (existing) {
            existing.commission += commission;
        } else {
            acc.push({ date, commission });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Commission Trend</h3>
                    <p className="text-slate-500 text-sm">Daily performance overview</p>
                </div>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs text-slate-500">Commission</span>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `฿${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#f97316', fontWeight: '600' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="commission"
                            stroke="#f97316"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCommission)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;
