/**
 * Rate Limit Tracker for Shopee API
 * Tracks API request count to prevent hitting the 2000 requests/hour limit
 */

const RATE_LIMIT_KEY = 'shopee_rate_limit';
const MAX_REQUESTS_PER_HOUR = 2000;
const WARNING_THRESHOLD = 0.8; // Warning at 80% usage (1600 requests)
const HOUR_IN_MS = 60 * 60 * 1000;

/**
 * Get current rate limit data
 * @returns {Object} { count, resetTime, requests }
 */
export const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    if (!data) {
      return initializeRateLimit();
    }

    const { count, resetTime, requests } = JSON.parse(data);
    const now = Date.now();

    // Check if we should reset the counter (hourly reset)
    if (now >= resetTime) {
      return initializeRateLimit();
    }

    return { count, resetTime, requests: requests || [] };
  } catch (error) {
    console.error('Error reading rate limit data:', error);
    return initializeRateLimit();
  }
};

/**
 * Initialize or reset rate limit data
 * @returns {Object} Fresh rate limit data
 */
const initializeRateLimit = () => {
  const now = Date.now();
  const resetTime = now + HOUR_IN_MS;
  const data = {
    count: 0,
    resetTime,
    requests: []
  };

  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error initializing rate limit:', error);
  }

  return data;
};

/**
 * Increment request count
 * @param {number} requestCount - Number of requests to add (default: 1)
 * @returns {Object} Updated rate limit data
 */
export const incrementRequestCount = (requestCount = 1) => {
  const data = getRateLimitData();
  const now = Date.now();

  data.count += requestCount;
  data.requests.push({
    timestamp: now,
    count: requestCount
  });

  // Keep only last 100 request records to avoid storage bloat
  if (data.requests.length > 100) {
    data.requests = data.requests.slice(-100);
  }

  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    console.log(`📊 API Requests: ${data.count}/${MAX_REQUESTS_PER_HOUR} (${getUsagePercentage()}%)`);
  } catch (error) {
    console.error('Error updating rate limit:', error);
  }

  return data;
};

/**
 * Get remaining requests
 * @returns {number} Number of requests remaining
 */
export const getRemainingRequests = () => {
  const { count } = getRateLimitData();
  return Math.max(0, MAX_REQUESTS_PER_HOUR - count);
};

/**
 * Get usage percentage
 * @returns {number} Usage percentage (0-100)
 */
export const getUsagePercentage = () => {
  const { count } = getRateLimitData();
  return Math.round((count / MAX_REQUESTS_PER_HOUR) * 100);
};

/**
 * Check if approaching rate limit
 * @returns {boolean} True if usage >= warning threshold
 */
export const isApproachingLimit = () => {
  const { count } = getRateLimitData();
  return count >= (MAX_REQUESTS_PER_HOUR * WARNING_THRESHOLD);
};

/**
 * Check if rate limit exceeded
 * @returns {boolean} True if limit exceeded
 */
export const isLimitExceeded = () => {
  const { count } = getRateLimitData();
  return count >= MAX_REQUESTS_PER_HOUR;
};

/**
 * Get time until reset in human-readable format
 * @returns {string} Time remaining (e.g., "45 minutes")
 */
export const getTimeUntilReset = () => {
  const { resetTime } = getRateLimitData();
  const now = Date.now();
  const diff = resetTime - now;

  if (diff <= 0) {
    return 'Resetting...';
  }

  const minutes = Math.ceil(diff / 1000 / 60);

  if (minutes < 1) {
    return 'Less than a minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
  }
};

/**
 * Get rate limit status for UI display
 * @returns {Object} Status object with all relevant info
 */
export const getRateLimitStatus = () => {
  const data = getRateLimitData();
  const remaining = getRemainingRequests();
  const percentage = getUsagePercentage();
  const approaching = isApproachingLimit();
  const exceeded = isLimitExceeded();
  const timeUntilReset = getTimeUntilReset();

  return {
    used: data.count,
    remaining,
    total: MAX_REQUESTS_PER_HOUR,
    percentage,
    approaching,
    exceeded,
    timeUntilReset,
    resetTime: data.resetTime,
    warningThreshold: Math.round(MAX_REQUESTS_PER_HOUR * WARNING_THRESHOLD)
  };
};

/**
 * Reset rate limit counter manually (for testing or troubleshooting)
 */
export const resetRateLimit = () => {
  initializeRateLimit();
  console.log('🔄 Rate limit counter reset');
};

/**
 * Get request history
 * @returns {Array} Array of request records
 */
export const getRequestHistory = () => {
  const { requests } = getRateLimitData();
  return requests || [];
};

/**
 * Get rate limit status from server (100% accurate)
 * Falls back to localStorage if server is unavailable
 * @param {string} appId - Shopee App ID
 * @returns {Promise<Object>} Rate limit status
 */
export const getRateLimitStatusFromServer = async (appId) => {
  if (!appId) {
    console.warn('No appId provided, using localStorage data');
    return getRateLimitStatus();
  }

  try {
    // Try to get data from server first
    const response = await fetch(`http://localhost:3001/api/rate-limit-status/${appId}`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const serverData = await response.json();

    // Format server data to match our interface
    const timeUntilReset = formatTimeUntilReset(serverData.reset_time);

    console.log('✅ Using server-side rate limit data (100% accurate)');
    return {
      used: serverData.used,
      remaining: serverData.remaining,
      total: serverData.total,
      percentage: serverData.percentage,
      approaching: serverData.percentage >= 80,
      exceeded: serverData.percentage >= 100,
      timeUntilReset,
      resetTime: new Date(serverData.reset_time).getTime(),
      warningThreshold: 1600,
      source: 'server' // Indicate data source
    };
  } catch (error) {
    console.warn('⚠️  Server unavailable, falling back to localStorage:', error.message);
    const localData = getRateLimitStatus();
    return {
      ...localData,
      source: 'localStorage' // Indicate fallback
    };
  }
};

/**
 * Format server timestamp to human-readable time
 * @param {string} resetTime - ISO timestamp
 * @returns {string} Human-readable time
 */
const formatTimeUntilReset = (resetTime) => {
  const now = new Date();
  const reset = new Date(resetTime);
  const diff = reset - now;

  if (diff <= 0) {
    return 'Resetting...';
  }

  const minutes = Math.ceil(diff / 1000 / 60);

  if (minutes < 1) {
    return 'Less than a minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else if (minutes < 60) {
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
  }
};

/**
 * Log a link generation request to server
 * @param {string} appId - Shopee App ID
 */
export const logLinkGeneration = async (appId) => {
  if (!appId) return;

  try {
    await fetch('http://localhost:3001/api/log-link-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ appId })
    });
  } catch (error) {
    console.warn('Failed to log link generation to server:', error);
    // Still increment local counter as fallback
    incrementRequestCount(1);
  }
};
