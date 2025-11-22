import React from 'react';

const DataTable = ({ data }) => {
    return (
        <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    Conversion Details
                </h3>
                <p className="text-slate-400 text-sm mt-1">List of all conversions in the selected period</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Commission</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {data.map((item, index) => {
                            const order = item.orders?.[0];
                            const product = order?.items?.[0];

                            return (
                                <tr key={item.conversionId || index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {new Date(item.purchaseTime * 1000).toLocaleString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-300">
                                        {order?.orderId || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300 max-w-xs">
                                        <div className="flex items-center">
                                            {product?.imageUrl ? (
                                                <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg mr-3 object-cover shadow-sm border border-white/10" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg mr-3 bg-slate-800 flex items-center justify-center border border-white/10">
                                                    <span className="text-xs text-slate-500">No Img</span>
                                                </div>
                                            )}
                                            <span className="truncate font-medium text-slate-200" title={product?.itemName}>{product?.itemName || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {product?.itemPrice || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                            ฿{item.totalCommission}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4 border border-white/5">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white">No data available</h3>
                    <p className="mt-1 text-slate-400">Try adjusting your filters or date range.</p>
                </div>
            )}
        </div>
    );
};

export default DataTable;
