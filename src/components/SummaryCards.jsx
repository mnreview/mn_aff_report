import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const SummaryCards = ({ data }) => {
    const totalCommission = data.reduce((sum, item) => sum + parseFloat(item.totalCommission || 0), 0);
    const totalOrders = data.length;
    const totalItems = data.reduce((sum, item) => sum + (item.orders?.[0]?.items?.length || 0), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 md:p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <DollarSign className="text-emerald-400" size={20} />
                        </div>
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Total Commission</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
                        {totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                </div>
            </div>

            <div className="glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 md:p-3 bg-blue-500/20 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <ShoppingBag className="text-blue-400" size={20} />
                        </div>
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {totalOrders.toLocaleString()}
                    </h3>
                </div>
            </div>

            <div className="glass-card p-4 md:p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="text-purple-400" size={20} />
                        </div>
                    </div>
                    <p className="text-slate-300 text-xs md:text-sm font-medium mb-1 uppercase tracking-wider">Items Sold</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {totalItems.toLocaleString()}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
