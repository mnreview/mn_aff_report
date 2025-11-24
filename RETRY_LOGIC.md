# Retry Logic Documentation

## Overview

This application implements **automatic retry with exponential backoff** to handle HTTP 429 (Rate Limit) errors from the Shopee Affiliate API.

## Architecture

### Frontend Retry (✅ Implemented)
- **Location**: `src/utils/retry.js` + `src/api/shopee.js`
- **Retries**: Up to 4 times (5 total attempts)
- **Backoff**: Exponential with jitter (1s, 2s, 4s, 8s)
- **Scope**: All Shopee API calls

### Backend (No Retry by Design)
- **Location**: `server.js`, `api/conversion-report.js`
- **Behavior**: Detects 429 errors and returns them to frontend
- **Why no retry?**: Prevents retry multiplication (4×4=16 calls)

## How It Works

### 1. Frontend Makes Request
```javascript
// User clicks "Fetch Report"
fetchConversionReport(appId, secret, params)
  ↓
retryAxiosRequest(() => axios.post(...))
```

### 2. Backend Receives Request
```javascript
// Backend proxy to Shopee API
POST /api/conversion-report
  ↓
axios.post('https://open-api.affiliate.shopee.co.th/graphql')
```

### 3. Shopee Returns 429
```javascript
// Rate limit hit
Response: { errors: [{ extensions: { code: 10030 } }] }
  ↓
Backend returns HTTP 429
```

### 4. Frontend Retries Automatically
```javascript
Attempt 1: ❌ 429 → Wait 1s
Attempt 2: ❌ 429 → Wait 2s
Attempt 3: ❌ 429 → Wait 4s
Attempt 4: ❌ 429 → Wait 8s
Attempt 5: ✅ Success or Final Error
```

## Configuration

### Retry Settings (`src/utils/retry.js`)
```javascript
{
  maxRetries: 4,        // Total: 5 attempts
  baseDelay: 1000,      // 1 second
  maxDelay: 16000,      // 16 seconds cap
}
```

### Backoff Formula
```
delay = baseDelay × 2^attempt + jitter
jitter = ±25% random variance
```

**Example delays:**
- Attempt 0: 1s ± 250ms
- Attempt 1: 2s ± 500ms
- Attempt 2: 4s ± 1s
- Attempt 3: 8s ± 2s
- Attempt 4: 16s ± 4s

## Error Detection

The retry logic triggers for:

### 1. HTTP Status 429
```javascript
error.response.status === 429
```

### 2. GraphQL Error Code 10030 (Shopee-specific)
```javascript
error.response.data.errors[0].extensions.code === 10030
```

### 3. Error Message Keywords
```javascript
error.message.includes('rate limit')
error.message.includes('traffic limiting')
```

## Retry-After Header Support

If Shopee returns a `Retry-After` header, the retry logic will:
1. Parse the header value (seconds or HTTP date)
2. Use it instead of exponential backoff
3. Log: `⏱️ Using Retry-After header: Xms`

## Affected API Endpoints

All three Shopee API functions have retry logic:

1. **fetchConversionReport** - Conversion tracking data
2. **fetchClickReport** - Click analytics with UTM
3. **generateShortLink** - Create affiliate short links

## Console Output

### During Retry
```
⚠️ Rate limit hit (attempt 2/5). Retrying in 2.1s...
🔄 Retrying conversion report request (attempt 2)...
```

### On Success After Retry
```
✅ Request succeeded after 2 retries
```

### On Failure After Max Retries
```
❌ Max retries (4) exceeded for rate limit error
Error fetching data: Rate limit exceeded
```

## Integration with Existing Systems

### 1. Rate Limit Tracking (`src/utils/rateLimit.js`)
- Still tracks all API calls
- Increments counter before retry
- Helps predict when 429 will occur

### 2. Caching System (`src/utils/cache.js`)
- Reduces API calls by 95%
- 10-minute TTL
- Prevents 429 in the first place

### 3. Error Handling (Frontend Components)
- Dashboard, ClickReport, DetailedReport, TopLists
- Show user-friendly messages if all retries fail

## Why This Design?

### ✅ Advantages
1. **Automatic Recovery**: User doesn't need to manually retry
2. **Reduced Load**: Exponential backoff prevents thundering herd
3. **Transparent**: Console logs show retry progress
4. **Smart**: Respects Retry-After headers
5. **Efficient**: Jitter prevents synchronized retries

### ❌ Alternatives Considered

**Backend Retry (Rejected)**
- Problem: 4 backend × 4 frontend = 16 total calls
- Problem: No visibility to user
- Problem: Timeout issues in serverless

**No Retry (Previous Behavior)**
- Problem: Poor user experience
- Problem: Requires manual refresh

## Testing

### Manual Test
```javascript
// In browser console
import { retryWithBackoff } from './src/utils/retry';

// Simulate 429 error
const failingFn = async () => {
  throw { response: { status: 429 } };
};

// Should retry 4 times then fail
await retryWithBackoff(failingFn);
```

### Expected Logs
```
⚠️ Rate limit hit (attempt 1/5). Retrying in 1.0s...
⚠️ Rate limit hit (attempt 2/5). Retrying in 2.1s...
⚠️ Rate limit hit (attempt 3/5). Retrying in 3.9s...
⚠️ Rate limit hit (attempt 4/5). Retrying in 8.2s...
❌ Max retries (4) exceeded for rate limit error
```

## Monitoring

Track retry success/failure:
1. Check browser console for retry logs
2. Monitor `📊 API Requests: X/2000` counter
3. Watch for repeated `❌ Max retries exceeded` (indicates persistent 429)

## Future Improvements

1. **Retry Metrics**: Track retry success rate
2. **Adaptive Backoff**: Adjust based on API response patterns
3. **Circuit Breaker**: Stop retrying if API is consistently down
4. **User Notification**: Show toast during retry attempts

## References

- [Shopee API Docs](https://open.shopee.com/documents)
- [HTTP 429 RFC](https://tools.ietf.org/html/rfc6585#section-4)
- [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff)
