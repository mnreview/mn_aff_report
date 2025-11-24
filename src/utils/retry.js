/**
 * Retry Logic with Exponential Backoff
 * Automatically retries failed API calls when rate limit (429) is hit
 */

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000ms)
 * @param {number} maxDelay - Maximum delay in milliseconds (default: 16000ms)
 * @returns {number} Delay in milliseconds
 */
const calculateBackoff = (attempt, baseDelay = 1000, maxDelay = 16000) => {
  // Exponential backoff: baseDelay * 2^attempt
  // attempt 0: 1s, 1: 2s, 2: 4s, 3: 8s, 4: 16s
  const exponentialDelay = baseDelay * Math.pow(2, attempt);

  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, maxDelay);

  // Add jitter (random ±25%) to prevent thundering herd
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  const finalDelay = Math.round(cappedDelay + jitter);

  return finalDelay;
};

/**
 * Check if error is a rate limit error (HTTP 429)
 * @param {Error} error - Error object
 * @returns {boolean} True if rate limit error
 */
const isRateLimitError = (error) => {
  // Check HTTP status code 429
  if (error.response && error.response.status === 429) {
    return true;
  }

  // Check for GraphQL error code 10030 (Shopee rate limit)
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const hasRateLimitError = errors.some(err =>
      err.extensions?.code === 10030 ||
      err.message?.toLowerCase().includes('rate limit') ||
      err.message?.toLowerCase().includes('traffic limiting')
    );
    if (hasRateLimitError) {
      return true;
    }
  }

  // Check error message
  if (error.message) {
    const msg = error.message.toLowerCase();
    if (msg.includes('rate limit') || msg.includes('429')) {
      return true;
    }
  }

  return false;
};

/**
 * Get retry delay from Retry-After header if present
 * @param {Error} error - Error object
 * @returns {number|null} Delay in milliseconds or null
 */
const getRetryAfterDelay = (error) => {
  if (!error.response?.headers) {
    return null;
  }

  const retryAfter = error.response.headers['retry-after'];
  if (!retryAfter) {
    return null;
  }

  // Retry-After can be in seconds (number) or HTTP date
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) {
    return seconds * 1000; // Convert to milliseconds
  }

  // Try parsing as date
  const date = new Date(retryAfter);
  if (!isNaN(date.getTime())) {
    return Math.max(0, date.getTime() - Date.now());
  }

  return null;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 4)
 * @param {number} options.baseDelay - Base delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 16000)
 * @param {Function} options.onRetry - Callback on retry attempt
 * @returns {Promise} Result of the function
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 4,
    baseDelay = 1000,
    maxDelay = 16000,
    onRetry = null
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Execute the function
      const result = await fn();

      // Success - return result
      if (attempt > 0) {
        console.log(`✅ Request succeeded after ${attempt} ${attempt === 1 ? 'retry' : 'retries'}`);
      }
      return result;

    } catch (error) {
      lastError = error;

      // Check if this is a rate limit error
      const isRateLimit = isRateLimitError(error);

      // If not a rate limit error, don't retry
      if (!isRateLimit) {
        throw error;
      }

      // If we've exhausted all retries, throw the error
      if (attempt >= maxRetries) {
        console.error(`❌ Max retries (${maxRetries}) exceeded for rate limit error`);
        throw error;
      }

      // Calculate delay for next retry
      let delay = calculateBackoff(attempt, baseDelay, maxDelay);

      // Check for Retry-After header
      const retryAfterDelay = getRetryAfterDelay(error);
      if (retryAfterDelay !== null) {
        delay = retryAfterDelay;
        console.log(`⏱️  Using Retry-After header: ${delay}ms`);
      }

      // Log retry attempt
      const delaySeconds = (delay / 1000).toFixed(1);
      console.warn(
        `⚠️  Rate limit hit (attempt ${attempt + 1}/${maxRetries + 1}). ` +
        `Retrying in ${delaySeconds}s...`
      );

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, delay, error);
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  // This should never be reached, but just in case
  throw lastError;
};

/**
 * Retry wrapper for axios requests specifically
 * @param {Function} axiosRequest - Axios request function
 * @param {Object} retryOptions - Retry options (same as retryWithBackoff)
 * @returns {Promise} Axios response
 */
export const retryAxiosRequest = async (axiosRequest, retryOptions = {}) => {
  return retryWithBackoff(axiosRequest, {
    maxRetries: 4,
    baseDelay: 1000,
    maxDelay: 16000,
    ...retryOptions
  });
};

export default {
  retryWithBackoff,
  retryAxiosRequest,
  isRateLimitError,
  calculateBackoff
};
