import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const SummaryCards = ({ data }) => {
    const totalCommission = data.reduce((sum, item) => sum + parseFloat(item.totalCommission || 0), 0);
    const totalOrders = data.length;
    const totalItems = data.reduce((sum, item) => sum + (item.orders?.[0]?.items?.length || 0), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 font-medium mb-1 text-sm uppercase tracking-wider">Total Commission</p>
                        <h3 className="text-3xl font-bold text-white flex items-baseline gap-1">
                            <span className="text-emerald-400">฿</span>
                            {totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="bg-emerald-500/20 p-3 rounded-xl backdrop-blur-sm border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="text-emerald-400" size={24} />
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 font-medium mb-1 text-sm uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-bold text-white">
                            {totalOrders.toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBag className="text-blue-400" size={24} />
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 font-medium mb-1 text-sm uppercase tracking-wider">Items Sold</p>
                        <h3 className="text-3xl font-bold text-white">
                            {totalItems.toLocaleString()}
                        </h3>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-xl backdrop-blur-sm border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="text-purple-400" size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
