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
        <div className="glass-card p-8 rounded-2xl mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                        Commission Trend
                    </h3>
                    <p className="text-slate-400 text-sm ml-3">Daily performance overview</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                    <span className="text-xs text-slate-300 font-medium">Commission</span>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                color: '#f1f5f9'
                            }}
                            itemStyle={{ color: '#fb923c', fontWeight: '600' }}
                            labelStyle={{ color: '#cbd5e1' }}
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
