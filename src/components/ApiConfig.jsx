import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ApiConfig = () => {
    const [appId, setAppId] = useState('');
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
            }
        };
        checkUser();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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

            navigate('/');
        } catch (error) {
            console.error('Error saving config:', error);
            setError(error.message || 'Failed to save configuration. Please ensure the database table exists.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]"></div>
            </div>

            <div className="glass-card p-8 rounded-2xl w-full max-w-lg z-10 relative border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        API Configuration
                    </h1>
                    <p className="text-slate-400">
                        Please enter your Shopee Affiliate API credentials to continue.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">App ID</label>
                        <input
                            type="text"
                            value={appId}
                            onChange={(e) => setAppId(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your App ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Secret Key</label>
                        <input
                            type="text"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                            placeholder="Enter your Secret Key"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-medium py-3 rounded-xl transition-all border border-transparent hover:border-white/10"
                        >
                            Skip for now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApiConfig;
