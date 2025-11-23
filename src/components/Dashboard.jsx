import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Filters from './Filters';
import SummaryCards from './SummaryCards';
import Charts from './Charts';
import TopLists from './TopLists';
import DetailedReportFilters from './DetailedReportFilters';
import { fetchConversionReport } from '../api/shopee';
import { supabase } from '../supabaseClient';
import { getCachedData, setCachedData, clearCache, clearAllCaches, getCacheStats } from '../utils/cache';

const Dashboard = ({ data, setData }) => {
    const [appId, setAppId] = useState('');
    const [secret, setSecret] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [usingCache, setUsingCache] = useState(false);
    const navigate = useNavigate();
    const hasLoadedInitialData = useRef(false);

    const [filters, setFilters] = useState({
        subId: '',
        clickDateFrom: '',
        clickDateTo: '',
        channelType: ''
    });

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: config, error } = await supabase
                    .from('user_api_configs')
                    .select('app_id, app_secret')
                    .eq('user_id', user.id)
                    .single();

                if (config) {
                    setAppId(config.app_id);
                    setSecret(config.app_secret);
                }

                // Set default dates (Last 7 days)
                if (!startDate && !endDate) {
                    const today = new Date();
                    const start = new Date(today);
                    start.setDate(start.getDate() - 7);
                    const end = new Date(today);
                    end.setDate(end.getDate() - 1);

                    setStartDate(start.toISOString().split('T')[0]);
                    setEndDate(end.toISOString().split('T')[0]);
                }
            } catch (err) {
                console.error('Error initializing dashboard:', err);
            }
        };

        initDashboard();
    }, [navigate]);

    // Auto-load data on initial mount when all required values are ready
    useEffect(() => {
        if (appId && secret && startDate && endDate && !hasLoadedInitialData.current) {
            hasLoadedInitialData.current = true;
            handleSearch();
        }
    }, [appId, secret, startDate, endDate]);

    const handleSearch = async (overrideStart, overrideEnd, forceRefresh = false) => {
        if (!appId || !secret) {
            setError('API Configuration missing. Please check your settings.');
            return;
        }

        setLoading(true);
        setError(null);
        setUsingCache(false);

        try {
            let startTimestamp, endTimestamp;

            // Use overrides if provided, otherwise fall back to state
            const currentStartDate = overrideStart !== undefined ? overrideStart : startDate;
            const currentEndDate = overrideEnd !== undefined ? overrideEnd : endDate;

            if (currentStartDate) {
                const start = new Date(currentStartDate);
                start.setHours(0, 0, 0, 0);
                startTimestamp = Math.floor(start.getTime() / 1000);
            } else {
                startTimestamp = Math.floor(Date.now() / 1000) - 86400 * 7;
            }

            if (currentEndDate) {
                const end = new Date(currentEndDate);
                end.setHours(23, 59, 59, 999);
                endTimestamp = Math.floor(end.getTime() / 1000);
            } else {
                endTimestamp = Math.floor(Date.now() / 1000);
            }

            console.log('Fetching data:', {
                startDate: currentStartDate, endDate: currentEndDate,
                startTimestamp, endTimestamp,
                days: Math.ceil((endTimestamp - startTimestamp) / 86400),
                forceRefresh
            });

            // Check cache first (unless force refresh)
            if (!forceRefresh) {
                const cachedData = getCachedData(appId, startTimestamp, endTimestamp);
                if (cachedData) {
                    setData(cachedData);
                    setUsingCache(true);
                    setLoading(false);
                    return;
                }
            }

            // Cache miss or force refresh - fetch from API
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

            // Save to cache
            setCachedData(appId, startTimestamp, endTimestamp, allData);
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

    const handleClearCache = () => {
        const count = clearAllCaches();
        setUsingCache(false);
        alert(`Cleared ${count} cache(s) successfully!`);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-transparent pb-12">
            {/* Navbar / Header */}
            <div className="glass-panel sticky top-0 z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/20">
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
                    <div className="flex items-center gap-4">
                        <Link to="/report" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            Detailed Report
                        </Link>
                        <Link to="/settings" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            Settings
                        </Link>
                        <button
                            onClick={handleClearCache}
                            className="text-slate-400 hover:text-orange-400 text-sm font-medium transition-colors flex items-center gap-1"
                            title="Clear all cached data"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Cache
                        </button>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <Filters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    onSearch={handleSearch}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    hasData={data.length > 0}
                />

                {data.length > 0 && (
                    <>
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
                            <div className="w-16 h-16 bg-orange-500 rounded-full animate-ping opacity-20"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full absolute top-0 left-0 flex items-center justify-center shadow-xl shadow-orange-500/30">
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
                            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-300 p-4 rounded-xl flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
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
