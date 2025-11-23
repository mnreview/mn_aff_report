import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const Charts = ({ data }) => {
    // State for toggling visibility of each metric
    const [visibleMetrics, setVisibleMetrics] = useState({
        commission: true,
        orders: true,
        orderValue: true
    });

    // Toggle metric visibility
    const toggleMetric = (metric) => {
        setVisibleMetrics(prev => ({
            ...prev,
            [metric]: !prev[metric]
        }));
    };

    // Process data for chart - include commission, order count, and order value
    const chartData = data.reduce((acc, item) => {
        const date = new Date(item.purchaseTime * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const existing = acc.find(d => d.date === date);
        const commission = parseFloat(item.totalCommission || 0);

        // Calculate order value from items
        let orderValue = 0;
        if (item.orders && item.orders.length > 0) {
            item.orders.forEach(order => {
                if (order.items && order.items.length > 0) {
                    order.items.forEach(orderItem => {
                        orderValue += parseFloat(orderItem.actualAmount || 0);
                    });
                }
            });
        }

        if (existing) {
            existing.commission += commission;
            existing.orders += 1;
            existing.orderValue += orderValue;
        } else {
            acc.push({ date, commission, orders: 1, orderValue });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-2xl">
                    <p className="text-slate-300 font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                            {entry.name}: {entry.name === 'Orders' ? entry.value.toLocaleString() : entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-4 md:p-8 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-5 md:h-6 bg-orange-500 rounded-full"></span>
                        Performance Trend
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm ml-3">Daily performance overview</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => toggleMetric('commission')}
                        className={`flex items-center gap-1.5 md:gap-2 bg-slate-800/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer hover:bg-slate-700/50 whitespace-nowrap ${!visibleMetrics.commission ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                        <span className="text-[10px] md:text-xs text-slate-300 font-medium">Commission</span>
                    </button>
                    <button
                        onClick={() => toggleMetric('orders')}
                        className={`flex items-center gap-1.5 md:gap-2 bg-slate-800/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer hover:bg-slate-700/50 whitespace-nowrap ${!visibleMetrics.orders ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                        <span className="text-[10px] md:text-xs text-slate-300 font-medium">Orders</span>
                    </button>
                    <button
                        onClick={() => toggleMetric('orderValue')}
                        className={`flex items-center gap-1.5 md:gap-2 bg-slate-800/50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer hover:bg-slate-700/50 whitespace-nowrap ${!visibleMetrics.orderValue ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                        <span className="text-[10px] md:text-xs text-slate-300 font-medium">Order Value</span>
                    </button>
                </div>
            </div>

            <div className="h-64 md:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
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
                        {/* Y-Axis for Commission (Left) */}
                        <YAxis
                            yAxisId="commission"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                            tickFormatter={(value) => `${value}`}
                        />
                        {/* Y-Axis for Orders (Right) */}
                        <YAxis
                            yAxisId="orders"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                        />
                        {/* Y-Axis for Order Value (Right - hidden) */}
                        <YAxis
                            yAxisId="orderValue"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                            width={0}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {/* Order Value as Bars (in background) */}
                        {visibleMetrics.orderValue && (
                            <Bar
                                yAxisId="orderValue"
                                dataKey="orderValue"
                                name="Order Value"
                                fill="#10b981"
                                fillOpacity={0.2}
                                radius={[8, 8, 0, 0]}
                            />
                        )}
                        {/* Commission as Area */}
                        {visibleMetrics.commission && (
                            <Area
                                yAxisId="commission"
                                type="monotone"
                                dataKey="commission"
                                name="Commission"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCommission)"
                            />
                        )}
                        {/* Orders as Line */}
                        {visibleMetrics.orders && (
                            <Line
                                yAxisId="orders"
                                type="monotone"
                                dataKey="orders"
                                name="Orders"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 2 }}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;
