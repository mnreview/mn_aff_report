/**
 * Cache utility for Shopee API responses
 * Uses localStorage with TTL (Time To Live) to reduce API calls
 */

const CACHE_PREFIX = 'shopee_cache_';
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Generate cache key from parameters
 */
export const generateCacheKey = (appId, startTimestamp, endTimestamp) => {
  return `${CACHE_PREFIX}${appId}_${startTimestamp}_${endTimestamp}`;
};

/**
 * Get cached data if available and not expired
 * @param {string} appId - Shopee App ID
 * @param {number} startTimestamp - Start timestamp in seconds
 * @param {number} endTimestamp - End timestamp in seconds
 * @returns {Array|null} - Cached data or null if not found/expired
 */
export const getCachedData = (appId, startTimestamp, endTimestamp) => {
  try {
    const cacheKey = generateCacheKey(appId, startTimestamp, endTimestamp);
    const cachedItem = localStorage.getItem(cacheKey);

    if (!cachedItem) {
      return null;
    }

    const { data, timestamp, ttl = DEFAULT_TTL } = JSON.parse(cachedItem);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < ttl) {
      const remainingTime = Math.ceil((ttl - (now - timestamp)) / 1000 / 60); // in minutes
      console.log(`✅ Cache HIT: Found cached data (expires in ${remainingTime} min)`);
      return data;
    } else {
      // Cache expired, remove it
      console.log('⏰ Cache EXPIRED: Removing old cache');
      localStorage.removeItem(cacheKey);
      return null;
    }
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Save data to cache
 * @param {string} appId - Shopee App ID
 * @param {number} startTimestamp - Start timestamp in seconds
 * @param {number} endTimestamp - End timestamp in seconds
 * @param {Array} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (optional)
 */
export const setCachedData = (appId, startTimestamp, endTimestamp, data, ttl = DEFAULT_TTL) => {
  try {
    const cacheKey = generateCacheKey(appId, startTimestamp, endTimestamp);
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    console.log(`💾 Cache SAVED: ${data.length} records (TTL: ${ttl / 1000 / 60} min)`);
  } catch (error) {
    console.error('Error saving cache:', error);
    // If localStorage is full, try to clear old caches
    if (error.name === 'QuotaExceededError') {
      clearExpiredCaches();
      // Try again after clearing
      try {
        const cacheKey = generateCacheKey(appId, startTimestamp, endTimestamp);
        const cacheItem = {
          data,
          timestamp: Date.now(),
          ttl
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
};

/**
 * Clear cache for specific parameters
 * @param {string} appId - Shopee App ID
 * @param {number} startTimestamp - Start timestamp in seconds
 * @param {number} endTimestamp - End timestamp in seconds
 */
export const clearCache = (appId, startTimestamp, endTimestamp) => {
  try {
    const cacheKey = generateCacheKey(appId, startTimestamp, endTimestamp);
    localStorage.removeItem(cacheKey);
    console.log('🗑️  Cache CLEARED for current parameters');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all Shopee caches
 */
export const clearAllCaches = () => {
  try {
    const keys = Object.keys(localStorage);
    let clearedCount = 0;

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });

    console.log(`🗑️  Cleared ${clearedCount} cache(s)`);
    return clearedCount;
  } catch (error) {
    console.error('Error clearing all caches:', error);
    return 0;
  }
};

/**
 * Clear expired caches only
 */
export const clearExpiredCaches = () => {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    let clearedCount = 0;

    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cachedItem = JSON.parse(localStorage.getItem(key));
          const { timestamp, ttl = DEFAULT_TTL } = cachedItem;

          if (now - timestamp >= ttl) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        } catch (err) {
          // Invalid cache item, remove it
          localStorage.removeItem(key);
          clearedCount++;
        }
      }
    });

    if (clearedCount > 0) {
      console.log(`🗑️  Cleared ${clearedCount} expired cache(s)`);
    }
    return clearedCount;
  } catch (error) {
    console.error('Error clearing expired caches:', error);
    return 0;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const caches = keys.filter(key => key.startsWith(CACHE_PREFIX));
    const now = Date.now();

    let totalSize = 0;
    let validCaches = 0;
    let expiredCaches = 0;

    caches.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        totalSize += value.length;

        const cachedItem = JSON.parse(value);
        const { timestamp, ttl = DEFAULT_TTL } = cachedItem;

        if (now - timestamp < ttl) {
          validCaches++;
        } else {
          expiredCaches++;
        }
      } catch (err) {
        expiredCaches++;
      }
    });

    return {
      total: caches.length,
      valid: validCaches,
      expired: expiredCaches,
      sizeKB: Math.round(totalSize / 1024)
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return { total: 0, valid: 0, expired: 0, sizeKB: 0 };
  }
};
