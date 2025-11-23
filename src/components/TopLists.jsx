import React, { useMemo } from 'react';
import { generateShortLink } from '../api/shopee';

const TopLists = ({ data, appId, secret, userId }) => {
    // CSV Export Function
    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) return;

        // Get headers from the first object
        const headers = Object.keys(data[0]);

        // Create CSV content
        const csvContent = [
            headers.join(','), // Header row
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Escape commas and quotes in values
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        // Create blob and download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleProductClick = async (item, customSubIds = []) => {
        if (!item.shopId || !item.itemId) return;

        try {
            // Construct origin URL
            // Format: https://shopee.co.th/product/{shopId}/{itemId}
            const originUrl = `https://shopee.co.th/product/${item.shopId}/${item.itemId}`;

            // Generate short link with custom subIds
            const shortLink = await generateShortLink(appId, secret, originUrl, customSubIds);

            // Open in new tab
            window.open(shortLink, '_blank');
        } catch (error) {
            console.error("Failed to generate link:", error);
            // Fallback to origin URL if API fails
            const originUrl = `https://shopee.co.th/product/${item.shopId}/${item.itemId}`;
            window.open(originUrl, '_blank');
        }
    };

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
                        shopId: item.shopId,
                        itemId: item.itemId,
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
                            shopId: item.shopId,
                            itemId: item.itemId,
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

    // Calculate SubID statistics
    const subIdStats = useMemo(() => {
        const stats = new Map();

        data.forEach(conversion => {
            const rawSubId = conversion.utmContent || 'No SubID';
            // Split by '-' and filter empty strings
            const subIds = rawSubId.split('-').filter(s => s.trim());

            // If no subids after split (e.g. empty string), default to 'No SubID'
            if (subIds.length === 0) subIds.push('No SubID');

            // Calculate totals for this conversion
            let conversionCommission = 0;
            let conversionOrders = 0;
            let conversionItems = 0;

            conversion.orders?.forEach(order => {
                conversionOrders += 1;
                order.items?.forEach(item => {
                    conversionCommission += parseFloat(item.itemTotalCommission) || 0;
                    conversionItems += parseInt(item.qty) || 0;
                });
            });

            // Attribute to each subId
            subIds.forEach(subId => {
                const trimmedSubId = subId.trim();
                if (!stats.has(trimmedSubId)) {
                    stats.set(trimmedSubId, {
                        subId: trimmedSubId,
                        commission: 0,
                        orders: 0,
                        items: 0
                    });
                }

                const entry = stats.get(trimmedSubId);
                entry.commission += conversionCommission;
                entry.orders += conversionOrders;
                entry.items += conversionItems;
            });
        });

        return Array.from(stats.values());
    }, [data]);

    const topSubIdByRevenue = useMemo(() => {
        return [...subIdStats]
            .sort((a, b) => b.commission - a.commission)
            .slice(0, 10);
    }, [subIdStats]);

    const topSubIdByOrders = useMemo(() => {
        return [...subIdStats]
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 10);
    }, [subIdStats]);

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 10 by Commission */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 p-5 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Top Products Revenue
                            </h3>
                            <p className="text-slate-400 mt-1 text-xs">สินค้าที่ได้ค่าคอมมิชชั่นสูงสุด 10 อันดับ</p>
                        </div>
                        <button
                            onClick={() => exportToCSV(
                                topByCommission.map(item => ({
                                    Rank: topByCommission.indexOf(item) + 1,
                                    'Item Name': item.itemName,
                                    'Shop Name': item.shopName,
                                    'Channel Type': item.channelType,
                                    'Price': item.price,
                                    'Quantity': item.qty,
                                    'Commission': Number(item.commission || 0).toFixed(2)
                                })),
                                'top_products_revenue'
                            )}
                            className="hidden md:flex px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors items-center gap-2 text-sm border border-emerald-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {topByCommission.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/40 transition-colors border-0 md:border md:border-white/5">
                            <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xs md:text-sm border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border-0 md:border md:border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleProductClick(item, ["toppro", "porto", "mng", "report"])}
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p
                                    className="font-medium text-slate-200 truncate text-xs md:text-sm cursor-pointer hover:text-emerald-400 transition-colors"
                                    title={item.itemName}
                                    onClick={() => handleProductClick(item, ["toppro", "porto", "mng", "report"])}
                                >
                                    {item.itemName}
                                </p>
                                <p className="text-xs text-slate-400 hidden md:block">{item.shopName}</p>
                                <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                                    <span className="text-[9px] md:text-[10px] bg-blue-500/20 text-blue-300 px-1 md:px-1.5 py-0.5 rounded border-0 md:border md:border-blue-500/20">
                                        {item.channelType}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] text-slate-400">
                                        {item.price} × {item.qty}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base md:text-lg font-bold text-emerald-400">{Number(item.commission || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Items Sold */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-5 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-orange-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                Top Items Sold
                            </h3>
                            <p className="text-slate-400 mt-1 text-xs">สินค้าที่ขายได้มากที่สุด</p>
                        </div>
                        <button
                            onClick={() => exportToCSV(
                                topByQuantity.map(item => ({
                                    Rank: topByQuantity.indexOf(item) + 1,
                                    'Item Name': item.itemName,
                                    'Shop Name': item.shopName,
                                    'Channel Type': item.channelType,
                                    'Quantity': item.qty,
                                    'Commission': Number(item.commission || 0).toFixed(2)
                                })),
                                'top_items_sold'
                            )}
                            className="hidden md:flex px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors items-center gap-2 text-sm border border-orange-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {topByQuantity.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/40 transition-colors border-0 md:border md:border-white/5">
                            <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-slate-800 rounded-full flex items-center justify-center text-orange-400 font-bold text-xs md:text-sm border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                                {index + 1}
                            </div>
                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border-0 md:border md:border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleProductClick(item, ["topitem", "porto", "mng", "report"])}
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p
                                    className="font-medium text-slate-200 truncate text-xs md:text-sm cursor-pointer hover:text-orange-400 transition-colors"
                                    title={item.itemName}
                                    onClick={() => handleProductClick(item, ["topitem", "porto", "mng", "report"])}
                                >
                                    {item.itemName}
                                </p>
                                <p className="text-xs text-slate-400 hidden md:block">{item.shopName}</p>
                                <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                                    <span className="text-[9px] md:text-[10px] bg-blue-500/20 text-blue-300 px-1 md:px-1.5 py-0.5 rounded border-0 md:border md:border-blue-500/20">
                                        {item.channelType}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] text-emerald-400 font-medium">
                                        {Number(item.commission || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-base md:text-lg font-bold text-orange-400">{item.qty}</p>
                                <p className="text-[9px] md:text-[10px] text-slate-400">ชิ้น</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top 10 Revenue by SubID */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-5 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                Top 10 Revenue by SubID
                            </h3>
                            <p className="text-slate-400 mt-1 text-xs">SubID ที่สร้างรายได้สูงสุด</p>
                        </div>
                        <button
                            onClick={() => exportToCSV(
                                topSubIdByRevenue.map(item => ({
                                    Rank: topSubIdByRevenue.indexOf(item) + 1,
                                    'SubID': item.subId,
                                    'Orders': item.orders,
                                    'Items': item.items,
                                    'Commission': Number(item.commission || 0).toFixed(2)
                                })),
                                'top_revenue_by_subid'
                            )}
                            className="hidden md:flex px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors items-center gap-2 text-sm border border-blue-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {topSubIdByRevenue.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/40 transition-colors border border-white/5">
                            <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-200 truncate text-sm" title={item.subId}>
                                    {item.subId}
                                </p>
                                <p className="text-xs text-slate-400">{item.orders} Orders • {item.items} Items</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-blue-400">{Number(item.commission || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top 10 Order by SubID */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-5 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                Top 10 Order by SubID
                            </h3>
                            <p className="text-slate-400 mt-1 text-xs">SubID ที่มีจำนวนออเดอร์สูงสุด</p>
                        </div>
                        <button
                            onClick={() => exportToCSV(
                                topSubIdByOrders.map(item => ({
                                    Rank: topSubIdByOrders.indexOf(item) + 1,
                                    'SubID': item.subId,
                                    'Orders': item.orders,
                                    'Commission': Number(item.commission || 0).toFixed(2)
                                })),
                                'top_orders_by_subid'
                            )}
                            className="hidden md:flex px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors items-center gap-2 text-sm border border-purple-500/20"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="p-4 space-y-3">
                    {topSubIdByOrders.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl hover:bg-slate-700/40 transition-colors border border-white/5">
                            <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-200 truncate text-sm" title={item.subId}>
                                    {item.subId}
                                </p>
                                <p className="text-xs text-slate-400">{Number(item.commission || 0).toFixed(2)} Commission</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-purple-400">{item.orders}</p>
                                <p className="text-[10px] text-slate-400">Orders</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopLists;
