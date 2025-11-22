import React, { useMemo } from 'react';

const TopLists = ({ data }) => {
    // Calculate top 10 by commission
    const topByCommission = useMemo(() => {
        const itemsWithCommission = [];

        data.forEach(conversion => {
            conversion.orders?.forEach(order => {
                order.items?.forEach(item => {
                    itemsWithCommission.push({
                        itemName: item.itemName,
                        imageUrl: item.imageUrl,
                        shopName: item.shopName,
                        commission: item.itemTotalCommission || 0,
                        qty: item.qty || 0,
                        price: item.itemPrice || 0,
                        channelType: item.channelType
                    });
                });
            });
        });

        return itemsWithCommission
            .sort((a, b) => b.commission - a.commission)
            .slice(0, 10);
    }, [data]);

    // Calculate top 10 by quantity sold
    const topByQuantity = useMemo(() => {
        const itemsMap = new Map();

        data.forEach(conversion => {
            conversion.orders?.forEach(order => {
                order.items?.forEach(item => {
                    const key = item.itemName;
                    if (itemsMap.has(key)) {
                        const existing = itemsMap.get(key);
                        existing.qty += item.qty || 0;
                        existing.commission += item.itemTotalCommission || 0;
                    } else {
                        itemsMap.set(key, {
                            itemName: item.itemName,
                            imageUrl: item.imageUrl,
                            shopName: item.shopName,
                            commission: item.itemTotalCommission || 0,
                            qty: item.qty || 0,
                            price: item.itemPrice || 0,
                            channelType: item.channelType
                        });
                    }
                });
            });
        });

        return Array.from(itemsMap.values())
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 10);
    }, [data]);

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 10 by Commission */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        Top 10 Commission
                    </h3>
                    <p className="text-slate-400 mt-1 text-sm">สินค้าที่ได้ค่าคอมมิชชั่นสูงสุด</p>
                </div>
                <div className="p-6 space-y-4">
                    {topByCommission.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-700/30 transition-colors border border-white/5">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-200 truncate" title={item.itemName}>
                                    {item.itemName}
                                </p>
                                <p className="text-sm text-slate-500">{item.shopName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                                        {item.channelType}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        ฿{item.price} × {item.qty}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-emerald-400">฿{Number(item.commission || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top 10 by Items Sold */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        Top 10 Items Sold
                    </h3>
                    <p className="text-slate-400 mt-1 text-sm">สินค้าที่ขายได้มากที่สุด</p>
                </div>
                <div className="p-6 space-y-4">
                    {topByQuantity.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-700/30 transition-colors border border-white/5">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-orange-400 font-bold text-lg border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-200 truncate" title={item.itemName}>
                                    {item.itemName}
                                </p>
                                <p className="text-sm text-slate-500">{item.shopName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                                        {item.channelType}
                                    </span>
                                    <span className="text-xs text-emerald-400 font-medium">
                                        ฿{Number(item.commission || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-orange-400">{item.qty}</p>
                                <p className="text-xs text-slate-500">ชิ้น</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopLists;
