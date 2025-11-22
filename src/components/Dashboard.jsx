import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Filters from './Filters';
import SummaryCards from './SummaryCards';
import Charts from './Charts';
import TopLists from './TopLists';
import DetailedReportFilters from './DetailedReportFilters';
import { fetchConversionReport } from '../api/shopee';

const Dashboard = ({ data, setData }) => {
    const [appId, setAppId] = useState('');
    const [secret, setSecret] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        subId: '',
        clickDateFrom: '',
        clickDateTo: '',
        channelType: ''
    });

    useEffect(() => {
        const storedAppId = localStorage.getItem('shopee_app_id');
        const storedSecret = localStorage.getItem('shopee_secret');
        if (storedAppId) setAppId(storedAppId);
        if (storedSecret) setSecret(storedSecret);

        if (!startDate && !endDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            setStartDate(yesterdayStr);
            setEndDate(yesterdayStr);
        }
    }, []);

    const handleSearch = async () => {
        if (!appId || !secret) {
            setError('Please enter App ID and Secret');
            return;
        }

        localStorage.setItem('shopee_app_id', appId);
        localStorage.setItem('shopee_secret', secret);
        setLoading(true);
        setError(null);

        try {
            let startTimestamp, endTimestamp;

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                startTimestamp = Math.floor(start.getTime() / 1000);
            } else {
                startTimestamp = Math.floor(Date.now() / 1000) - 86400 * 7;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                endTimestamp = Math.floor(end.getTime() / 1000);
            } else {
                endTimestamp = Math.floor(Date.now() / 1000);
            }

            console.log('Fetching data:', {
                startDate, endDate,
                startTimestamp, endTimestamp,
                days: Math.ceil((endTimestamp - startTimestamp) / 86400)
            });

            let allData = [];
            let scrollId = '';
            let hasNextPage = true;
            let pageCount = 0;

            while (hasNextPage && pageCount < 100) {
                pageCount++;
                const result = await fetchConversionReport(appId, secret, {
                    purchaseTimeStart: startTimestamp,
                    purchaseTimeEnd: endTimestamp,
                    limit: 100,
                    scrollId: scrollId
                });

                if (result.data && result.data.conversionReport) {
                    const nodes = result.data.conversionReport.nodes || [];
                    const pageInfo = result.data.conversionReport.pageInfo;

                    allData = [...allData, ...nodes];
                    console.log(`Page ${pageCount}: ${nodes.length} records. Total: ${allData.length}`);

                    if (pageInfo && pageInfo.hasNextPage && pageInfo.scrollId) {
                        scrollId = pageInfo.scrollId;
                    } else {
                        hasNextPage = false;
                    }
                } else if (result.errors) {
                    setError(result.errors[0].message);
                    break;
                } else {
                    hasNextPage = false;
                }
            }

            setData(allData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(conversion => {
            if (filters.subId && !conversion.utmContent?.toLowerCase().includes(filters.subId.toLowerCase())) {
                return false;
            }
            if (filters.clickDateFrom && conversion.clickTime) {
                const clickDate = new Date(conversion.clickTime * 1000);
                const filterDate = new Date(filters.clickDateFrom);
                if (clickDate < filterDate) return false;
            }
            if (filters.clickDateTo && conversion.clickTime) {
                const clickDate = new Date(conversion.clickTime * 1000);
                const filterDate = new Date(filters.clickDateTo);
                filterDate.setHours(23, 59, 59, 999);
                if (clickDate > filterDate) return false;
            }
            if (filters.channelType) {
                const hasMatchingChannel = conversion.orders?.some(order =>
                    order.items?.some(item => item.channelType === filters.channelType)
                );
                if (!hasMatchingChannel) return false;
            }
            return true;
        });
    }, [data, filters]);

    const handleResetFilters = () => {
        setFilters({
            subId: '',
            clickDateFrom: '',
            clickDateTo: '',
            channelType: ''
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white pb-32 pt-12 px-8 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Shopee Affiliate Dashboard</h1>
                        <p className="text-orange-100 mt-2 text-lg">Track your performance and maximize your earnings</p>
                    </div>
                    <Link to="/report" className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-xl hover:bg-white/30 transition-all font-medium shadow-lg">
                        View Detailed Report →
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 -mt-24">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-8 border border-white/20">
                    <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                        API Credentials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-600 mb-2">App ID</label>
                            <input
                                type="text"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                                placeholder="Enter your App ID"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-sm font-medium text-slate-600 mb-2">Secret</label>
                            <input
                                type="password"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                                placeholder="Enter your Secret"
                            />
                        </div>
                    </div>
                </div>

                <Filters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    onSearch={handleSearch}
                />

                {data.length > 0 && (
                    <>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="mb-6 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {showFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
                            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showFilters && (
                            <div className="animate-fade-in">
                                <DetailedReportFilters
                                    filters={filters}
                                    setFilters={setFilters}
                                    onReset={handleResetFilters}
                                    data={data}
                                />
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-8 shadow-sm flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="relative inline-flex">
                            <div className="w-16 h-16 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                            <div className="w-16 h-16 bg-orange-600 rounded-full absolute top-0 left-0 flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-500 font-medium text-lg">กำลังดึงข้อมูล...</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        {data.length > 0 && filteredData.length !== data.length && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg shadow-sm">
                                แสดง {filteredData.length} จาก {data.length} รายการ
                            </div>
                        )}
                        <SummaryCards data={filteredData} />
                        <Charts data={filteredData} />
                        <TopLists data={filteredData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
