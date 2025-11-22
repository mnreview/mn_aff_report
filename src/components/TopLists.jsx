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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Top 10 Commission
                    </h3>
                    <p className="text-green-100 mt-1">สินค้าที่ได้ค่าคอมมิชชั่นสูงสุด</p>
                </div>
                <div className="p-6 space-y-4">
                    {topByCommission.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate" title={item.itemName}>
                                    {item.itemName}
                                </p>
                                <p className="text-sm text-slate-500">{item.shopName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {item.channelType}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        ฿{item.price} × {item.qty}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-green-600">฿{Number(item.commission || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top 10 by Items Sold */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Top 10 Items Sold
                    </h3>
                    <p className="text-orange-100 mt-1">สินค้าที่ขายได้มากที่สุด</p>
                </div>
                <div className="p-6 space-y-4">
                    {topByQuantity.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 truncate" title={item.itemName}>
                                    {item.itemName}
                                </p>
                                <p className="text-sm text-slate-500">{item.shopName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {item.channelType}
                                    </span>
                                    <span className="text-xs text-green-600 font-medium">
                                        ฿{Number(item.commission || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-orange-600">{item.qty}</p>
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
