import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Settings = () => {
    const [appId, setAppId] = useState('');
    const [secret, setSecret] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                setEmail(user.email);

                const { data, error } = await supabase
                    .from('user_api_configs')
                    .select('app_id, app_secret')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                    console.error('Error fetching config:', error);
                }

                if (data) {
                    setAppId(data.app_id || '');
                    setSecret(data.app_secret || '');
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setFetching(false);
            }
        };

        fetchConfig();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { error } = await supabase
                .from('user_api_configs')
                .upsert({
                    user_id: user.id,
                    app_id: appId,
                    app_secret: secret
                }, { onConflict: 'user_id' });

            if (error) throw error;

            setSuccess('Configuration saved successfully!');
        } catch (error) {
            console.error('Error saving config:', error);
            setError(error.message || 'Failed to save configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-16 h-16 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-12">
            {/* Navbar */}
            <div className="glass-panel sticky top-0 z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">
                                    Shopee <span className="text-gradient-gold">Affiliate</span>
                                </h1>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            Dashboard
                        </Link>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="glass-card p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Settings</h2>
                            <p className="text-slate-400">Manage your application preferences and API keys</p>
                        </div>
                    </div>

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="text"
                                value={email}
                                disabled
                                className="w-full bg-slate-950/30 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Shopee App ID</label>
                            <input
                                type="text"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your App ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Shopee Secret Key</label>
                            <input
                                type="text"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                placeholder="Enter your Secret Key"
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
