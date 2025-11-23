import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DetailedReportFilters from './DetailedReportFilters';
import { generateShortLink } from '../api/shopee';
import { logLinkGeneration } from '../utils/rateLimit';

const DetailedReport = ({ data, appId, secret }) => {
    const [filters, setFilters] = useState({
        subId: '',
        clickDateFrom: '',
        clickDateTo: '',
        channelType: ''
    });

    // Helper to flatten data for the table
    const flatData = useMemo(() => {
        return data.flatMap(conversion => {
            if (!conversion.orders || conversion.orders.length === 0) {
                return [{ ...conversion, order: null, item: null }];
            }
            return conversion.orders.flatMap(order => {
                if (!order.items || order.items.length === 0) {
                    return [{ ...conversion, order, item: null }];
                }
                return order.items.map(item => ({
                    ...conversion,
                    order,
                    item
                }));
            });
        });
    }, [data]);

    // Apply filters
    const filteredData = useMemo(() => {
        return flatData.filter(row => {
            // Filter by Sub ID (UTM Content)
            if (filters.subId && !row.utmContent?.toLowerCase().includes(filters.subId.toLowerCase())) {
                return false;
            }

            // Filter by Click Date From
            if (filters.clickDateFrom && row.clickTime) {
                const clickDate = new Date(row.clickTime * 1000);
                const filterDate = new Date(filters.clickDateFrom);
                if (clickDate < filterDate) return false;
            }

            // Filter by Click Date To
            if (filters.clickDateTo && row.clickTime) {
                const clickDate = new Date(row.clickTime * 1000);
                const filterDate = new Date(filters.clickDateTo);
                filterDate.setHours(23, 59, 59, 999);
                if (clickDate > filterDate) return false;
            }

            // Filter by Channel Type
            if (filters.channelType && row.item?.channelType !== filters.channelType) {
                return false;
            }

            return true;
        });
    }, [flatData, filters]);

    const handleResetFilters = () => {
        setFilters({
            subId: '',
            clickDateFrom: '',
            clickDateTo: '',
            channelType: ''
        });
    };

    const handleProductClick = async (item) => {
        if (!item?.shopId || !item?.itemId) return;

        try {
            // Construct origin URL
            const originUrl = `https://shopee.co.th/product/${item.shopId}/${item.itemId}`;

            // Log link generation to server
            await logLinkGeneration(appId);

            // Generate short link with SubID
            const shortLink = await generateShortLink(appId, secret, originUrl, ["detail", "porto", "mng", "report"]);

            // Open in new tab
            window.open(shortLink, '_blank');
        } catch (error) {
            console.error("Failed to generate link:", error);

            // Check if it's a rate limit error
            if (error.response?.status === 429 ||
                error.response?.data?.code === 10030 ||
                error.message?.toLowerCase().includes('rate limit')) {
                alert('⚠️ Rate Limit Exceeded!\n\nYou have hit Shopee\'s API limit of 2000 requests per hour.\nPlease wait for the counter to reset before generating more links.\n\nOpening product URL without affiliate tracking...');
            }

            // Fallback to origin URL
            const originUrl = `https://shopee.co.th/product/${item.shopId}/${item.itemId}`;
            window.open(originUrl, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-[95%] mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Detailed Conversion Report</h1>
                        <p className="text-slate-500 mt-2">View complete data for every conversion ({filteredData.length} records)</p>
                    </div>
                    <Link to="/" className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm">
                        ← Back to Dashboard
                    </Link>
                </div>

                <DetailedReportFilters
                    filters={filters}
                    setFilters={setFilters}
                    onReset={handleResetFilters}
                    data={data}
                />

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Purchase Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Click Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Conversion ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Shop Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Total Comm.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Seller Comm.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Shopee Comm.</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Buyer Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Device</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Sub ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Channel</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredData.map((row, index) => (
                                    <tr key={`${row.conversionId}-${index}`} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(row.purchaseTime * 1000).toLocaleString('en-GB')}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                                            {row.clickTime ? new Date(row.clickTime * 1000).toLocaleString('en-GB') : '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.conversionId}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.conversionStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                row.conversionStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {row.conversionStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900 font-medium">{row.order?.orderId || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.shopName || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600 min-w-[200px]">
                                            <div className="flex items-center">
                                                {row.item?.imageUrl && (
                                                    <img
                                                        src={row.item.imageUrl}
                                                        alt=""
                                                        className="h-8 w-8 rounded mr-2 object-cover border border-slate-100 cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => handleProductClick(row.item)}
                                                    />
                                                )}
                                                <span
                                                    className="truncate max-w-[200px] cursor-pointer hover:text-blue-600 transition-colors"
                                                    title={row.item?.itemName}
                                                    onClick={() => handleProductClick(row.item)}
                                                >
                                                    {row.item?.itemName || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.itemPrice || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.qty || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">{row.item?.itemTotalCommission || row.totalCommission}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.itemSellerCommission || row.sellerCommission}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.itemShopeeCommissionCapped || row.shopeeCommissionCapped}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.buyerType}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.device}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.utmContent || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.channelType || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{row.item?.globalCategoryLv1Name || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredData.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            {flatData.length === 0 ? 'No data available. Please fetch data from the dashboard first.' : 'No records match your filters.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailedReport;
