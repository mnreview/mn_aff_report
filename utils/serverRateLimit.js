/**
 * Server-side Rate Limit Tracker using Supabase
 * Provides 100% accurate tracking across all users, devices, and browsers
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key for server-side operations (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Log an API request to Supabase
 * @param {Object} params - Request parameters
 * @param {string} params.appId - Shopee App ID
 * @param {string} params.endpoint - API endpoint called
 * @param {string} params.requestType - Type of request (e.g., 'conversion_report')
 * @param {string} [params.userId] - User ID (if authenticated)
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - User agent string
 * @param {Object} [params.metadata] - Additional metadata
 * @returns {Promise<Object>} Log entry
 */
export const logApiRequest = async ({
    appId,
    endpoint,
    requestType,
    userId = null,
    ipAddress = null,
    userAgent = null,
    metadata = {}
}) => {
    try {
        const { data, error } = await supabase
            .from('api_request_logs')
            .insert([
                {
                    app_id: appId,
                    endpoint,
                    request_type: requestType,
                    user_id: userId,
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    metadata,
                    timestamp: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error logging API request:', error);
            return null;
        }

        console.log(`📊 API Request Logged: ${requestType} for app_id: ${appId}`);
        return data;
    } catch (error) {
        console.error('Failed to log API request:', error);
        return null;
    }
};

/**
 * Get rate limit status for an app_id from Supabase
 * @param {string} appId - Shopee App ID
 * @returns {Promise<Object>} Rate limit status
 */
export const getRateLimitStatus = async (appId) => {
    try {
        const { data, error } = await supabase
            .rpc('get_rate_limit_status', { p_app_id: appId });

        if (error) {
            console.error('Error getting rate limit status:', error);
            return {
                used: 0,
                remaining: 2000,
                total: 2000,
                percentage: 0,
                error: error.message
            };
        }

        return {
            ...data,
            approaching: data.percentage >= 80,
            exceeded: data.percentage >= 100
        };
    } catch (error) {
        console.error('Failed to get rate limit status:', error);
        return {
            used: 0,
            remaining: 2000,
            total: 2000,
            percentage: 0,
            error: error.message
        };
    }
};

/**
 * Check if rate limit is exceeded for an app_id
 * @param {string} appId - Shopee App ID
 * @returns {Promise<boolean>} True if limit exceeded
 */
export const isRateLimitExceeded = async (appId) => {
    try {
        const status = await getRateLimitStatus(appId);
        return status.used >= status.total;
    } catch (error) {
        console.error('Failed to check rate limit:', error);
        return false;
    }
};

/**
 * Get recent API requests for an app_id
 * @param {string} appId - Shopee App ID
 * @param {number} limit - Number of requests to return
 * @returns {Promise<Array>} Recent requests
 */
export const getRecentRequests = async (appId, limit = 100) => {
    try {
        const { data, error } = await supabase
            .from('api_request_logs')
            .select('*')
            .eq('app_id', appId)
            .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString())
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error getting recent requests:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Failed to get recent requests:', error);
        return [];
    }
};

/**
 * Cleanup old API logs (older than 7 days)
 * @returns {Promise<number>} Number of deleted rows
 */
export const cleanupOldLogs = async () => {
    try {
        const { data, error } = await supabase
            .rpc('cleanup_old_api_logs');

        if (error) {
            console.error('Error cleaning up old logs:', error);
            return 0;
        }

        console.log(`🗑️ Cleaned up ${data} old API logs`);
        return data;
    } catch (error) {
        console.error('Failed to cleanup old logs:', error);
        return 0;
    }
};

/**
 * Get request statistics for an app_id
 * @param {string} appId - Shopee App ID
 * @param {number} hours - Number of hours to look back (default: 24)
 * @returns {Promise<Object>} Request statistics
 */
export const getRequestStats = async (appId, hours = 24) => {
    try {
        const { data, error } = await supabase
            .from('api_request_logs')
            .select('request_type, timestamp')
            .eq('app_id', appId)
            .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

        if (error) {
            console.error('Error getting request stats:', error);
            return { total: 0, byType: {} };
        }

        const byType = {};
        data.forEach(req => {
            byType[req.request_type] = (byType[req.request_type] || 0) + 1;
        });

        return {
            total: data.length,
            byType,
            period: `${hours} hours`
        };
    } catch (error) {
        console.error('Failed to get request stats:', error);
        return { total: 0, byType: {} };
    }
};
