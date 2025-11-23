import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto-js';
import 'dotenv/config';
import { logApiRequest, getRateLimitStatus, isRateLimitExceeded } from './utils/serverRateLimit.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

// Helper to generate signature
const generateSignature = (appId, secret, payload, timestamp) => {
    const factor = appId + timestamp + payload + secret;
    return crypto.SHA256(factor).toString(crypto.enc.Hex);
};

app.post('/api/conversion-report', async (req, res) => {
    const { appId, secret, query } = req.body;

    if (!appId || !secret || !query) {
        return res.status(400).json({ error: 'Missing appId, secret, or query' });
    }

    // Check rate limit before making request
    const limitExceeded = await isRateLimitExceeded(appId);
    if (limitExceeded) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'You have exceeded Shopee API rate limit of 2000 requests per hour',
            code: 10030
        });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({ query });
    const signature = generateSignature(appId, secret, payload, timestamp);

    try {
        // Log the API request to Supabase
        await logApiRequest({
            appId,
            endpoint: SHOPEE_API_URL,
            requestType: 'conversion_report',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            metadata: {
                query: query.substring(0, 100) // First 100 chars for reference
            }
        });
        const response = await axios.post(
            SHOPEE_API_URL,
            { query },
            {
                headers: {
                    'Authorization': `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check for GraphQL errors in response
        if (response.data && response.data.errors) {
            const errors = response.data.errors;
            const firstError = errors[0];

            // Check for rate limit error (code 10030)
            if (firstError.extensions?.code === 10030 ||
                firstError.message?.toLowerCase().includes('rate limit') ||
                firstError.message?.toLowerCase().includes('traffic limiting')) {

                console.error('⚠️ Rate Limit Exceeded:', firstError.message);
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: 'You have exceeded Shopee API rate limit of 2000 requests per hour',
                    code: 10030,
                    shopeeError: firstError,
                    errors: errors
                });
            }
        }

        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);

        // Check if it's a rate limit error from HTTP status
        if (error.response && error.response.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: 'You have exceeded Shopee API rate limit of 2000 requests per hour',
                code: 10030,
                details: error.response.data
            });
        }

        res.status(500).json({
            error: error.message,
            details: error.response ? error.response.data : null
        });
    }
});

// Get rate limit status endpoint
app.get('/api/rate-limit-status/:appId', async (req, res) => {
    const { appId } = req.params;

    if (!appId) {
        return res.status(400).json({ error: 'Missing appId' });
    }

    try {
        const status = await getRateLimitStatus(appId);
        res.json(status);
    } catch (error) {
        console.error('Error getting rate limit status:', error);
        res.status(500).json({
            error: 'Failed to get rate limit status',
            details: error.message
        });
    }
});

// Log a short link generation request
app.post('/api/log-link-generation', async (req, res) => {
    const { appId } = req.body;

    if (!appId) {
        return res.status(400).json({ error: 'Missing appId' });
    }

    try {
        await logApiRequest({
            appId,
            endpoint: SHOPEE_API_URL,
            requestType: 'generate_link',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            metadata: {}
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error logging link generation:', error);
        res.status(500).json({
            error: 'Failed to log request',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
