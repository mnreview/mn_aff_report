import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const SummaryCards = ({ data }) => {
    const totalCommission = data.reduce((sum, item) => sum + parseFloat(item.totalCommission || 0), 0);
    const totalOrders = data.length;
    const totalItems = data.reduce((sum, item) => sum + (item.orders?.[0]?.items?.length || 0), 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-green-100 font-medium mb-1">Total Commission</p>
                        <h3 className="text-3xl font-bold">฿{totalCommission.toFixed(2)}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <DollarSign className="text-white" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-blue-100 font-medium mb-1">Total Orders</p>
                        <h3 className="text-3xl font-bold">{totalOrders}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <ShoppingBag className="text-white" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-purple-100 font-medium mb-1">Items Sold</p>
                        <h3 className="text-3xl font-bold">{totalItems}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
