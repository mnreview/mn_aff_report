# Shopee API Caching System

## Overview

This document describes the caching system implemented to reduce Shopee API calls and prevent hitting the API rate limit (2000 requests/hour).

## Implementation

### Cache Strategy

- **Storage:** localStorage (persists across browser refreshes)
- **Cache Key:** `shopee_cache_{appId}_{startTimestamp}_{endTimestamp}`
- **TTL (Time To Live):** 10 minutes (600,000 ms)
- **Auto-expiration:** Expired caches are automatically removed
- **Validation:** Timestamp-based validation on every cache read

### How It Works

1. **Cache Check:** Before making API calls, the system checks if cached data exists for the requested date range
2. **Cache Hit:** If valid cached data is found, it's used immediately (saves API calls)
3. **Cache Miss:** If no cache or expired cache, system fetches from Shopee API
4. **Cache Save:** After successful API fetch, data is cached for future use
5. **Auto-cleanup:** Expired caches are removed when storage quota is exceeded

### Files Modified

1. **src/utils/cache.js** - New cache utility module
   - `getCachedData()` - Retrieve cached data
   - `setCachedData()` - Save data to cache
   - `clearCache()` - Clear specific cache
   - `clearAllCaches()` - Clear all Shopee caches
   - `clearExpiredCaches()` - Remove expired caches only
   - `getCacheStats()` - Get cache statistics

2. **src/components/Dashboard.jsx** - Updated to use caching
   - Added cache checking before API calls
   - Added `usingCache` state to track cache usage
   - Added `forceRefresh` parameter to bypass cache
   - Integrated cache management functions

3. **src/components/Filters.jsx** - Added cache status UI
   - Cache indicator badge (green "Cached" badge)
   - Force Refresh button to bypass cache
   - Clear Cache button in navbar

## User Interface

### Cache Indicators

1. **Cached Badge** (Green)
   - Appears when data is loaded from cache
   - Shows data is recent (< 10 minutes old)
   - Saves API quota

2. **Refresh Button** (Orange)
   - Forces fresh data fetch from API
   - Bypasses cache
   - Updates cached data

3. **Clear Cache Button** (Navbar)
   - Clears all cached data
   - Useful for troubleshooting
   - Shows count of cleared caches

## Benefits

### API Quota Savings

**Before Caching:**
- Every dashboard load = 1-100 API calls
- 20 users × 50 calls = 1000 API calls
- High risk of hitting 2000/hour limit

**After Caching:**
- First load = 1-100 API calls (cached)
- Subsequent loads within 10 min = 0 API calls
- 20 users × 50 calls (first time) + 0 calls (refreshes) = Significant savings

### Performance Improvements

- Instant data loading from cache
- No network latency
- Better user experience
- Reduced server load

## Configuration

### Adjusting TTL

To change cache duration, edit `DEFAULT_TTL` in `src/utils/cache.js`:

```javascript
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

// Examples:
// 5 minutes: 5 * 60 * 1000
// 30 minutes: 30 * 60 * 1000
// 1 hour: 60 * 60 * 1000
```

### Cache Key Format

Cache keys follow this pattern:
```
shopee_cache_{appId}_{startTimestamp}_{endTimestamp}
```

Example:
```
shopee_cache_12345_1700000000_1700086399
```

## Usage Examples

### Automatic Caching (Default)

```javascript
// User clicks "Fetch Data"
// System automatically checks cache first
handleSearch();

// Console output (cache hit):
// ✅ Cache HIT: Found cached data (expires in 8 min)

// Console output (cache miss):
// 💾 Cache SAVED: 5000 records (TTL: 10 min)
```

### Force Refresh

```javascript
// User clicks "Refresh" button
// Bypasses cache and fetches fresh data
handleSearch(startDate, endDate, true);

// Always fetches from API
// Updates cache with new data
```

### Clear All Caches

```javascript
// User clicks "Clear Cache" in navbar
handleClearCache();

// Console output:
// 🗑️ Cleared 3 cache(s)
```

## Technical Details

### localStorage Quota

- Most browsers: ~5-10MB per domain
- Cache includes full conversion data
- Auto-cleanup when quota exceeded
- Removes expired caches first

### Cache Validation

Every cache read checks:
1. Does cache exist?
2. Is cache data valid JSON?
3. Is cache timestamp valid?
4. Has TTL expired?

If any check fails, cache is invalidated and removed.

### Error Handling

- **QuotaExceededError:** Triggers auto-cleanup of expired caches
- **JSON Parse Error:** Removes corrupted cache entry
- **Missing Data:** Treats as cache miss, fetches from API

## Monitoring

### Console Logs

The cache system logs all operations:

```
✅ Cache HIT: Found cached data (expires in 8 min)
💾 Cache SAVED: 5000 records (TTL: 10 min)
⏰ Cache EXPIRED: Removing old cache
🗑️ Cache CLEARED for current parameters
🗑️ Cleared 3 cache(s)
```

### Cache Statistics

Use `getCacheStats()` to get cache information:

```javascript
const stats = getCacheStats();
// {
//   total: 5,      // Total cache entries
//   valid: 3,      // Valid (not expired)
//   expired: 2,    // Expired entries
//   sizeKB: 1024   // Total size in KB
// }
```

## Best Practices

1. **Use Cache for Repeated Queries**
   - Same date range within 10 minutes = Use cache
   - Different date range = New API call + new cache

2. **Force Refresh When Needed**
   - Recent data changed on Shopee
   - Troubleshooting data issues
   - Need guaranteed fresh data

3. **Clear Cache Periodically**
   - Browser storage getting full
   - Switching between different App IDs
   - After major data updates

4. **Monitor API Usage**
   - Check console logs for cache hits/misses
   - Track ratio of cache hits to API calls
   - Adjust TTL based on usage patterns

## Future Enhancements

Potential improvements:

1. **Smarter Cache Keys**
   - Include filters in cache key
   - Partial data caching

2. **Cache Preloading**
   - Prefetch common date ranges
   - Background cache updates

3. **Cache Statistics UI**
   - Dashboard showing cache hit rate
   - API call savings counter

4. **Configurable TTL**
   - User-adjustable cache duration
   - Different TTL for different date ranges

5. **IndexedDB Migration**
   - Larger storage capacity
   - Better performance for large datasets
