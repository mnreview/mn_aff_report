import React from 'react';

const RateLimitIndicator = ({ status, onReset }) => {
    if (!status) return null;

    const { used, remaining, total, percentage, approaching, exceeded, timeUntilReset } = status;

    // Determine color scheme based on usage
    const getColorClasses = () => {
        if (exceeded) {
            return {
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
                text: 'text-red-400',
                icon: 'text-red-500',
                progressBg: 'bg-red-500/20',
                progressBar: 'bg-red-500'
            };
        } else if (approaching) {
            return {
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-500/30',
                text: 'text-yellow-400',
                icon: 'text-yellow-500',
                progressBg: 'bg-yellow-500/20',
                progressBar: 'bg-yellow-500'
            };
        } else {
            return {
                bg: 'bg-green-500/10',
                border: 'border-green-500/30',
                text: 'text-green-400',
                icon: 'text-green-500',
                progressBg: 'bg-green-500/20',
                progressBar: 'bg-green-500'
            };
        }
    };

    const colors = getColorClasses();

    return (
        <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 backdrop-blur-sm`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {/* Icon */}
                        <svg
                            className={`w-5 h-5 ${colors.icon}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                        <h3 className={`font-semibold ${colors.text}`}>
                            API Rate Limit
                        </h3>
                    </div>

                    {/* Usage Stats */}
                    <div className="space-y-2">
                        <div className="flex items-baseline justify-between text-sm">
                            <span className="text-slate-400">
                                Used: <span className={`font-bold ${colors.text}`}>{used.toLocaleString()}</span> / {total.toLocaleString()}
                            </span>
                            <span className="text-slate-400">
                                Remaining: <span className={`font-bold ${colors.text}`}>{remaining.toLocaleString()}</span>
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className={`w-full h-2 ${colors.progressBg} rounded-full overflow-hidden`}>
                            <div
                                className={`h-full ${colors.progressBar} transition-all duration-300`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                        </div>

                        {/* Percentage and Reset Time */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{percentage}% used</span>
                            <span>Resets in: {timeUntilReset}</span>
                        </div>
                    </div>

                    {/* Warning Messages */}
                    {exceeded && (
                        <div className="mt-3 text-sm text-red-400 flex items-start gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Rate limit exceeded! Please wait until the counter resets.</span>
                        </div>
                    )}

                    {approaching && !exceeded && (
                        <div className="mt-3 text-sm text-yellow-400 flex items-start gap-2">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Approaching rate limit! Consider using cached data or waiting until the counter resets.</span>
                        </div>
                    )}
                </div>

                {/* Reset Button */}
                {onReset && (
                    <button
                        onClick={onReset}
                        className="text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center gap-1 flex-shrink-0"
                        title="Reset rate limit counter (for testing)"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};

export default RateLimitIndicator;
