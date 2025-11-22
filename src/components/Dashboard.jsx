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
        <div className="min-h-screen bg-transparent pb-12">
            {/* Navbar / Header */}
            <div className="glass-panel sticky top-0 z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Shopee <span className="text-gradient-gold">Affiliate</span>
                            </h1>
                            <p className="text-slate-400 text-xs font-medium">Dashboard & Analytics</p>
                        </div>
                    </div>
                    <Link to="/report" className="group relative px-6 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-all duration-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-2 text-sm font-medium text-slate-200 group-hover:text-white">
                            View Detailed Report
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* API Credentials Section */}
                <div className="glass-card p-6 rounded-2xl mb-8">
                    <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16l-1.536 4.442-1.536-4.442L4.257 9.257A6 6 0 0115 7z" />
                            </svg>
                        </div>
                        API Configuration
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">App ID</label>
                            <input
                                type="text"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your App ID"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Secret Key</label>
                            <input
                                type="password"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
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
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="glass-card px-5 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                                <svg className={`w-3 h-3 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {showFilters && (
                            <div className="animate-fade-in mb-8">
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
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center backdrop-blur-sm">
                        <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-32">
                        <div className="relative inline-flex">
                            <div className="w-16 h-16 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full absolute top-0 left-0 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="mt-6 text-slate-400 font-medium text-lg animate-pulse">Syncing data...</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        {data.length > 0 && filteredData.length !== data.length && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 p-4 rounded-xl flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                    Showing {filteredData.length} of {data.length} records
                                </span>
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
